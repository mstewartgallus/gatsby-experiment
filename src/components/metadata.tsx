import * as React from "react";
import { Link } from "gatsby";
import * as moment from "moment";

export const Metadata = ({ date, author, place, tag }) =>
<footer aria-describedby="metadata-title">
  <hgroup class="sr-only">
    <h2 id="metadata-title">Metadata</h2>
  </hgroup>

  <dl>
    <div>
      <dt>Post Date</dt>
      <dd><Date date={date} /></dd>
    </div>
    <div>
      <dt>Author</dt>
      <dd>{author}</dd>
    </div>
    <Place place={place} />
    <Tag tag={tag} />
  </dl>
</footer>;

function Date({date}) {
    const parsed = moment
        .utc(date, 'YYYY-MM-DD HH:mm Z', 'en');

    const display = parsed.format("YYYY-MM-DD");;
    return <time>{display}</time>;
}

const Places = ({place}) => place.map(p => <dd key={p}>{p}</dd>);
function Place({place}) {
    if (!place || place.length === 0) {
        return <></>;
    }
    return <div>
             <dt>Place</dt>
             <Places place={place} />
            </div>;
}

const Tags = ({tag}) => tag.map(t => <dd key={t}>{t}</dd>);

function Tag({tag}) {
    if (!tag || tag.length === 0) {
        return <></>;
    }
    return <div>
             <dt>Tag</dt>
             <Tags tag={tag} />
            </div>;
}
export default Metadata;
