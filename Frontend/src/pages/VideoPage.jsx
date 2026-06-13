import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVideoById } from "../services/videoService";
import { likeVideo, unlikeVideo } from "../services/likeService";
import { addVideoToPlaylist } from "../services/playlistService";

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await getVideoById(id);
        setVideo(res.data?.video);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVideo();
  }, [id]);

  const handleLike = async () => {
    try {
      if (liked) {
        await unlikeVideo(id);
      } else {
        await likeVideo(id);
      }
      setLiked(!liked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    const playlistId = prompt("Enter Playlist ID to save video:");
    if (!playlistId) return;
    try {
      await addVideoToPlaylist(id, playlistId);
      alert("Video added to playlist!");
    } catch (err) {
      console.error(err);
      alert("Failed to save video.");
    }
  };

  if (!video) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="aspect-video bg-black mb-6 rounded-lg overflow-hidden">
          <video controls className="w-full h-full object-cover">
            <source src={`/api/v1/videos/${id}/stream`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        <p className="text-sm text-zinc-400 mb-4">
          {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
        </p>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleLike}
            className={`px-4 py-2 rounded text-sm ${
              liked ? "bg-red-600" : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            {liked ? "❤️ Liked" : "👍 Like"}
          </button>

          <button
            onClick={handleSave}
            className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-sm"
          >
            💾 Save
          </button>

          <button className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-sm">
            🔗 Share
          </button>
        </div>

        <div className="border-t border-zinc-700 pt-4">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-sm text-zinc-300">{video.description}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
