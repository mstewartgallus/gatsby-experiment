import * as React from "react";
import { Link, HeadFC, PageProps } from "gatsby";

export const Head: HeadFC = () => <title>Not found</title>;

const NotFoundPage: React.FC<PageProps> = () => {
  return (
      <main>
          <header>
          <hgroup>
          <h1>Page not found</h1>
          </hgroup>
          </header>
      <p>
        Sorry we couldn’t find what you were looking for.
        <br />
        <Link to="/">Go home</Link>.
      </p>
    </main>
  )
};

export default NotFoundPage;
