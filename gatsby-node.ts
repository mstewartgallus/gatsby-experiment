import * as moment from "moment";
import { promises as fs } from "fs";
import { spawn } from "child_process";
import process from "process";

function postNodeOf({ node, getNode }) {
    const category = getNode(node.parent).relativeDirectory;

    let { date, title, notice, tags, places } = node.frontmatter;

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

    const slug = `/${category}/${utc}/${title}/`;

    return { slug, date, category, title, notice, tags, places };
}

const resolveParentField = (field) => async (source, args, context, info) => {
    const parent = await context.nodeModel.getNodeById({ id: source.parent });
    const value = await context.nodeModel.getFieldValue(parent, field);
    if (!value) {
        throw new Error(`no ${field}`);
    }
    return value;
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
        throw new Error(`pagefind ${code}`);
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
    if (node.internal.type !== 'MarkdownRemark') {
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

export async function createResolvers({ createResolvers }) {
    await createResolvers({
        Post: {
            html: { type: 'String!', resolve: resolveParentField('html') },
            next: { type: 'Post', resolve: next },
            previous: { type: 'Post', resolve: previous }
        }
    });
}

export const onCreateWebpackConfig = async ({ stage, actions, plugins }) => {
    await actions.setWebpackConfig({ plugins: [pagefindPlugin] });
};
