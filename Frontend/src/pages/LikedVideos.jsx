import { useEffect, useState } from "react";
import { getLikedVideos } from "../services/likeService";
import VideoCard from "../components/VideoCard";
import Loader from "../components/Loader";

const LikedVideos = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const res = await getLikedVideos();
        setLikedVideos(res?.data?.videos || []);
      } catch (err) {
        console.error("Failed to fetch liked videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);

  return (
    <div className="p-6 text-white bg-black min-h-screen space-y-6">
      <h1 className="text-3xl font-bold">Liked Videos</h1>

      {loading ? (
        <Loader />
      ) : likedVideos.length === 0 ? (
        <p className="text-gray-400">You haven't liked any videos yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {likedVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedVideos;
