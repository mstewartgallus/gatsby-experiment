import * as React from "react";
import { Link } from "gatsby";
import { Lg } from "./lg.tsx";
import { L } from "./l.tsx";
import { Caesura } from "./caesura.tsx";

export const Poem = ({ poem }) =>
    poem.map(stanza => <Lg>{
        stanza.map(line => <L>{
            line.map((segment, index) =>
                index == 0 ?
                segment :
                <><Caesura />{segment}</>)
        }</L>)
    }</Lg>);

export default Poem;
