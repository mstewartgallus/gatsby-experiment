import type { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  siteMetadata: {
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
