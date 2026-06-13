import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Video as VideoIcon, Users, UserX } from "lucide-react";
import { getUserById } from "../services/authService";
import { getChannelVideos } from "../services/dashboardService";
import { useAuth } from "../context/AuthContext";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/VideoCardSkeleton";
import Avatar from "../components/Avatar";
import EmptyState from "../components/EmptyState";
import { formatViews } from "../utils/format";

const asArray = (x) =>
  Array.isArray(x) ? x : x?.videos || x?.data?.videos || x?.data || [];

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isOwn = user?._id === id;

  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const userRes = await getUserById(id);
        const ch = userRes?.data || userRes?.user || userRes || null;
        setProfile(ch && ch._id ? ch : isOwn ? user : ch);
      } catch (err) {
        console.error("Failed to load profile:", err);
        if (isOwn) setProfile(user);
      }
      try {
        const videoRes = await getChannelVideos(id);
        setVideos(asArray(videoRes));
      } catch (err) {
        console.error("Failed to load channel videos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <ProfileSkeleton />;

  if (!profile) {
    return (
      <EmptyState
        icon={UserX}
        title="Channel not found"
        subtitle="This user doesn't exist or couldn't be loaded."
        action={
          <Link to="/" className="btn btn-primary">
            Back home
          </Link>
        }
      />
    );
  }

  const name = profile.fullName || profile.username || "Channel";
  const subs = profile.subscribersCount ?? profile.subscribers ?? 0;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Banner */}
      <div className="relative h-36 overflow-hidden rounded-2xl sm:h-48">
        {profile.coverImage ? (
          <img
            src={profile.coverImage}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background:
                "radial-gradient(30rem 20rem at 20% 0%, rgba(255,45,85,0.35), transparent 60%), radial-gradient(30rem 20rem at 90% 100%, rgba(124,92,255,0.3), transparent 55%), #15151b",
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
      </div>

      {/* Identity */}
      <div className="relative z-10 -mt-10 flex flex-col gap-4 px-1 sm:-mt-12 sm:flex-row sm:items-end sm:gap-6">
        <Avatar
          src={profile.avatar}
          name={name}
          size="w-24 h-24 sm:w-28 sm:h-28"
          ring
        />
        <div className="flex-1 pb-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{name}</h1>
          <p className="text-muted">@{profile.username}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {formatViews(subs)} subscribers
            </span>
            <span className="inline-flex items-center gap-1.5">
              <VideoIcon className="h-4 w-4" />
              {videos.length} video{videos.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>
        {isOwn && (
          <Link to="/upload" className="btn btn-primary self-start sm:self-auto">
            Upload video
          </Link>
        )}
      </div>

      {/* Uploads */}
      <div className="mt-10">
        <h2 className="mb-5 border-b border-white/5 pb-3 text-lg font-bold tracking-tight">
          {isOwn ? "Your videos" : "Videos"}
        </h2>
        {videos.length === 0 ? (
          <EmptyState
            icon={VideoIcon}
            title={isOwn ? "You haven't uploaded yet" : "No videos yet"}
            subtitle={
              isOwn
                ? "Share your first video — it'll show up right here."
                : "This channel hasn't posted any videos."
            }
            action={
              isOwn ? (
                <Link to="/upload" className="btn btn-primary">
                  Upload your first video
                </Link>
              ) : null
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger">
            {videos.map((v, i) => (
              <div key={v._id} style={{ "--i": i % 8 }}>
                <VideoCard video={v} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileSkeleton = () => (
  <div className="mx-auto max-w-6xl">
    <div className="skeleton h-36 w-full rounded-2xl sm:h-48" />
    <div className="-mt-10 flex items-end gap-6 px-1 sm:-mt-12">
      <div className="skeleton h-24 w-24 rounded-full sm:h-28 sm:w-28" />
      <div className="space-y-2 pb-2">
        <div className="skeleton h-6 w-44 rounded" />
        <div className="skeleton h-4 w-28 rounded" />
      </div>
    </div>
    <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default Profile;
