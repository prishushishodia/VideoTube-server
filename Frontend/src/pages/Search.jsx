import { useState } from "react";
import VideoCard from "../components/VideoCard";
import { getAllVideos } from "../services/videoService";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    try {
      setLoading(true);
      const res = await getAllVideos(keyword); // We'll edit service for search param
      setResults(res.data?.data?.videos || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Search Videos</h1>

      <form className="mb-6 flex" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search videos..."
          className="w-full p-3 rounded-l bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 px-6 rounded-r font-semibold"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-gray-300">Searching...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-400">No results found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
