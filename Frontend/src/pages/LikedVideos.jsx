import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp } from "lucide-react";
import { getLikedVideos } from "../services/likeService";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/VideoCardSkeleton";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

const LikedVideos = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const res = await getLikedVideos();
        setLikedVideos(res?.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch liked videos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLikedVideos();
  }, []);

  return (
    <div>
      <PageHeader
        icon={ThumbsUp}
        title="Liked Videos"
        subtitle={
          loading
            ? "Loading your likes…"
            : `${likedVideos.length} video${likedVideos.length === 1 ? "" : "s"} you enjoyed`
        }
      />

      {loading ? (
        <Grid>
          {Array.from({ length: 8 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </Grid>
      ) : likedVideos.length === 0 ? (
        <EmptyState
          icon={ThumbsUp}
          title="No liked videos yet"
          subtitle="Tap the like button on any video and it'll show up here."
          action={
            <Link to="/" className="btn btn-primary">
              Browse videos
            </Link>
          }
        />
      ) : (
        <Grid>
          {likedVideos.map((video, i) => (
            <div key={video._id} style={{ "--i": i % 8 }}>
              <VideoCard video={video} />
            </div>
          ))}
        </Grid>
      )}
    </div>
  );
};

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger">
    {children}
  </div>
);

export default LikedVideos;
