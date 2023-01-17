import * as React from "react";
import BasicSeo from './basic-seo.tsx';
import favicon from '../assets/favicon.svg';
import { useAbsolute } from '../hooks/use-absolute.ts';

export const BasicHead = ({pathname}) => {
    const url = useAbsolute(pathname);
    return <>
    <link rel="icon" href={favicon} />
    <meta name="color-scheme" content="light dark" />
    <meta name="theme-color" content="#6000A0" />
    <BasicSeo url={url} />
        </>;
};

export default BasicHead;
