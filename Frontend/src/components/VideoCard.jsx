import { Link } from "react-router-dom";

const VideoCard = ({ video }) => {
  if (!video) return null;

  const {
    _id,
    title = "Untitled Video",
    thumbnail = "/default-thumbnail.jpg",
    owner = {},
    views = 0,
  } = video;

  return (
    <Link
      to={`/video/${_id}`}
      className="min-w-[200px] sm:min-w-[240px] bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
    >
      {/* Thumbnail */}
      <div className="w-full aspect-video bg-black">
        <img
          src={thumbnail}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-3 space-y-1">
        <h3 className="text-white text-sm font-semibold line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-400 text-xs">
          {owner?.username || "Unknown Channel"}
        </p>
        <p className="text-gray-500 text-xs">{views} views</p>
      </div>
    </Link>
  );
};

export default VideoCard;
