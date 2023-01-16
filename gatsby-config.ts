import type { GatsbyConfig } from "gatsby";

// For "reasons" we need to do workarounds like this
// const RemarkGFM = (await import("remark-gfm")).default;
// const RehypeSlug = (await import("rehype-slug")).default;

const config: GatsbyConfig = {
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
                    // remarkPlugins: [RemarkGfm],
                    // rehypePlugins: [RehypeSlug]
                }
            }
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: `${__dirname}/src/posts`,
                name: 'posts'
            }
        }
    ]
};

export default config;
