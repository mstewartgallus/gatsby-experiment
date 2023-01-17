import * as React from "react";
import { Link } from "gatsby";
import { lg } from "./lg.module.css";

export const Lg = ({ children }) => {
    return <p className={lg}>{children}</p>;
};

export default Lg;
