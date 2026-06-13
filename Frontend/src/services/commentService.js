import axios from "../api/axios";

const API = "/api/v1/comments";

// Get all comments for a video
export const getCommentsByVideoId = (videoId) =>
  axios.get(`${API}/${videoId}`);

// Post a new comment on a video
export const postComment = (videoId, content) =>
  axios.post(`${API}/${videoId}`, { content });

// Delete a comment by its ID
export const deleteComment = (commentId) =>
  axios.delete(`${API}/c/${commentId}`);

// (Optional) Update a comment by its ID
export const updateComment = (commentId, content) =>
  axios.patch(`${API}/c/${commentId}`, { content });
