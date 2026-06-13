import axios from "../api/axios";

const API = "/api/v1/videos";

// Fetch all videos (paginated)


export const getAllVideos = async (search = "") => {
  const res = await axios.get(`/api/v1/videos?query=${encodeURIComponent(search)}`);
  return res.data;
};


// Fetch video by ID
export const getVideoById = (videoId) =>
  axios.get(`${API}/${videoId}`);

// Upload new video (form-data with video & thumbnail)
export const uploadVideo = (data) =>
  axios.post(`${API}`, data);

// Delete a video by ID
export const deleteVideo = (videoId) =>
  axios.delete(`${API}/${videoId}`);
