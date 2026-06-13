import axios from "../api/axios";

const API = "/api/v1/subscriptions";

// Toggle subscription to a channel by channelId
export const toggleSubscription = (channelId) =>
  axios.post(`${API}/toggle/${channelId}`);

// Get subscribers of a specific channel by channelId
export const getChannelSubscribers = (channelId) =>
  axios.get(`${API}/channel/${channelId}`);

// Get channels that a user (subscriber) is subscribed to
export const getSubscribedChannels = (subscriberId) =>
  axios.get(`${API}/user/${subscriberId}`);
// Alias for older naming
export const getSubscriptions = getSubscribedChannels;
