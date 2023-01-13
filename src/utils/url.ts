import { graphql } from "gatsby";

export const query = graphql`
fragment Url on MarkdownRemark {
   url: gatsbyPath(filePath: "/{markdownRemark.slug}")
}
`;
