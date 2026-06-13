import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPlaylistById } from "../services/playlistService";
import VideoCard from "../components/VideoCard";
import Loader from "../components/Loader";

const PlaylistDetail = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await getPlaylistById(id);
        setPlaylist(res?.data?.data || {});
      } catch (err) {
        console.error("Failed to load playlist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <Loader />
        ) : playlist ? (
          <>
            <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
            <p className="text-zinc-400 mb-6">{playlist.description}</p>

            {playlist.videos?.length === 0 ? (
              <p className="text-gray-400">This playlist is empty.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {playlist.videos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-red-500">Playlist not found.</p>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;
