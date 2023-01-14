import * as React from "react";
import { Link } from "gatsby";
import * as moment from "moment";

const Place = ({place}) =>
    <dd><Link to={`/search?place=${place}`}
              data-pagefind-meta="place">{place}</Link></dd>;
const Places = ({places}) => places.map(p => <Place key={p} place={p}/>);
const PlaceList = ({places}) =>
    (!places || places.length === 0) ? null :
    <div>
      <dt>Place</dt>
      <Places places={places} />
     </div>;

const Tag = ({tag}) =>
    <dd><Link to={`/search?tag=${tag}`}
              data-pagefind-meta="tag">{tag}</Link></dd>;
const Tags = ({tags}) => tags.map(t => <Tag key={t} tag={t} />);
const TagList = ({tags}) =>
    (!tags || tags.length === 0) ? null :
    <div>
      <dt>Tag</dt>
      <Tags tags={tags} />
     </div>;

const formatDate = (date) =>
    moment
        .utc(date, 'YYYY-MM-DD HH:mm Z', 'en')
        .format("YYYY-MM-DD");
const xmlDate = (date) =>
    moment
        .utc(date, 'YYYY-MM-DD HH:mm Z', 'en')
        .format();

export const Metadata = ({ date, author, places, tags }) =>
<footer aria-describedby="metadata-title">
  <hgroup className="sr-only">
    <h2 id="metadata-title">Metadata</h2>
  </hgroup>

  <dl>
    <div>
      <dt>Post Date</dt>
      <dd><time data-pagefind-meta="date" data-pagefind-sort="date"
            dateTime={xmlDate(date)}>{formatDate(date)}</time></dd>
    </div>
    <div>
      <dt>Author</dt>
      <dd>{author}</dd>
    </div>
    <PlaceList places={places} />
    <TagList tags={tags} />
  </dl>
</footer>;

export default Metadata;
