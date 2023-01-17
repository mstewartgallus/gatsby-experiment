import RemarkGfm from 'remark-gfm';
import RehypeSlug from 'rehype-slug';
import * as url from 'url';

const resolve = (name) => url.fileURLToPath(new URL(name, import.meta.url));

const config = {
    siteMetadata: {
        title: "Words to Kick Your Teeth Out",
        description: "lol lmao",
        siteUrl: "https://mstewartgallus.github.io"
    },
    graphqlTypegen: true,
    plugins: [
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
                path: resolve('src/posts'),
                name: 'posts'
            }
        }
    ]
};

export default config;
