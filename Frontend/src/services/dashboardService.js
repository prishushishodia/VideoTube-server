import axios from "../api/axios";

const API = "/api/v1/dashboard";

// Helper to add Authorization header
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  };
};

// Get all videos uploaded by the logged-in user's channel
export const getChannelVideos = async () => {
  const res = await axios.get(`${API}/videos`, authHeader());
  return res.data?.videos || res.data;
};

// Get stats like total videos, total likes, subscribers, etc.
export const getChannelStats = async () => {
  const res = await axios.get(`${API}/stats`, authHeader());
  return res.data?.stats || res.data;
};
