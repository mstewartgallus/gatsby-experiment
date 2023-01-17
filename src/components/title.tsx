import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";

const useTitle = () => useStaticQuery(graphql`
query {
  site {
    siteMetadata {
      title
    }
  }
}`).site.siteMetadata.title;

export const Title = ({ children }) => {
    let title = useTitle();
    if (children !== null) {
        title = `${children}\u2009\u2014\u2009${title}`;
    }
    return <>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        </>;
};

export default Title;
