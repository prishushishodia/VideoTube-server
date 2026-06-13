import axios from "../api/axios";

const API = "/api/v1/playlists";

// Create new playlist
export const createPlaylist = (data) =>
  axios.post(`${API}`, data);

// Get playlist by ID
export const getPlaylistById = (playlistId) =>
  axios.get(`${API}/${playlistId}`);

// Update playlist
export const updatePlaylist = (playlistId, data) =>
  axios.patch(`${API}/${playlistId}`, data);

// Delete playlist
export const deletePlaylist = (playlistId) =>
  axios.delete(`${API}/${playlistId}`);

// Add video to playlist
export const addVideoToPlaylist = (videoId, playlistId) =>
  axios.patch(`${API}/${playlistId}/videos/${videoId}`);

// Remove video from playlist
export const removeVideoFromPlaylist = (videoId, playlistId) =>
  axios.delete(`${API}/${playlistId}/videos/${videoId}`);

// Get all playlists by user ID
export const getUserPlaylists = (userId) =>
  axios.get(`${API}/user/${userId}`);
