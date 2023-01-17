import { graphql, useStaticQuery } from "gatsby";

export const usePostTags = () => {
    const posts = useStaticQuery(graphql`
query {
  allPost {
     place: distinct(field: {metadata: {places: SELECT}})
     tags: distinct(field: {metadata: {tags: SELECT}})
     category: distinct(field: {metadata: {category: SELECT}})
  }
}`).allPost;
    return posts;
};
