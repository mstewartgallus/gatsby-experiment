import * as React from "react";
import { Link, graphql } from "gatsby";
import type { HeadFC, PageProps } from "gatsby";

export const Head: HeadFC = () => <title>Home Page</title>;

export default function Template(props) {
    const { frontmatter, html } = props.data.markdownRemark;
    const { title } = frontmatter;
    return (
        <>
        <main>
            <header>
              <hgroup>
                <h1>{title}</h1>
              </hgroup>
            </header>

            <div dangerouslySetInnerHTML={{__html: html }} />
        </main>
        <header>
          <Link to="/">Home</Link>
            </header>
       </>
    );
};

export const pageQuery = graphql`
  query BlogPostById($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id,
      html,
      frontmatter {
        title,
        date(formatString: "YYYY-MM-DD")
      }
    }
  }
`;
