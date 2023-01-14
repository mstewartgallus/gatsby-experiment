import * as React from "react";
import { Link, graphql } from "gatsby";

const Prev = ({ children, href }) =>
    !href ? null :
    <div>
       <dt><Link to={href}>Previous</Link></dt>
       <dd>{children}</dd>
     </div>;

const Next = ({ children, href }) =>
    !href ? null :
    <div>
       <dt><Link to={href}>Next</Link></dt>
       <dd>{children}</dd>
     </div>;

export const Paging = ({ previous, next, phref, nhref }) =>
<nav aria-labelledby="paging-title">
  <header className="sr-only">
    <hgroup>
       <h2 id="paging-title">Paging</h2>
     </hgroup>
  </header>
  <dl>
    <Prev href={phref}><cite>{previous}</cite></Prev>
    <Next href={nhref}><cite>{next}</cite></Next>
  </dl>
</nav>;

export default Paging;
