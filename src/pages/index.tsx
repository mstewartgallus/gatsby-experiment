import * as React from "react";
import { Link, graphql } from "gatsby";
import type { HeadFC, PageProps } from "gatsby";
import Url from "../utils/url.ts";

export const Head: HeadFC = () => <title>Home Page</title>;

const IndexPage: React.FC<PageProps> = props => {
    const nodes = props.data.allMarkdownRemark.nodes;
    const Posts = nodes.map(post => {
        const { url, frontmatter: { title }} = post;
        return <li><Link to={url}>{title}</Link></li>;
    });
    return (
      <main aria-describedby="title">
        <header>
          <hgroup>
            <h1 id="title">Posts</h1>
          </hgroup>
        </header>

      <ol reversed>
        {Posts}
      </ol>
    </main>
  )
};

export default IndexPage;

export const pageQuery = graphql`
query {
    allMarkdownRemark(sort: { frontmatter: { date: DESC }}) {
      nodes {
          ...Url,
          frontmatter {
            title
          }
      }
    }
}`;
