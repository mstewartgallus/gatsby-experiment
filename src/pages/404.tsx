import * as React from "react";
import { Link } from "gatsby";
import type { HeadFC, PageProps } from "gatsby";
import Sidebar from "../components/sidebar.tsx";
import Layout from "../components/layout.tsx";
import BasicHead from "../components/basic-head.tsx";
import Title from "../components/title.tsx";

export const Head: HeadFC = ({location: {pathname}}) => <>
  <BasicHead pathname={pathname} />
  <Title>Not found</Title>
</>;

const NotFoundPage: React.FC<PageProps> = () => {
    const id = React.useId();
    return <Layout>
    <main aria-describedby={id}>
        <header>
          <hgroup>
        <h1 id={id}>Page not found</h1>
          </hgroup>
        </header>
      <p>
        Sorry we couldn’t find what you were looking for.
        <br />
        <Link to="/">Go home</Link>.
      </p>
    </main>
    <Sidebar>
    </Sidebar>
</Layout>
};

export default NotFoundPage;
