import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ListVideo, PlaySquare } from "lucide-react";
import { getPlaylistById } from "../services/playlistService";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/VideoCardSkeleton";
import EmptyState from "../components/EmptyState";

const PlaylistDetail = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await getPlaylistById(id);
        setPlaylist(res?.data?.data || null);
      } catch (err) {
        console.error("Failed to load playlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="surface mb-8 h-40 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!playlist || !playlist._id) {
    return (
      <EmptyState
        icon={ListVideo}
        title="Playlist not found"
        subtitle="This playlist may have been removed or never existed."
        action={
          <Link to="/" className="btn btn-primary">
            Back home
          </Link>
        }
      />
    );
  }

  const videos = playlist.videos || [];

  return (
    <div className="mx-auto max-w-6xl">
      {/* Playlist hero */}
      <div className="surface mb-8 flex flex-col gap-5 overflow-hidden p-6 sm:flex-row sm:items-center">
        <div className="flex h-28 w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#ff5470]/30 to-brand-600/20 sm:w-48">
          <ListVideo className="h-10 w-10 text-brand" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            Playlist
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {playlist.name}
          </h1>
          {playlist.description && (
            <p className="mt-2 text-sm text-muted">{playlist.description}</p>
          )}
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-zinc-400">
            <PlaySquare className="h-4 w-4" />
            {videos.length} video{videos.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {videos.length === 0 ? (
        <EmptyState
          icon={PlaySquare}
          title="This playlist is empty"
          subtitle="Videos added to this playlist will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger">
          {videos.map((video, i) => (
            <div key={video._id} style={{ "--i": i % 8 }}>
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistDetail;
