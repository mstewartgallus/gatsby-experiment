import { graphql } from "gatsby";

export const query = graphql`
fragment Url on Post {
   url: gatsbyPath(filePath: "/{post.slug}")
}
`;
