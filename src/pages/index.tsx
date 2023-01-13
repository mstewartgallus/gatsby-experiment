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
    return (<>
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
    <div id="sidebar">
        <header aria-describedby="banner-title">
          <hgroup>
            <h2 id="banner-title">Words to Kick Your Teeth Out</h2>
            <p>lol, lmao</p>
          </hgroup>

          <ul>
            <li><Link type="application/atom+xml" rel="alternate" to="/feed/">Subscribe</Link></li>
            <li><Link to="/about">About the Author</Link></li>
          </ul>
        </header>
        <form aria-describedby="search-title" role="search" rel="search" action="/search">
          <header class="sr-only">
            <hgroup>
              <h2 id="search-title">Search</h2>
            </hgroup>
          </header>

          <div class="search-basic">
            <label for="search-input">Query</label>
            <input id="search-input" name="s" type="search" required />
            <button type="submit">Search</button>
          </div>
        </form>
    </div>
    </>)
};

export default IndexPage;

export const pageQuery = graphql`
query BlogListing {
  allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
    nodes {
      ...Url
      frontmatter {
        title
      }
    }
  }
}`;
