import * as moment from "moment";
import * as path from "path";

export async function onCreateNode({ node, actions, getNode }){
    const { createNodeField } = actions;

    if (node.internal.type !== 'MarkdownRemark') {
        return;
    }

    const markdownRemark = node;

    const file = getNode(markdownRemark.parent);
    const { category, url } = await compute({ markdownRemark, file });

    await createNodeField({ node, name: 'category', value: category });
    await createNodeField({ node, name: 'url', value: url });
}

async function compute({ markdownRemark, file }) {
    const category = file.relativeDirectory;

    const { date, title } = markdownRemark.frontmatter;

    // 2022-10-20 10:49 -0800
    const utc = moment
        .utc(date, 'YYYY-MM-DD HH:mm Z', 'en')
        .format("YYYY/MM/DD");

    const url = `/${category}/${utc}/${title}/`;

    return { category, url };
}
