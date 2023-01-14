import * as React from "react";
import { Link, graphql } from "gatsby";
import type { HeadFC, PageProps } from "gatsby";
import Layout from "../components/layout.tsx";
import Sidebar from "../components/sidebar.tsx";
import Url from "../utils/url.ts";

export const Head: HeadFC = () => <title>Home Page</title>;

const Post =
    ({url, title}) => <li><Link to={url}>{title}</Link></li>;

const Posts =
    ({posts}) =>
    posts.map(({ url, title }) => <Post key={url} url={url} title={title} />);

const PostList =
    ({posts}) =>
    (!posts || posts.length === 0) ? null :
    <ol reversed>
      <Posts posts={posts} />
    </ol>;

export const IndexPage: React.FC<PageProps> =
    ({
        data: {
            site: {
                siteMetadata: {
                    title,
                    description
                }
            },
            allPost: { nodes }
        }
     }) =>
<Layout>
   <main aria-describedby="title">
        <header>
          <hgroup>
            <h1 id="title">Posts</h1>
          </hgroup>
        </header>

        <PostList posts={nodes} />
    </main>
    <Sidebar>
        <header aria-describedby="banner-title">
          <hgroup>
            <h2 id="banner-title">{title}</h2>
            <p>{description}</p>
          </hgroup>

          <ul>
            <li><Link type="application/atom+xml" rel="alternate" to="/feed/">Subscribe</Link></li>
            <li><Link to="/about">About the Author</Link></li>
          </ul>
        </header>
        <form aria-describedby="search-title" role="search" rel="search" action="/search">
          <header className="sr-only">
            <hgroup>
              <h2 id="search-title">Search</h2>
            </hgroup>
          </header>

          <div className="search-basic">
            <label htmlFor="search-input">Query</label>
            <input id="search-input" name="s" type="search" required />
            <button type="submit">Search</button>
          </div>
        </form>
    </Sidebar>
</Layout>
;

export default IndexPage;

export const pageQuery = graphql`
query BlogListing {
  site {
    siteMetadata {
      title,
      description
    }
  }
  allPost(sort: {date: DESC}) {
    nodes {
      title
      ...Url
    }
  }
}`;
