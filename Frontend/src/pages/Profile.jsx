import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserById } from "../services/authService";
import { getChannelVideos } from "../services/dashboardService";
import VideoCard from "../components/VideoCard";
import Loader from "../components/Loader";

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!id) return;

        const userRes = await getUserById(id); 
        setProfile(userRes?.user);  // Adjusted based on your service

        const videoRes = await getChannelVideos(id); // Pass the user id to get videos
        setVideos(videoRes?.videos || []);
        
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <Loader />
        ) : profile ? (
          <>
            <h1 className="text-3xl font-bold mb-1">{profile.fullName || "Channel"}</h1>
            <p className="text-zinc-400 mb-6">@{profile.username}</p>

            {/* Profile Info */}
            <div className="bg-zinc-800 rounded-xl p-4 mb-6 shadow flex items-center gap-4">
              <img
                src={profile.avatar || "https://i.pravatar.cc/150"}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold">{profile.fullName}</h2>
                <p className="text-zinc-400 text-sm">Subscribers: {profile.subscribers || 0}</p>
              </div>
            </div>

            {/* Uploaded Videos */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Uploads</h2>
              {videos.length === 0 ? (
                <p className="text-gray-400">No uploads yet.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {videos.map((video) => (
                    <VideoCard key={video._id} video={video} />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-red-500">User not found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
