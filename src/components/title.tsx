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
    const title = useTitle();
    return <title>{
        children == null ?
            title :
            <>{children}&thinsp;&mdash;&thinsp;{title}</>
    }</title>;
};

export default Title;
