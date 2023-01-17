import * as React from "react";
import { Link } from "gatsby";
import Sidebar from "../components/sidebar.jsx";
import Layout from "../components/layout.jsx";
import BasicHead from "../components/basic-head.jsx";
import Title from "../components/title.jsx";

export const Head = ({location: {pathname}}) => <>
  <BasicHead pathname={pathname} />
  <Title>Not found</Title>
</>;

const NotFoundPage = () => {
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
