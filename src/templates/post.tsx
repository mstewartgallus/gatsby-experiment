import * as React from "react";
import { Link, graphql } from "gatsby";
import type { HeadFC, PageProps } from "gatsby";
import Title from "../components/title.tsx";
import Paging from "../components/paging.tsx";
import Layout from "../components/layout.tsx";
import Sidebar from "../components/sidebar.tsx";
import Metadata from "../components/metadata.tsx";
import Breadcrumbs from "../components/breadcrumbs.tsx";
import { MDXProvider } from "@mdx-js/react";
import { Lg } from "../components/lg.tsx";
import { L } from "../components/l.tsx";
import { Caesura } from "../components/caesura.tsx";
import { Poem } from "../components/poem.tsx";

const Notice = ({notice}) =>
    (!notice || notice.length == 0) ? null :
    <dl>
      <div>
        <dt>Notice</dt>
    {
        notice.map(n => <dd key={n}>{n}</dd>)
    }
      </div>
    </dl>;

export const Head: HeadFC = ({ data: { post: { title } }}) =>
    <Title>{title}</Title>;


const shortcodes = { Lg, L, Caesura };
const poem = { ul: Lg, li: L };

export const BlogPost: React.FC<PageProps> = ({
    children,
    data: {
        post: {
            previous,
            next,
            content,
            metadata: {
                category, dateXml, dateDisplay, title,
                notice, tags, places
            }
        }
    }
}) => {
    const components = {};
    Object.assign(components, shortcodes);
    if (category == 'poem') {
        Object.assign(components, poem);
    }
    const id = React.useId();
    return <MDXProvider components={components}>
        <Layout>
         <main data-pagefind-body aria-describedby={id}>
            <header>
              <hgroup>
            <h1 id={id}>{title}</h1>
              </hgroup>
              <Notice notice={notice} />
            </header>
        { content.__typename == 'MdxContent' ? children : <Poem poem={content.body} />}
        </main>
        <Sidebar>
          <Paging
            previous={previous?.metadata?.title}
            next={next?.metadata?.title}
            phref={previous?.metadata?.slug}
            nhref={next?.metadata?.slug} />
          <Metadata
             author="Molly Stewart-Gallus"
             dateDisplay={dateDisplay} dateXml={dateXml} tags={tags} places={places}
          />
        <Breadcrumbs>
          <li><Link to="/">Home</Link></li>
          <li><Link to={`/search?category=${category}`}
                   data-pagefind-meta="category">{category}</Link></li>
          <li aria-current="page"><cite>{title}</cite></li>
        </Breadcrumbs>
        </Sidebar>
</Layout></MDXProvider>;
};

export default BlogPost;

export const pageQuery = graphql`
query BlogPostById($id: String!) {
  post(id: {eq: $id}) {
    previous {
      metadata {
        title
        slug
      }
    }
    next {
      metadata {
        title
        slug
      }
    }
    metadata {
      dateDisplay: date(formatString: "YYYY-MM-DD")
      dateXml: date(formatString: "YYYY-MM-DD HH:mm Z")
      title
      category
      notice
      tags
      places
    }
    content {
      __typename
      ... on PoemContent {
         body
      }
    }
  }
}
`;
