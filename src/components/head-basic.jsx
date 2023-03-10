import * as React from "react";
import SeoBasic from './seo-basic.jsx';
import favicon from '../assets/favicon.svg';
import { useAbsolute } from '../hooks/use-absolute.js';

export const HeadBasic = ({pathname}) => {
    const url = useAbsolute(pathname);
    return <>
               <link rel="icon" href={favicon} />
               <meta name="color-scheme" content="light dark" />
               <meta name="theme-color" content="#6000A0" />
               <SeoBasic url={url} />
           </>;
};

export default HeadBasic;
