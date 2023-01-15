import * as React from "react";
import { Link, graphql } from "gatsby";
import type { HeadFC, PageProps } from "gatsby";
import Title from "../components/title.tsx";
import Paging from "../components/paging.tsx";
import Layout from "../components/layout.tsx";
import Sidebar from "../components/sidebar.tsx";
import Metadata from "../components/metadata.tsx";
import Breadcrumbs from "../components/breadcrumbs.tsx";

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

export const BlogPost: React.FC<PageProps> = ({
    children,
    data: {
        post: {
            category, previous, next, dateXml, dateDisplay, title,
            notice, tags, places
        }
    }
}) => {
    const id = React.useId();
    return <Layout>
            <main data-pagefind-body aria-describedby={id}>
            <header>
              <hgroup>
            <h1 id={id}>{title}</h1>
              </hgroup>
              <Notice notice={notice} />
            </header>

        {children}
        </main>
        <Sidebar>
          <Paging
            previous={previous?.title}
            next={next?.title}
            phref={previous?.slug}
            nhref={next?.slug} />
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
</Layout>;
};

export default BlogPost;

export const pageQuery = graphql`
query BlogPostById($id: String!) {
  post(id: {eq: $id}) {
    category
    previous {
      title
      slug
    }
    next {
      title
      slug
    }
    dateDisplay: date(formatString: "YYYY-MM-DD")
    dateXml: date(formatString: "YYYY-MM-DD HH:mm Z")
    title
    notice
    tags
    places
  }
}
`;
