import * as React from "react";
import { Link } from "gatsby";
import { search } from "./search.module.css";

const Search = () => {
    const id = React.useId();
    return <form className={search} aria-describedby={`${id}-title`} role="search" rel="search" action="/search">
          <header className="sr-only">
            <hgroup>
               <h2 id={`${id}-title`}>Search</h2>
            </hgroup>
          </header>

          <div className="search-basic">
            <label htmlFor={`${id}-input`}>Query</label>
            <input id={`${id}-input`} name="s" type="search" required />
            <button type="submit">Search</button>
          </div>
        </form>;
};

export default Search;
