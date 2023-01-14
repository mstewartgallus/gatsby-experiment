import * as React from "react";
import { Link, graphql } from "gatsby";
import type { HeadFC, PageProps } from "gatsby";
import Paging from "../components/paging.tsx";
import Layout from "../components/layout.tsx";
import Sidebar from "../components/sidebar.tsx";
import Metadata from "../components/metadata.tsx";

const Notices = ({ notice }) => notice.map(n => <dd key={n}>{n}</dd>);

const Notice = ({notice}) =>
    (!notice || notice.length == 0) ? null :
    <dl>
      <div>
        <dt>Notice</dt>
        <Notices notice={notice} />
      </div>
    </dl>;

export const Head: HeadFC =
    ({ data: { post: { title } }}) =>
    <title>{title}</title>;

export const BlogPost: React.FC<PageProps> =
    ({
        data: {
            post: {
                category, previous, next, date, title, html,
                notice, tags, places
            }
        }
    }) =>
     <Layout>
        <main data-pagefind-body>
            <header>
              <hgroup>
                <h1>{title}</h1>
              </hgroup>
              <Notice notice={notice} />
            </header>

            <div dangerouslySetInnerHTML={{__html: html }} />
        </main>
        <Sidebar>
          <Paging
            previous={previous?.title}
            next={next?.title}
            phref={previous?.url}
            nhref={next?.url}>
          </Paging>
          <Metadata
             author="Molly Stewart-Gallus"
             date={date} tags={tags} places={places}
          >
          </Metadata>
          <nav aria-labelledby="breadcrumbs-title">
            <header className="sr-only">
              <hgroup>
                <h2 id="breadcrumbs-title">Breadcrumbs</h2>
              </hgroup>
            </header>

            <ol className="breadcrumb">
              <li><Link to="/">Home</Link></li>
              <li><Link to={`/search?category=${category}`}
                   data-pagefind-meta="category">{category}</Link></li>
              <li aria-current="page">{title}</li>
            </ol>
          </nav>
        </Sidebar>
</Layout>
;

export default BlogPost;

export const pageQuery = graphql`
query BlogPostById($id: String!) {
  post(id: {eq: $id}) {
    category
    previous {
      title
      ...Url
    }
    next {
      title
      ...Url
    }
    date
    title
    html
    notice
    tags
    places
  }
}
`;
