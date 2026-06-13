import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Sparkles, Film } from "lucide-react";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/VideoCardSkeleton";
import { getAllVideos } from "../services/videoService";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

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

    if (user) fetchVideos();
    else setLoading(false);
  }, [user]);

  const firstName = (user?.fullName || "").split(" ")[0];
  const trending = [...videos]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 12);

  /* signed-out gate */
  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="surface max-w-md p-8 text-center animate-fade-up">
          <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff5470] to-brand-600">
            <Film className="h-7 w-7 text-white" />
          </span>
          <h1 className="text-2xl font-bold">Welcome to VideoTube</h1>
          <p className="mt-2 text-muted">
            Sign in to explore trending videos, subscribe to channels and build
            your library.
          </p>
          <Link to="/login" className="btn btn-primary mt-6 w-full">
            Sign in to continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* greeting */}
      <header className="animate-fade-up">
        <p className="text-sm font-medium text-brand">Welcome back</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {firstName ? `Hey ${firstName}, ` : ""}what do you want to watch?
        </h1>
      </header>

      {loading ? (
        <SkeletonHome />
      ) : videos.length === 0 ? (
        <EmptyHome />
      ) : (
        <>
          {/* Trending rail */}
          <Section icon={TrendingUp} title="Trending now">
            <div className="-mx-1 flex gap-4 overflow-x-auto scrollbar-hide px-1 pb-2 stagger">
              {trending.map((v, i) => (
                <div key={v._id} style={{ "--i": i }}>
                  <VideoCard video={v} compact />
                </div>
              ))}
            </div>
          </Section>

          {/* Latest grid */}
          <Section icon={Sparkles} title="Fresh for you">
            <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger">
              {videos.map((v, i) => (
                <div key={v._id} style={{ "--i": i % 8 }}>
                  <VideoCard video={v} />
                </div>
              ))}
            </div>
          </Section>
        </>
      )}
    </div>
  );
};

const Section = ({ icon: Icon, title, children }) => (
  <section>
    <div className="mb-4 flex items-center gap-2.5">
      {Icon && <Icon className="h-5 w-5 text-brand" />}
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
    </div>
    {children}
  </section>
);

const SkeletonHome = () => (
  <div className="space-y-10">
    <div>
      <div className="skeleton mb-4 h-6 w-40 rounded" />
      <div className="flex gap-4 overflow-hidden pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <VideoCardSkeleton key={i} compact />
        ))}
      </div>
    </div>
    <div>
      <div className="skeleton mb-4 h-6 w-40 rounded" />
      <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

const EmptyHome = () => (
  <div className="surface flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
    <Film className="h-10 w-10 text-zinc-600" />
    <h3 className="text-lg font-semibold">No videos yet</h3>
    <p className="max-w-sm text-sm text-muted">
      There's nothing here right now. Be the first to share something.
    </p>
    <Link to="/upload" className="btn btn-primary mt-2">
      Upload a video
    </Link>
  </div>
);

export default Home;
