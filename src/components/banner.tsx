import * as React from "react";
import { Link, graphql, useStaticQuery } from "gatsby";
import { banner } from "./banner.module.css";

const useMetadata = () => useStaticQuery(graphql`
query {
  site {
    siteMetadata {
      title
      description
     }
  }
}`).site.siteMetadata;

const Banner = () => {
    const id = React.useId();
    const { title, description } = useMetadata();

    return <header className={banner} aria-describedby={id}>
          <hgroup>
            <h2 id={id}>{title}</h2>
            <p>{description}</p>
          </hgroup>

          <ul>
            <li><Link type="application/atom+xml" rel="alternate" to="/feed/">Subscribe</Link></li>
            <li><Link to="/about">About the Author</Link></li>
          </ul>
        </header>;
};

export default Banner;
