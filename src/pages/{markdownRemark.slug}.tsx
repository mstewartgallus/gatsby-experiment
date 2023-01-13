import * as React from "react";
import { Link, graphql } from "gatsby";
import type { HeadFC, PageProps } from "gatsby";
import Paging from "../components/paging.tsx";
import Metadata from "../components/metadata.tsx";

export const Head: HeadFC = ({ data: { markdownRemark: { frontmatter: { title } } }}) =>
    <title>{title}</title>;

export default function Template({ data }) {
    const { category, previous, next, frontmatter, html } = data.markdownRemark;
    const { title } = frontmatter;

    return (
        <>
        <main>
            <header>
              <hgroup>
                <h1>{title}</h1>
              </hgroup>
              <Notice notice={frontmatter.notice}/>
            </header>

            <div dangerouslySetInnerHTML={{__html: html }} />
        </main>
        <div id="sidebar">
          <Paging
            phref={previous?.url}
            previous={previous?.frontmatter?.title}
            nhref={next?.url}
            next={next?.frontmatter?.title}>
          </Paging>
          <Metadata
             author="Molly Stewart-Gallus"
             date={frontmatter.date}
             place={frontmatter.places}
             tag={frontmatter.tags}
          >
          </Metadata>
          <nav aria-labelledby="breadcrumbs-title">
            <header class="sr-only">
              <hgroup>
                <h2 id="breadcrumbs-title">Breadcrumbs</h2>
              </hgroup>
            </header>

            <ol class="breadcrumb">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/search?category={category}">{category}</Link></li>
              <li aria-current="page">{title}</li>
            </ol>
          </nav>
        </div>
       </>
    );
};

function Notice({notice}) {
    if (!notice || notice.length == 0) {
        return <></>;
    }
    const Notices = () => notice.map(n => <dd key={n}>{n}</dd>);
    return <dl>
      <div>
        <dt>Notice</dt>
        <Notices />
      </div>
    </dl>;
}

export const pageQuery = graphql`
query BlogPostById($id: String!) {
  markdownRemark(id: {eq: $id}) {
    category
    html
    previous {
      ...Url
      frontmatter {
        title
      }
    }
    next {
      ...Url
      frontmatter {
        title
      }
    }
    frontmatter {
      title
      date
      notice
      tags
      places
    }
  }
}
`;
