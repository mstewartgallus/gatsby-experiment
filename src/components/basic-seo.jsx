import * as React from "react";
import { useSiteMetadata } from '../hooks/use-site-metadata.js';
import favicon from '../assets/favicon.svg';

// {%- capture type -%}
// {%- if page.collection == 'posts' -%}
// article
// {%- else -%}
// website
// {%- endif -%}
// {%- endcapture -%}

// <meta property="og:type" content="{{ type }}">
// <meta property="og:image" content="{% link /assets/favicon.svg %}" >
// {%- if description -%}
// {%- endif -%}
// {% if page.collection == 'posts' -%}
// <meta property="og:article:author" content="{{ author.name | escape }}">
// <meta property="og:article:published_time" content="{{ page.date | date: "%Y-%m-%d" }}">
// {%- for tag in page.tags -%}
// <meta property="og:article:tag" content="{{ tag | escape }}">
// {%- endfor -%}
// {% for cat in page.category -%}
// <meta property="og:article:tag" content="{{ cat | escape }}">
// {%- endfor -%}
// {%- endif -%}

const author = {
    name: "Molly Stewart-Gallus",
    url: "/about"
};

export const BasicSeo = ({url}) => {
    const site = useSiteMetadata();

    return <>
  <link rel="canonical" href={url} />
  <meta name="description" content={site.description} />
  <meta name="og:site_name" content={site.title} />
  <meta property="og:image" content={favicon} />
  <meta property="og:url" content={url} />
  <meta property="og:description" content={site.description} />
  <link rel="author" href={author.url} />
  <meta name="author" content={author.name} />
  <meta property="og:profile" content={author.name} />
  <meta property="og:profile:username" content={author.name} />
</>;
};

export default BasicSeo;
