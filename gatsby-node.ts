import * as moment from "moment";
import { promises as fs } from "fs";

export async function createSchemaCustomization({ actions }) {
    const { createTypes } = actions;
    const types = await fs.readFile('type-defs.gql', { encoding: `utf-8` });
    await createTypes(types);
};

export async function onCreateNode({ node, actions, getNode }) {
    const { createNodeField } = actions;
    if (node.internal.type !== 'MarkdownRemark') {
        return;
    }

    const { category, slug } = compute({ node, getNode });

    await createNodeField({ name: 'category', node, value: category });
    await createNodeField({ name: 'slug', node, value: slug });
}

export async function createResolvers({ createResolvers }) {
    await createResolvers({
        MarkdownRemark: {
            next: { type: 'MarkdownRemark', resolve: next },
            previous: { type: 'MarkdownRemark', resolve: previous }
        }
    });
}

function compute({ node, getNode }) {
    const category = getNode(node.parent).relativeDirectory;

    const { date, title } = node.frontmatter;

    // 2022-10-20 10:49 -0800
    const utc = moment
        .utc(date, 'YYYY-MM-DD HH:mm Z', 'en')
        .format("YYYY/MM/DD");

    const slug = `/${category}/${utc}/${title}/`;
    return { category, slug };
}

async function next(source, args, context, info) {
    const { id, frontmatter: { date }} = source;
    const { entries } = await context.nodeModel.findAll({
        type: 'MarkdownRemark',
        query: {
            limit: 1,
            sort: { fields: ['frontmatter.date'], order: ['ASCC'] },
            filter: {
                id: { ne: id },
                frontmatter: { date: { gte: date } }
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
    const { id, frontmatter: { date }} = source;
    const { entries } = await context.nodeModel.findAll({
        type: 'MarkdownRemark',
        query: {
            limit: 1,
            sort: { fields: ['frontmatter.date'], order: ['DESC'] },
            filter: {
                id: { ne: id },
                frontmatter: { date: { lte: date } }
            }
        }
    });
    const x = Array.from(entries);
    if (x.length > 0) {
        return x[0];
    }
    return null;
}
