import * as React from "react";
import { Link } from "gatsby";

// Autolink Markdown Headings with ids
const H = Hn => props => {
    const id = props.id;
    if (!id) {
        return <Hn {...props}>{children}</Hn>;
    }
    return <Hn {...props}>{children}
        <Link to={`#${id}`} aria-describedby={id}>Link</Link>
        </Hn>;
};

export const H1 = H (props => <h1 {...props}/>);
export const H2 = H (props => <h2 {...props}/>);
export const H3 = H (props => <h3 {...props}/>);
export const H4 = H (props => <h4 {...props}/>);
export const H5 = H (props => <h5 {...props}/>);
export const H6 = H (props => <h6 {...props}/>);
