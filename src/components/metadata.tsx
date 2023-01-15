import * as React from "react";
import { Link } from "gatsby";
import { metadata } from "./metadata.module.css";

const Place = ({place}) =>
    <dd><Link to={`/search?place=${place}`}
              data-pagefind-filter="place">{place}</Link></dd>;
const Places = ({places}) => places.map(p => <Place key={p} place={p}/>);
const PlaceList = ({places}) =>
    (!places || places.length === 0) ? null :
    <div>
      <dt>Place</dt>
      <Places places={places} />
     </div>;

const Tag = ({tag}) =>
    <dd><Link to={`/search?tag=${tag}`}
              data-pagefind-filter="tag">{tag}</Link></dd>;
const Tags = ({tags}) => tags.map(t => <Tag key={t} tag={t} />);
const TagList = ({tags}) =>
    (!tags || tags.length === 0) ? null :
    <div>
      <dt>Tag</dt>
      <Tags tags={tags} />
     </div>;

export const Metadata = ({ dateDisplay, dateXml, author, places, tags }) => {
    const id = React.useId();
    return <footer className={metadata} aria-describedby={id}>
  <hgroup className="sr-only">
        <h2 id={id}>Metadata</h2>
  </hgroup>

  <dl>
    <div>
      <dt>Post Date</dt>
      <dd><time data-pagefind-filter="date[datetime]" data-pagefind-sort="date[datetime]"
            dateTime={dateXml}>{dateDisplay}</time></dd>
    </div>
    <div>
      <dt>Author</dt>
      <dd>{author}</dd>
    </div>
    <PlaceList places={places} />
    <TagList tags={tags} />
  </dl>
        </footer>
};

export default Metadata;
