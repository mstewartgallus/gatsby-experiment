import moment from "moment";
import path from "path";
import { promises as fs } from "fs";
import { spawn } from "child_process";
import process from "process";
import slugify from "slugify";
import grayMatter from "gray-matter";

const frontmatter = source => {
    return grayMatter(source, {
        language: 'yaml',
        engines: {
            js: () => {
                return {}
            },
            javascript: () => {
                return {}
            },
            json: () => {
                return {}
            },
        }
    });
};

function slugOf({ date, category, title }) {
    // 2022-10-20 10:49 -0800
    const utc = moment
        .utc(date, 'YYYY-MM-DD HH:mm Z', 'en')
        .format("YYYY/MM/DD");

    // FIXME replace / in title with something else
    const opts = { lower: true };
    const catSlug = slugify(category, opts);
    const titleSlug = slugify(title, opts);

    return `/${catSlug}/${utc}/${titleSlug}/`;
}

const metadata = frontmatter => {
    let { category, date, title, notice, tags, places } = frontmatter;

    if (!category) {
        throw new Error("no category");
    }
    if (!date) {
        throw new Error("no date");
    }
    if (!title) {
        throw new Error("no title");
    }

    notice = notice ?? [];
    tags = tags ?? [];
    places = places ?? [];

    const slug = slugOf({ category, date, title });

    return { slug, date, category, title, notice, tags, places };
};

const parsePoem = source => {
    source = source.trim();
    const stanzas = source.split('\n\n');
    return stanzas.map(stanza => {
        stanza = stanza.trim();
        const lines = stanza.split('\n');
        return lines.map(line => {
            line = line.trim();
            const segments = line.split('‖');
            return segments;
        });
    });
};
const postNodeOfPoemFile = async ({ node, loadNodeContent }) => {
    const category = node.relativeDirectory;

    const { content, data } = frontmatter(await loadNodeContent(node));

    const ast = parsePoem(content);

    return {
        metadata: metadata({ category, ...data }),
        content: {
            __typename: 'PoemContent',
            body: ast
        }};
};

const postNodeOfMdx = async ({ node, getNode }) => {
    const parent = getNode(node.parent);
    const category = parent.relativeDirectory;

    const contentFilePath = node.internal.contentFilePath;

    return {
        metadata: metadata({ category, ...node.frontmatter }),
        content: {
            __typename: 'MdxContent',
            contentFilePath
        }
    };
};

async function next(source, args, context, info) {
    const { id, metadata: { date } } = source;
    const { entries } = await context.nodeModel.findAll({
        type: 'Post',
        query: {
            limit: 1,
            sort: { fields: ['date'], order: ['ASC'] },
            filter: {
                id: { ne: id },
                date: { gte: date }
            }
        }
    });
    const x = Array.from(entries);
    if (x.length > 0) {
        return x[0];
    }
    return null;
}

async function previous(source, args, context, info) {
    const { id, metadata: { date } } = source;
    const { entries } = await context.nodeModel.findAll({
        type: 'Post',
        query: {
            limit: 1,
            sort: { fields: ['date'], order: ['DESC'] },
            filter: {
                id: { ne: id },
                date: { lte: date }
            }
        }
    });
    const x = Array.from(entries);
    if (x.length > 0) {
        return x[0];
    }
    return null;
}

const pagefind = async () => {
    const pf = spawn("yarn",
                     ["run", "pagefind",
                      "--source", "public",
                      "--bundle-dir", "static/pagefind"]);
    pf.stdout.on('data', (data) => {
        process.stdout.write(data);
    });
    pf.stderr.on('data', (data) => {
        process.stderr.write(data);
    });
    const code = await new Promise(r => pf.on('exit', r));
    if (code !== 0) {
        process.stderr.write(`pagefind ${code}`);
    }
};

const pagefindPlugin = {
    apply(compiler) {
        compiler.hooks.done.tapPromise('PagefindPlugin', pagefind);
    }
};

const onCreateFileNode = async props => {
    const {
        node,
        actions,
        createContentDigest,
        createNodeId,
        getNode
    } = props;
    if (node.extension !== 'poem') {
        return;
    }

    const post = await postNodeOfPoemFile(props);
    const postNode = {
        ...post,
        children: [],
        parent: node.id,
        id: createNodeId(`${node.id} >>> POST`),
        internal: {
            type: 'Post',
            contentDigest: createContentDigest(post)
        }
    };
    await actions.createNode(postNode);
    await actions.createParentChildLink({ parent: node, child: postNode });
};

const onCreateMdxNode = async ({
    node,
    actions,
    createContentDigest,
    createNodeId,
    getNode
}) => {
    const post = await postNodeOfMdx({ node, getNode });
    const postNode = {
        ...post,
        children: [],
        parent: node.id,
        id: createNodeId(`${node.id} >>> POST`),
        internal: {
            type: 'Post',
            contentDigest: createContentDigest(post)
        }
    };
    await actions.createNode(postNode);
    await actions.createParentChildLink({ parent: node, child: postNode });
};

export async function createSchemaCustomization({ actions, schema }) {
    const { createTypes } = actions;
    const types = await fs.readFile('type-defs.gql', { encoding: `utf-8` });
    await createTypes(types);
    await createTypes([schema.buildUnionType({
        name: 'Content',
        resolveType(value) {
            // FIXME ugly hack
            const typename = value.__typename;
            if (!typename) {
                throw new Error("no typename");
            }
            return typename;
        }
    })]);
};

export const onCreateNode = async props => {
    switch (props.node.internal.type) {
        case 'Mdx':
            return await onCreateMdxNode(props);
        case 'File':
            return await onCreateFileNode(props);
    }
}

export const createResolvers = async ({ createResolvers }) => {
    await createResolvers({
        Post: {
            next: { type: 'Post', resolve: next },
            previous: { type: 'Post', resolve: previous }
        }
    });
};

export const createPages = async ({ graphql, actions, reporter }) => {
    const { createPage } = actions;

    const result = await graphql(`
    query Posts {
      allPost {
        nodes {
          id
          metadata {
            slug
          }
          content {
            __typename
            ... on MdxContent {
               contentFilePath
            }
            ... on PoemContent {
               body
            }
          }
        }
      }
    }
`);

    if (result.errors) {
        reporter.panicOnBuild('Error loading posts', result.errors);
        return;
    }

    const posts = result.data.allPost.nodes
    const mdxTemplate = path.resolve('./src/templates/post.tsx');
    const poemTemplate = path.resolve('./src/templates/post.tsx');
    for (const post of posts) {
        const { id, metadata: { slug }, content } = post;
        switch (content.__typename) {
            case 'PoemContent':
                {
                    await createPage({
                        path: slug,
                        component: `${mdxTemplate}`,
                        context: { id }
                    });
                    break;
                }

            case 'MdxContent':
                {
                    const contentFilePath = content.contentFilePath;
                    await createPage({
                        path: slug,
                        component: `${mdxTemplate}?__contentFilePath=${contentFilePath}`,
                        context: { id }
                    });
                    break;
                }
        }
    }
};

export const onCreateWebpackConfig = async ({ stage, actions, plugins }) => {
    await actions.setWebpackConfig({ plugins: [pagefindPlugin] });
};
