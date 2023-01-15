import moment from "moment";
import path from "path";
import { promises as fs } from "fs";
import { spawn } from "child_process";
import process from "process";
import slugify from "slugify";

function postNodeOf({ node, getNode }) {
    const parent = getNode(node.parent);
    const category = parent.relativeDirectory;

    let { date, title, notice, tags, places } = node.frontmatter;

    const contentFilePath = node.internal.contentFilePath;

    if (!date) {
        throw new Error("no date");
    }
    if (!title) {
        throw new Error("no title");
    }

    notice = notice ?? [];
    tags = tags ?? [];
    places = places ?? [];

    // 2022-10-20 10:49 -0800
    const utc = moment
        .utc(date, 'YYYY-MM-DD HH:mm Z', 'en')
        .format("YYYY/MM/DD");

    // FIXME replace / in title with something else
    const opts = { lower: true };
    const catSlug = slugify(category, opts);
    const titleSlug = slugify(title, opts);

    const slug = `/${catSlug}/${utc}/${titleSlug}/`;
    return { slug, date,
             category, title, notice, tags, places,
             contentFilePath };
}

async function next(source, args, context, info) {
    const { id, date } = source;
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
    const { id, date } = source;
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

const afterEmit = async compilation => {
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
        compiler.hooks.afterEmit.tapPromise('PagefindPlugin', afterEmit);
    }
};

export async function createSchemaCustomization({ actions }) {
    const { createTypes } = actions;
    const types = await fs.readFile('type-defs.gql', { encoding: `utf-8` });
    await createTypes(types);
};

export const onCreateNode =
    async ({
        node,
        actions,
        createContentDigest,
        createNodeId,
        getNode
    }) => {
    if (node.internal.type !== 'Mdx') {
        return;
    }

    const post = postNodeOf({ node, getNode });
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
          slug
          contentFilePath
        }
      }
    }
  `);

    if (result.errors) {
        reporter.panicOnBuild('Error loading posts', result.errors);
        return;
    }

    const posts = result.data.allPost.nodes
    const postTemplate = path.resolve('./src/templates/post.tsx');
    for (const post of posts) {
        // FIXME slugify
        const { id, slug, contentFilePath } = post;
        await createPage({
            path: slug,
            component: `${postTemplate}?__contentFilePath=${contentFilePath}`,
            context: { id }
        });
    }
};

export const onCreateWebpackConfig = async ({ stage, actions, plugins }) => {
    await actions.setWebpackConfig({ plugins: [pagefindPlugin] });
};
