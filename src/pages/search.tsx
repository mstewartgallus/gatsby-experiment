import * as React from "react";
import { navigate, Link, Script } from "gatsby";
import type { HeadFC, PageProps } from "gatsby";
import Layout from "../components/layout.tsx";
import Sidebar from "../components/sidebar.tsx";

const imp = new Function('x', 'return import(x);');
const getpf = async () => {
    return await imp("/static/pagefind/pagefind.js");
};

const pagefindToPost = ({ url, meta: { title } }) => ({
    'href': url,
    'value': title
});

const search = async ({s, category, tag, place }) => {
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

    const posts = await Promise.all(results.map(r => r.data()));
    console.log([filters, posts]);
    return posts.map(pagefindToPost);
};

const SearchForm = ({s}) => {
    const [getS, setS] = React.useState(s);

    const onChangeS = (event) => setS(event.target.value);

    const onSubmit = (event) => {
        event.preventDefault();

        const p = new URLSearchParams();
        p.set('s', getS);
        navigate(`/search?${p}`);
    };

    return <form aria-describedby="search-title" role="search" rel="search"
        action="/search"
        onSubmit={onSubmit}>
          <header className="sr-only">
            <hgroup>
              <h2 id="search-title">Search</h2>
            </hgroup>
          </header>

          <div className="search-basic">
            <label htmlFor="search-input">Query</label>
            <input id="search-input" name="s" type="search" required
                   value={getS}
                   onChange={onChangeS}
            />
            <button type="submit">Search</button>
          </div>
        </form>;
};

const Post = ({value, href}) =>
    <li><Link to={href}>{value}</Link></li>;

const Posts = ({posts}) => posts.map(({value, href}) => <Post key={href} value={value} href={href} />);

const PostList = ({s, category, tag, place}) => {
    const [ posts, setPosts ] = React.useState([]);

    React.useEffect(() => {
        (async () => {
            setPosts(await search({ s, category, tag, place }));
        })();
    }, [s, category, tag, place]);
    return <ul><Posts posts={posts} /></ul>;
};

const SearchPageImpl = ({ s, category, tag, place }) =>
<Layout>
      <main aria-describedby="title">
        <header>
          <hgroup>
            <h1 id="title">Search</h1>
          </hgroup>
        </header>

      <PostList s={s} category={category} tag={tag} place={place}/>
    </main>
    <Sidebar>
      <SearchForm s={s} />
    </Sidebar>
</Layout>;

const parseParams = search => {
    const params = new URLSearchParams(search);
    const s = params.get('s') ?? '';
    const category = params.getAll('category');
    const tag = params.getAll('tag');
    const place = params.getAll('place');
    return { s, category, tag, place };
};

export const Head: HeadFC = () => <title>Search</title>;

export const SearchPage: React.FC<PageProps> =
    ({location: { search }}) => {
        const { s, category, tag, place } = parseParams(search);
        return <SearchPageImpl s={s} category={category} tag={tag} place={place} />;
    };

export default SearchPage;
