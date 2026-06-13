import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import Loader from "../components/Loader";
import { getAllVideos } from "../services/videoService";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();  // user object or null
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await getAllVideos();
        setVideos(res?.data?.videos || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {  // only fetch videos if logged in
      fetchVideos();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white p-4 space-y-8">
      <h1 className="text-3xl font-bold">Explore Videos</h1>

      {!user ? (
        <p className="text-lg text-gray-300">Please log in to see videos.</p>
      ) : loading ? (
        <Loader />
      ) : videos.length === 0 ? (
        <p className="text-lg text-gray-300">No videos found.</p>
      ) : (
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Trending Now</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Recently Added</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {videos
                .slice()
                .reverse()
                .map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Home;
