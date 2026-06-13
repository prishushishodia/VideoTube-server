import axios from "../api/axios";

const API = "/api/v1/likes";

// Like a video
export const likeVideo = (videoId) =>
  axios.post(`${API}/v/${videoId}`);

// Unlike a video
export const unlikeVideo = (videoId) =>
  axios.delete(`${API}/v/${videoId}`);

// Like a comment
export const likeComment = (commentId) =>
  axios.post(`${API}/c/${commentId}`);

// Unlike a comment
export const unlikeComment = (commentId) =>
  axios.delete(`${API}/c/${commentId}`);

// Like a tweet
export const likeTweet = (tweetId) =>
  axios.post(`${API}/t/${tweetId}`);

// Unlike a tweet
export const unlikeTweet = (tweetId) =>
  axios.delete(`${API}/t/${tweetId}`);

// Get all liked videos
export const getLikedVideos = () =>
  axios.get(`${API}/videos`);
