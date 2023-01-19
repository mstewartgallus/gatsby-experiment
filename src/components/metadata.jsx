import * as React from "react";
import { Link } from "gatsby";
import { metadata } from "./metadata.module.css";

const Place = ({place}) => {
    const placeURI = encodeURIComponent(place);
    const to = `/search?place=${placeURI}`;
    return <Link to={to}
                 rel="tag"
                 data-pagefind-filter="place">{place}</Link>;
};
const PlaceList = ({places}) => {
    if (!places || places.length === 0) {
        return null;
    }
    return <div>
               <dt>Place</dt>
               {
                   places.map(p =>
                       <dd key={p}><Place place={p}/></dd>
                   )
               }
           </div>;
};

const Tag = ({tag}) => {
    const tagURI = encodeURIComponent(tag);
    const to = `/search?tag=${tagURI}`;
    return <Link to={to} rel="tag" data-pagefind-filter="tag">{tag}</Link>;
};
const TagList = ({tags}) => {
    if (!tags || tags.length === 0) {
        return null;
    }
    return <div>
               <dt>Tag</dt>
               {
                   tags.map(t =>
                       <dd key={t}><Tag tag={t} /></dd>)
               }
           </div>;
};

const Person = ({person}) => {
    const personURI = encodeURIComponent(person);
    const to = `/search?person=${personURI}`;
    return <Link to={to} rel="tag" data-pagefind-filter="person">{person}</Link>;
};
const PeopleList = ({people}) => {
    if (!people || people.length === 0) {
        return null;
    }
    return <div>
               <dt>People</dt>
               {
                   people.map(p =>
                       <dd key={p}><Person person={p}/></dd>
                   )
               }
           </div>;
};


export const Metadata = ({
    dateDisplay, dateXml, author, places, tags, people
}) => {
    const id = React.useId();
    return <footer className={metadata} aria-describedby={id}>
               <hgroup className="sr-only">
                   <h2 id={id}>Metadata</h2>
               </hgroup>

               <dl>
                   <div>
                       <dt>Post Date</dt>
                       <dd>
                           <time data-pagefind-filter="date[datetime]"
                                 data-pagefind-sort="date[datetime]"
                                 dateTime={dateXml}>
                               {dateDisplay}
                           </time>
                       </dd>
                   </div>
                   <div>
                       <dt>Author</dt>
                       <dd>{author}</dd>
                   </div>
                   <PlaceList places={places} />
                   <TagList tags={tags} />
                   <PeopleList people={people} />
               </dl>
           </footer>;
};

export default Metadata;
