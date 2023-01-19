import * as React from "react";
import { Lg } from "./lg.jsx";
import { L } from "./l.jsx";
import { Caesura } from "./caesura.jsx";

export const Poem = ({ poem }) => {
    return poem.map(stanza => <Lg>{
        stanza.map(line => <L>{
            line.map((segment, index) =>
                <React.Fragment key={segment}>{
                    index === 0 ?
                        segment :
                        <><Caesura />{segment}</>
                }</React.Fragment>)
        }</L>)
    }</Lg>);
};

export default Poem;
