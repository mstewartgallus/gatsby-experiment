import * as React from "react";
import { Script } from "gatsby";

export const JsonLd = ({srcdoc}) => {
    return <Script type="application/ld+json">{JSON.stringify(srcdoc)}</Script>;
};

export default JsonLd;
