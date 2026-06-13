import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThumbsUp, Bookmark, Share2, Check, ChevronDown } from "lucide-react";
import { getVideoById } from "../services/videoService";
import { likeVideo, unlikeVideo } from "../services/likeService";
import { addVideoToPlaylist } from "../services/playlistService";
import Avatar from "../components/Avatar";
import { formatViews, timeAgo } from "../utils/format";

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await getVideoById(id);
        setVideo(res.data?.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVideo();
  }, [id]);

  const handleLike = async () => {
    try {
      if (liked) await unlikeVideo(video._id);
      else await likeVideo(video._id);
      setLiked(!liked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    const playlistId = prompt("Enter Playlist ID to save this video:");
    if (!playlistId) return;
    try {
      await addVideoToPlaylist(id, playlistId);
      alert("Video added to playlist!");
    } catch (err) {
      console.error(err);
      alert("Failed to add video to playlist.");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — ignore */
    }
  };

  if (!video) return <VideoSkeleton />;

  const owner = video.owner || {};
  const channelName = owner.fullName || owner.username || "Unknown channel";

  return (
    <div className="mx-auto max-w-5xl">
      {/* Player */}
      <div className="overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
        <video controls autoPlay className="aspect-video h-full w-full bg-black">
          <source src={video.videoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Title + meta */}
      <h1 className="mt-5 text-xl font-bold leading-snug tracking-tight sm:text-2xl">
        {video.title}
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        {formatViews(video.views)} views · {timeAgo(video.createdAt)}
      </p>

      {/* Channel + actions */}
      <div className="mt-4 flex flex-col gap-4 border-y border-white/5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to={owner._id ? `/profile/${owner._id}` : "#"}
          className="flex items-center gap-3"
        >
          <Avatar src={owner.avatar} name={channelName} size="w-11 h-11" ring />
          <div>
            <p className="font-semibold leading-tight text-white">{channelName}</p>
            {owner.username && (
              <p className="text-xs text-muted">@{owner.username}</p>
            )}
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`btn ${liked ? "btn-primary" : "btn-ghost"}`}
          >
            <ThumbsUp className={`h-4 w-4 ${liked ? "fill-white" : ""}`} />
            {liked ? "Liked" : "Like"}
          </button>
          <button onClick={handleSave} className="btn btn-ghost">
            <Bookmark className="h-4 w-4" />
            Save
          </button>
          <button onClick={handleShare} className="btn btn-ghost">
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                Copied
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                Share
              </>
            )}
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="surface mt-5 p-4">
        <p
          className={`whitespace-pre-line text-sm leading-relaxed text-zinc-300 ${
            expanded ? "" : "line-clamp-3"
          }`}
        >
          {video.description || "No description provided."}
        </p>
        {(video.description || "").length > 140 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-muted transition hover:text-white"
          >
            {expanded ? "Show less" : "Show more"}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>
    </div>
  );
};

const VideoSkeleton = () => (
  <div className="mx-auto max-w-5xl">
    <div className="skeleton aspect-video w-full rounded-2xl" />
    <div className="skeleton mt-5 h-6 w-3/4 rounded" />
    <div className="skeleton mt-2 h-4 w-40 rounded" />
    <div className="mt-4 flex items-center gap-3 border-y border-white/5 py-4">
      <div className="skeleton h-11 w-11 rounded-full" />
      <div className="space-y-2">
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    </div>
  </div>
);

export default VideoDetail;
