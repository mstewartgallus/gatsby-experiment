import * as React from "react";
import { navigate, Link, Script } from "gatsby";
import type { HeadFC, PageProps } from "gatsby";
import Title from "../components/title.tsx";
import Layout from "../components/layout.tsx";
import Sidebar from "../components/sidebar.tsx";
import Breadcrumbs from "../components/breadcrumbs.tsx";

const imp = new Function('x', 'return import(x);');
const getpf = async () => {
    return await imp("/static/pagefind/pagefind.js");
};

const pagefindToPost = ({ url, meta: { title } }) => ({
    'href': url,
    'value': title
});

const search = async (signal, {s, category, tag, place }) => {
    if (signal.aborted) {
        return [];
    }

    if (s == '') {
        s = null;
    }

    let pf;
    try {
        pf = await getpf();
    } catch (e) {
        console.warn(e);
        return [];
    }

    if (signal.aborted) {
        return [];
    }

    const filters = {};
    if (category.length > 0) {
        filters.category = category;
    }
    if (tag.length > 0) {
        filters.tag = tag;
    }
    if (place.length > 0) {
        filters.place = place;
    }
    const { results } = await pf.search(s, { filters });

    if (signal.aborted) {
        return [];
    }

    const posts = [];
    for (const d of posts) {
        posts.push(await d);

        if (signal.aborted) {
            return [];
        }
    }

    return posts.map(pagefindToPost);
};

const allCategory = ['poem', 'post'];
const allPlace = ['Vancouver', 'Downtown'];
const allTag = ['Coffee', 'Spoopy'];

const SearchForm = ({s, category, place, tag}) => {
    const [getS, setS] = React.useState(s);
    const [getCategory, setCategory] = React.useState(new Set(category));
    const [getPlace, setPlace] = React.useState(new Set(place));
    const [getTag, setTag] = React.useState(new Set(tag));

    const onChangeS = (event) => setS(event.target.value);
    const onChangeCategory = (event) => {
        const { target: { checked, value } } = event;
        const newCat = new Set(getCategory);
        if (checked) {
            newCat.add(value);
        } else {
            newCat.delete(value);
        }

        setCategory(newCat);
    };

    const onChangePlace = (event) => {
        const { target: { checked, value } } = event;
        const newPlace = new Set(getPlace);
        if (checked) {
            newPlace.add(value);
        } else {
            newPlace.delete(value);
        }

        setPlace(newPlace);
    };
    const onChangeTag = (event) => {
        const { target: { checked, value } } = event;
        const newTag = new Set(getTag);
        if (checked) {
            newTag.add(value);
        } else {
            newTag.delete(value);
        }

        setTag(newTag);
    };

    const onSubmit = (event) => {
        event.preventDefault();

        const p = new URLSearchParams();
        p.set('s', getS);
        for (const c of getCategory) {
            p.append('category', c);
        }
        navigate(`/search?${p}`);
    };

    const id = React.useId();
    return <form aria-describedby={id} role="search" rel="search"
        action="/search"
        onSubmit={onSubmit}>
          <header className="sr-only">
            <hgroup>
               <h2 id={`${id}-title`}>Search</h2>
            </hgroup>
          </header>

    <fieldset className="search-basic">
            <label htmlFor={`${id}-input`}>Query</label>
            <input id={`${id}-input`} name="s" type="search" required
                   value={getS}
                   onChange={onChangeS}
            />
            <button type="submit">Search</button>
    </fieldset>

<fieldset id={`${id}-category`}>
<legend>Category</legend>
     {
         allCategory.map(category =>
             <React.Fragment key={category}>
             <input id={`${id}-category-${category}`}
                     type="checkbox" name="category"
                     value={ category }
                         onChange={onChangeCategory}
                         checked={getCategory.has(category)}
             />
             <label htmlFor={`${id}-category-${category}`}>{category}</label>
             </React.Fragment>)
    }
  </fieldset>
        <fieldset id={`${id}-place`}>
<legend>Place</legend>
     {
         allPlace.map(place =>
             <React.Fragment key={place}>
             <input id={`${id}-place-${place}`}
                     type="checkbox" name="place"
                     value={ place }
                         onChange={onChangePlace}
                         checked={getPlace.has(place)}
             />
             <label htmlFor={`${id}-place-${place}`}>{place}</label>
             </React.Fragment>)
    }
  </fieldset>
 <fieldset id={`${id}-tag`}>
        <legend>Tag</legend>
     {
         allTag.map(tag =>
             <React.Fragment key={tag}>
             <input id={`${id}-tag-${tag}`}
                     type="checkbox" name="tag"
                     value={ tag }
                         onChange={onChangeTag}
                         checked={getTag.has(tag)}
             />
             <label htmlFor={`${id}-tag-${tag}`}>{tag}</label>
             </React.Fragment>)
    }
  </fieldset>
</form>;
};

const PostList = ({s, category, tag, place}) => {
    const [ posts, setPosts ] = React.useState([]);

    React.useEffect(() => {
        const abort = new AbortController();
        const signal = abort.signal;
        (async () => {
            const p = await search(signal, { s, category, tag, place });
            if (signal.aborted) {
                return;
            }
            setPosts(p);
        })();
        return () => {
            abort.abort();
        };
    }, [s, category, tag, place]);

    return <ul>{
        posts.map(({value, href}) =>
            <li key={href}>
              <Link to={href}>{value}</Link>
            </li>)
    }</ul>;
};

const SearchPageImpl = ({ s, category, tag, place }) => {
    const id = React.useId();
    return <Layout>
        <main aria-describedby={id}>
        <header>
          <hgroup>
            <h1 id={id}>Search</h1>
          </hgroup>
        </header>

      <PostList s={s} category={category} tag={tag} place={place}/>
    </main>
    <Sidebar>
      <SearchForm s={s} category={category} tag={tag} place={place} />
      <Breadcrumbs>
          <li><Link to="/">Home</Link></li>
          <li aria-current="page"><cite>Search</cite></li>
        </Breadcrumbs>
    </Sidebar>
</Layout>;
};

const parseParams = search => {
    const params = new URLSearchParams(search);
    const s = params.get('s') ?? '';
    const category = params.getAll('category');
    const tag = params.getAll('tag');
    const place = params.getAll('place');
    return { s, category, tag, place };
};

export const Head: HeadFC = () => <Title>Search</Title>;

export const SearchPage: React.FC<PageProps> =
    ({location: { search }}) => {
        const { s, category, tag, place } = parseParams(search);
        return <SearchPageImpl s={s} category={category} tag={tag} place={place} />;
    };

export default SearchPage;
