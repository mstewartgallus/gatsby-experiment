import * as React from "react";
import { Link, graphql, useStaticQuery } from "gatsby";
import type { HeadFC, PageProps } from "gatsby";
import Title from "../components/title.tsx";
import Layout from "../components/layout.tsx";
import PostList from "../components/post-list.tsx";
import Banner from "../components/banner.tsx";
import Search from "../components/search.tsx";
import Sidebar from "../components/sidebar.tsx";
import Breadcrumbs from "../components/breadcrumbs.tsx";

export const Head: HeadFC = () => <Title>Table of Contents</Title>;

export const IndexPage: React.FC<PageProps> = () => {
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
