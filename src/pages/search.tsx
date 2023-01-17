import * as React from "react";
import { navigate, Link } from "gatsby";
import type { HeadFC, PageProps } from "gatsby";
import BasicHead from "../components/basic-head.tsx";
import Title from "../components/title.tsx";
import Layout from "../components/layout.tsx";
import Sidebar from "../components/sidebar.tsx";
import Select from "../components/select.tsx";
import Option from "../components/option.tsx";
import Breadcrumbs from "../components/breadcrumbs.tsx";
import { usePostTags } from "../hooks/use-post-tags.ts";
import { search } from "./search.module.css";

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
    const posts = (await pf.search(s, { filters })).results;

    signal.throwIfAborted();

    // FIXME race?
    const links = await mapPromise(posts, async postPs => {
        return pagefindToPost(await postPs.data());
    });
    signal.throwIfAborted();

    return links;
};

const selectState = (legend, all, value) => {
    const [selected, setter] = React.useState(new Set(value));
    return {
        legend,
        all,
        selected,
        onChange: event => {
            const { target: { checked, value } } = event;
            const next = new Set(selected);
            if (checked) {
                next.add(value);
            } else {
                next.delete(value);
            }
            setter(next);
        }
    };
};

const SearchForm = ({s, category, place, tag}) => {
    const [getS, setS] = React.useState(s);
    const onChangeS = (event) => setS(event.target.value);

    const tags = usePostTags();

    const selects = {
        'category': selectState('Category', tags.category, category),
        'place': selectState('Place', tags.place, place),
        'tag': selectState('Tag', tags.tags, tag)
    };

    const onSubmit = (event) => {
        event.preventDefault();

        const p = new URLSearchParams();
        p.set('s', getS);

        for (const [k, {selected}] of Object.entries(selects)) {
            for (const v of selected) {
                p.append(k, v);
            }
        }
        navigate(`/search?${p}`);
    };

    const id = React.useId();
    return <form className={search} aria-describedby={id} role="search" rel="search"
        action="/search"
        onSubmit={onSubmit}>
          <header className="sr-only">
            <hgroup>
               <h2 id={`${id}-title`}>Search</h2>
            </hgroup>
          </header>

    <div className="search-basic">
            <label htmlFor={`${id}-input`}>Query</label>
            <input id={`${id}-input`} name="s" type="search"
                   value={getS}
                   onChange={onChangeS}
            />
            <button type="submit">Search</button>
    </div>

    {
        Object.entries(selects).map(([name, {legend, all, selected, onChange}]) =>
            <Select key={name} name={name}>
               <legend>{legend}</legend>
               {
                   all.map(opt =>
                       <Option key={opt}
                            onChange={onChange}
                            selected={selected.has(opt)}
                            value={opt}>
                       {opt}
                      </Option>)
               }</Select>
            )
    }
</form>;
};

const PostList = ({s, category, tag, place}) => {
    const [ posts, setPosts ] = React.useState([]);

    React.useEffect(() => {
        const abort = new AbortController();
        const signal = abort.signal;
        (async () => {
            let p;
            try {
                p = await runSearch(s, { signal, filter: { category, tag, place } });
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

export const Head: HeadFC = ({location: {pathname}}) => <>
   <BasicHead pathname={pathname} />
    <Title>Search</Title>
</>;

const SearchPage: React.FC<PageProps> =
    ({location: { search }}) => {
        const { s, category, tag, place } = parseParams(search);
        return <SearchPageImpl s={s} category={category} tag={tag} place={place} />;
    };

export default SearchPage;
