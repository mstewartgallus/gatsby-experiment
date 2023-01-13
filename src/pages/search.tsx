import * as React from "react";
import { Link, graphql } from "gatsby";
import type { HeadFC, PageProps } from "gatsby";
import Url from "../utils/url.ts";

export const Head: HeadFC = () => <title>Search</title>;

const SearchPage: React.FC<PageProps> = props => {
    return (<>
      <main aria-describedby="title">
        <header>
          <hgroup>
            <h1 id="title">Search</h1>
          </hgroup>
        </header>

       <ul>
        <li><Link></Link></li>
        <li><Link></Link></li>
        <li><Link></Link></li>
        <li><Link></Link></li>
        <li><Link></Link></li>

        <li><Link></Link></li>
        <li><Link></Link></li>
        <li><Link></Link></li>
        <li><Link></Link></li>
        <li><Link></Link></li>
       </ul>
    </main>
    <div id="sidebar">
       <form aria-describedby="search-title" role="search" rel="search" action="/search">
          <header class="sr-only">
            <hgroup>
              <h2 id="search-title">Search</h2>
            </hgroup>
          </header>

          <div class="search-basic">
            <label for="search-input">Query</label>
            <input id="search-input" name="s" type="search" required />
            <button type="submit">Search</button>
          </div>
       </form>
    </div>
    </>)
};

export default SearchPage;
