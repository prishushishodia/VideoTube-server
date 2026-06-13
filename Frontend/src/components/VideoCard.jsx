import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { formatViews, formatDuration, timeAgo } from "../utils/format";

const VideoCard = ({ video, compact = false }) => {
  if (!video) return null;

  const {
    _id,
    title = "Untitled video",
    thumbnail,
    owner = {},
    views = 0,
    duration = 0,
    createdAt,
  } = video;

  const channel = owner?.fullName || owner?.username || "Unknown channel";

  return (
    <Link
      to={`/video/${_id}`}
      className={`group block ${compact ? "w-[260px] shrink-0" : "w-full"}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-panel-2 ring-1 ring-white/5">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-panel-2 to-panel" />
        )}

        {/* hover sheen */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* play affordance */}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/55 backdrop-blur-sm ring-1 ring-white/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>

        {duration > 0 && (
          <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-white">
            {formatDuration(duration)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 flex gap-3">
        <Avatar src={owner?.avatar} name={channel} size="w-9 h-9 shrink-0" />
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-[0.95rem] font-semibold leading-snug text-zinc-100 transition-colors group-hover:text-white">
            {title}
          </h3>
          <p className="mt-1 truncate text-sm text-muted transition-colors group-hover:text-zinc-300">
            {channel}
          </p>
          <p className="text-xs text-zinc-500">
            {formatViews(views)} views
            {createdAt ? ` · ${timeAgo(createdAt)}` : ""}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
