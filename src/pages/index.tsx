import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import BasicHead from "../components/basic-head.tsx";
import Style from "../components/style.tsx";
import Title from "../components/title.tsx";
import Layout from "../components/layout.tsx";
import PostList from "../components/post-list.tsx";
import Banner from "../components/banner.tsx";
import Search from "../components/search.tsx";
import Sidebar from "../components/sidebar.tsx";
import Breadcrumbs from "../components/breadcrumbs.tsx";
import JsonLd from "../components/json-ld.tsx";
import { useAbsolute } from "../hooks/use-absolute.ts";
import { useSiteMetadata } from "../hooks/use-site-metadata.ts";

const useJSON = () => {
    const site = useSiteMetadata();
    const search = useAbsolute('/search');
    const index = useAbsolute('/');
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": site.title,
        "description": site.description,
        "url": index,
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${search}?s={s}`
            },
            "query-input": "required name=s"
        }
    };
};

export const Head: HeadFC = ({location: {pathname}}) => {
    const json = useJSON();
    return <>
    <BasicHead pathname={pathname} />
    <Title>Table of Contents</Title>
    <JsonLd srcdoc={json} />
    </>;
};

const IndexPage: React.FC<PageProps> = () => {
    const id = React.useId();
    return <Layout>
    <main aria-describedby={id}>
        <header>
          <hgroup>
            <h1 id={id}>Posts</h1>
          </hgroup>
        </header>
        <PostList />
    </main>
    <Sidebar>
        <Banner />
        <Search />
        <Breadcrumbs>
          <li aria-current="page">Home</li>
        </Breadcrumbs>
    </Sidebar>
</Layout>;
};

export default IndexPage;
