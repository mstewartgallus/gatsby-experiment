import * as React from "react";
import { Link, graphql } from "gatsby";
import BasicHead from "../components/basic-head.jsx";
import Title from "../components/title.jsx";
import Paging from "../components/paging.jsx";
import Layout from "../components/layout.jsx";
import Sidebar from "../components/sidebar.jsx";
import Metadata from "../components/metadata.jsx";
import Breadcrumbs from "../components/breadcrumbs.jsx";
import { MDXProvider } from "@mdx-js/react";
import { H1, H2, H3, H4, H5, H6 } from "../components/heading.jsx";
import { Lg } from "../components/lg.jsx";
import { L } from "../components/l.jsx";
import { Caesura } from "../components/caesura.jsx";
import { Poem } from "../components/poem.jsx";

const Notice = ({notice}) =>
    (!notice || notice.length === 0) ? null :
    <dl>
      <div>
        <dt>Notice</dt>
    {
        notice.map(n => <dd key={n}>{n}</dd>)
    }
      </div>
    </dl>;

const shortcodes = {
    Lg, L, Caesura,
    H1, H2, H3, H4, H5, H6
};
const poem = { ul: Lg, li: L };
const autolinkHeadings = { h1: H1, h2: H2, h3: H3, h4: H4, h5: H5, h6: H6 };

const defaultComponents = { ...shortcodes, ...autolinkHeadings };

const components = {
    poem: { ...defaultComponents, ...poem },
    prose: defaultComponents,
    web: defaultComponents
};

export const Head = ({ location: {pathname}, data: { post }}) =>
<>
    <BasicHead pathname={pathname} />
    <Title>{post.metadata.title}</Title>
</>;

const BlogPost = ({
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
    const id = React.useId();

    return <MDXProvider components={components[category]}>
        <Layout>
         <main data-pagefind-body aria-describedby={id}>
            <header>
              <hgroup>
            <h1 id={id}>{title}</h1>
              </hgroup>
              <Notice notice={notice} />
            </header>
        { content.__typename === 'MdxContent' ? children : <Poem poem={content.body} />}
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
      dateXml: date(formatString: "YYYY-MM-DDTHH:mmZ")
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
