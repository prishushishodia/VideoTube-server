import axios from "../api/axios";

const API = "/api/v1/likes";

// Backend exposes a single toggle endpoint per target (POST).
// like*/unlike* both hit it so existing callers keep working as a toggle.

// Toggle like on a video
export const likeVideo = (videoId) =>
  axios.post(`${API}/toggle/v/${videoId}`);
export const unlikeVideo = (videoId) =>
  axios.post(`${API}/toggle/v/${videoId}`);

// Toggle like on a comment
export const likeComment = (commentId) =>
  axios.post(`${API}/toggle/c/${commentId}`);
export const unlikeComment = (commentId) =>
  axios.post(`${API}/toggle/c/${commentId}`);

// Toggle like on a tweet
export const likeTweet = (tweetId) =>
  axios.post(`${API}/toggle/t/${tweetId}`);
export const unlikeTweet = (tweetId) =>
  axios.post(`${API}/toggle/t/${tweetId}`);

// Get all liked videos
export const getLikedVideos = () =>
  axios.get(`${API}/videos`);
