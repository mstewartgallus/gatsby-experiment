import * as React from "react";
import { Link } from "gatsby";
import { select } from "./select.module.css";

export const NameContext = React.createContext(null);

export const Select = ({ name, children }) => {
    return <fieldset>
           <NameContext.Provider value={name}>
            {children}
        </NameContext.Provider>
          </fieldset>;
};

export default Select;
