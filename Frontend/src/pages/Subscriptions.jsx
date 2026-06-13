import { useEffect, useState } from "react";
import { getSubscriptions } from "../services/subscriptionService";
import { getChannelVideos } from "../services/dashboardService";
import VideoCard from "../components/VideoCard";

const Subscriptions = () => {
  const [channels, setChannels] = useState([]);
  const [videosByChannel, setVideosByChannel] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await getSubscriptions();
        const subscribedChannels = res?.subscriptions || []; // Adjusted based on expected response
        setChannels(subscribedChannels);

        const videosMap = {};

        for (const sub of subscribedChannels) {
          const vids = await getChannelVideos(sub._id);
          videosMap[sub._id] = vids?.videos || [];
        }

        setVideosByChannel(videosMap);
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Your Subscriptions</h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : channels.length === 0 ? (
        <p className="text-gray-400">You haven't subscribed to any channels yet.</p>
      ) : (
        <div className="space-y-10">
          {channels.map((channel) => (
            <div key={channel._id}>
              <h2 className="text-lg font-semibold mb-3">{channel.fullName}</h2>
              {videosByChannel[channel._id]?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {videosByChannel[channel._id].map((video) => (
                    <VideoCard key={video._id} video={video} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No videos yet from this channel.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
