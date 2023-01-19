import * as React from "react";
import { navigate, Link } from "gatsby";
import HeadBasic from "../components/head-basic.jsx";
import Title from "../components/title.jsx";
import Layout from "../components/layout.jsx";
import Sidebar from "../components/sidebar.jsx";
import Select from "../components/select.jsx";
import Option from "../components/option.jsx";
import Breadcrumbs from "../components/breadcrumbs.jsx";
import { usePostTags } from "../hooks/use-post-tags.js";
import { search, query } from "./search.module.css";

const imp = new Function('x', 'return import(x);');
const getpf = async () => {
    return await imp("/static/pagefind/pagefind.js");
};

const pagefindToPost = ({ url, meta: { title } }) => ({
    'href': url,
    'value': title
});

const mapPromise = async (xs, f) => {
    return await Promise.all(xs.map(f));
};

const runSearch = async (s, { signal, filter: {category, tag, place }}) => {
    signal.throwIfAborted();

    if (s === '') {
        s = null;
    }

    let pf;
    try {
        pf = await getpf();
    } catch (e) {
        console.warn(e);
        return [];
    }

    signal.throwIfAborted();

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
    const posts = (await pf.search(s, { filters })).results.slice(0, 10);

    signal.throwIfAborted();

    // FIXME race?
    const links = await mapPromise(posts, async postPs => {
        return pagefindToPost(await postPs.data());
    });
    signal.throwIfAborted();

    return links;
};

const Query = ({value, onChange}) => {
    const id = React.useId();

    return <div className={query}>
               <label htmlFor={id}>Query</label>
               <input id={id} name="s" type="search"
                      value={value}
                      onChange={onChange}
               />
               <button type="submit">Search</button>
           </div>;
};

const TagSelect = ({all, name, onChange, selected, children}) => {
    const [getter, setter] = React.useState(new Set(selected));

    const onChangeOption = event => {
        const { target: { checked, value } } = event;
        const next = new Set(getter);
        if (checked) {
            next.add(value);
        } else {
            next.delete(value);
        }
        setter(next);
        onChange(next);
    }
    return <Select name={name}>
        {children}
        {
            all.map(opt =>
                <Option key={opt}
                        onChange={onChangeOption}
                        selected={getter.has(opt)}
                        value={opt}>
                    {opt}
                </Option>)
        }</Select>;
};

const SearchForm = ({action, s, category, place, tag, people}) => {
    const id = React.useId();

    const [getS, setS] = React.useState(s ?? '');
    const [getCat, setCat] = React.useState(new Set(category));
    const [getPlace, setPlace] = React.useState(new Set(place));
    const [getPeople, setPeople] = React.useState(new Set(people));
    const [getTag, setTag] = React.useState(new Set(tag));

    const tags = usePostTags();

    const onChangeS = (event) => setS(event.target.value);
    const onChangeCat = value => setCat(value);
    const onChangeTag = value => setTag(value);
    const onChangePlace = value => setPlace(value);
    const onChangePeople = value => setPeople(value);

    const onSubmit = (event) => {
        event.preventDefault();

        const p = new URLSearchParams();
        p.set('s', getS);

        for (const v of getCat) {
            p.append('category', v);
        }
        for (const v of getPlace) {
            p.append('place', v);
        }
        for (const v of getTag) {
            p.append('tag', v);
        }
        for (const v of getPeople) {
            p.append('person', v);
        }

        // FIXME just go where it was going to go anyhow
        navigate(`${action}?${p}`);
    };

    return <form className={search} aria-describedby={id} role="search" rel="search"
                 action={action}
                 onSubmit={onSubmit}>
               <header className="sr-only">
                   <hgroup>
                       <h2 id={id}>Search</h2>
                   </hgroup>
               </header>

               <Query value={getS} onChange={onChangeS} />

               <TagSelect name="category" all={tags.category} selected={getCat} onChange={onChangeCat}>
                   <legend>Category</legend>
               </TagSelect>
               <TagSelect name="place" all={tags.place} selected={getPlace} onChange={onChangePlace}>
                   <legend>Place</legend>
               </TagSelect>
               <TagSelect name="person" all={tags.people} selected={getPeople} onChange={onChangePeople}>
                   <legend>People</legend>
               </TagSelect>
               <TagSelect name="tag" all={tags.tags} selected={getTag} onChange={onChangeTag}>
                   <legend>Tags</legend>
               </TagSelect>
           </form>;
};

const PostList = ({s, category, tag, place, people}) => {
    const [ posts, setPosts ] = React.useState([]);

    React.useEffect(() => {
        const abort = new AbortController();
        const signal = abort.signal;
        (async () => {
            let p;
            try {
                p = await runSearch(s, { signal, filter: { category, tag, place, person: people } });
                signal.throwIfAborted();
            } catch (e) {
                if (e === 'newpage') {
                    return;
                } else {
                    throw e;
                }
            }
            setPosts(p);
        })();
        return () => abort.abort('newpage');
    }, [s, category, tag, place, people]);

    return <ul>{
        posts.map(({value, href}) =>
            <li key={href}>
              <Link to={href}>{value}</Link>
            </li>)
    }</ul>;
};

const parseParams = search => {
    const params = new URLSearchParams(search);
    const s = params.get('s') ?? '';
    const category = params.getAll('category');
    const tag = params.getAll('tag');
    const place = params.getAll('place');
    const people = params.getAll('person');
    return { s, category, tag, place, people };
};

export const Head = ({location: {pathname, search}}) => {
    const { s } = parseParams(search);
    const title = s === '' ? 'Search' : `${s}\u2009\u2014\u2009Search`;
    return <>
               <HeadBasic pathname={pathname} />
               <Title>{title}</Title>
           </>;
};

const SearchPage = ({ location: { pathname, search } }) => {
    const id = React.useId();

    const { s, category, tag, place, people } = parseParams(search);

    const heading = s === '' ? 'Search' : `${s}\u2009\u2014\u2009Search`;
    return <Layout>
               <main aria-describedby={id}>
                   <header>
                       <hgroup>
                           <h1 id={id}>{heading}</h1>
                       </hgroup>
                   </header>

                   <PostList s={s} category={category} tag={tag} place={place}/>
               </main>
               <Sidebar>
                   <SearchForm action={pathname} s={s}
                               category={category} tag={tag} place={place}
                               people={people}
                   />
                   <Breadcrumbs>
                       <li><Link to="/">Home</Link></li>
                       <li aria-current="page"><cite>Search</cite></li>
                   </Breadcrumbs>
               </Sidebar>
           </Layout>;
};

export default SearchPage;
