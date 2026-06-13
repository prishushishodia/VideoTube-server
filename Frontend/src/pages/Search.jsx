import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, SearchX } from "lucide-react";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/VideoCardSkeleton";
import EmptyState from "../components/EmptyState";
import { getAllVideos } from "../services/videoService";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [keyword, setKeyword] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // keep input in sync with the URL (e.g. navbar search)
  useEffect(() => setKeyword(query), [query]);

  // run the search whenever the URL query changes
  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setResults([]);
      setSearched(false);
      return;
    }
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await getAllVideos(term);
        if (active) setResults(res.data?.videos || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) {
          setLoading(false);
          setSearched(true);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const term = keyword.trim();
    if (term) setSearchParams({ q: term });
  };

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-5 text-2xl font-bold tracking-tight animate-fade-up">
        Search
      </h1>

      <form onSubmit={handleSubmit} className="relative mb-8 animate-fade-up">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
        <input
          autoFocus
          type="text"
          placeholder="Search for videos, topics, creators…"
          className="field py-3.5 pl-12 pr-28 text-base"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary absolute right-1.5 top-1/2 -translate-y-1/2"
        >
          Search
        </button>
      </form>

      {loading ? (
        <Grid>
          {Array.from({ length: 8 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </Grid>
      ) : !searched ? (
        <EmptyState
          icon={SearchIcon}
          title="Find something to watch"
          subtitle="Type a keyword above to search across every video on VideoTube."
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title={`No results for “${query}”`}
          subtitle="Try a different keyword or check your spelling."
        />
      ) : (
        <>
          <p className="mb-5 text-sm text-muted">
            {results.length} result{results.length === 1 ? "" : "s"} for{" "}
            <span className="font-semibold text-zinc-200">“{query}”</span>
          </p>
          <Grid>
            {results.map((video, i) => (
              <div key={video._id} style={{ "--i": i % 8 }}>
                <VideoCard video={video} />
              </div>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
};

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger">
    {children}
  </div>
);

export default Search;
