import axios from "../api/axios";

const API = "/api/v1/tweets";

// Create a new tweet
export const createTweet = (data) =>
  axios.post(`${API}`, data);  // data should have 'content'

// Get tweets by user ID
export const getUserTweets = (userId) =>
  axios.get(`${API}/user/${userId}`);

// Update a tweet
export const updateTweet = (tweetId, data) =>
  axios.patch(`${API}/${tweetId}`, data);

// Delete a tweet
export const deleteTweet = (tweetId) =>
  axios.delete(`${API}/${tweetId}`);
