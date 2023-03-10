import * as React from "react";
import { Link } from "gatsby";
import Sidebar from "../components/sidebar.jsx";
import HeadBasic from "../components/head-basic.jsx";
import Title from "../components/title.jsx";
import Page from "../components/page.jsx";

export const Head = ({location: {pathname}}) => <>
  <HeadBasic pathname={pathname} />
  <Title>Not found</Title>
</>;

const NotFoundPage = () => {
    const id = React.useId();
    return <Page>
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
           </Page>;
};

export default NotFoundPage;
