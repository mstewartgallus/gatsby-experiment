import * as React from "react";
import { Link, HeadFC, PageProps } from "gatsby";
import Sidebar from "../components/sidebar.tsx";
import Layout from "../components/layout.tsx";

export const Head: HeadFC = () => <title>Not found</title>;

export const NotFoundPage: React.FC<PageProps> = () =>
   <Layout>
      <main aria-describedby="title">
        <header>
          <hgroup>
            <h1 id="title">Page not found</h1>
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
;

export default NotFoundPage;
