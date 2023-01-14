import type { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
    siteMetadata: {
        title: "Words to Kick Your Teeth Out",
        description: "lol lmao",
        siteUrl: "https://mstewartgallus.github.io"
    },
    graphqlTypegen: true,
    plugins: [
        {
            resolve: "gatsby-source-filesystem",
            options: {
                path: `${__dirname}/src/posts`,
                name: "posts"
            }
        },
        {
            resolve: "gatsby-transformer-remark",
            options: {
                footnotes: true,
                gfm: true,
                plugins: []
            }
        }
    ]
}

export default config
