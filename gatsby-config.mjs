import RemarkGfm from 'remark-gfm';
import RehypeSlug from 'rehype-slug';
import * as url from 'url';
import * as path from 'path';

const metaUrl = url.pathToFileURL(path.resolve(url.fileURLToPath(import.meta.url)));
const resolve = path => url.fileURLToPath(new URL(path, metaUrl));

const config = {
    siteMetadata: {
        title: "Words to Kick Your Teeth Out",
        description: "lol lmao",
        siteUrl: "https://mstewartgallus.github.io"
    },
    graphqlTypegen: true,
    plugins: [
        "gatsby-plugin-sitemap",
        {
            resolve: "gatsby-plugin-mdx",
            options: {
                extensions: ['.md', '.mdx', '.markdown'],
                mdxOptions: {
                    remarkPlugins: [RemarkGfm],
                    rehypePlugins: [RehypeSlug],
               }
            }
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: resolve('./src/posts'),
                name: 'posts'
            }
        }
    ]
};

export default config;
