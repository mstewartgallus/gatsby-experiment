import * as React from "react";
import { Link, graphql, useStaticQuery } from "gatsby";

const usePosts = () => useStaticQuery(graphql`
query {
  allPost(sort: {date: DESC}) {
    nodes {
      title
      slug
    }
  }
}`).allPost.nodes;

export const PostList = () => {
    const posts = usePosts();

    if (!posts || posts.length === 0) {
        return null;
    }
    return <ol reversed>
    {posts.map(({ slug, title }) =>
        <li key={slug}>
          <Link to={slug}>{title}</Link>
        </li>)}
    </ol>
};

export default PostList;
