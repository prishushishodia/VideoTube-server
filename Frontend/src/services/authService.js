import axios from "../api/axios";

// Login
export const login = async (credentials) => {
  const res = await axios.post("/api/v1/users/login", credentials, {
    withCredentials: true, // Sends cookies like refreshToken
  });
  return res.data;
};

// Register
export const register = async (formData) => {
  const res = await axios.post("/api/v1/users/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return res.data;
};

// Get Current Logged-In User Profile
export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("No access token found");

  const res = await axios.get("/api/v1/users/current-user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return res.data?.data || res.data?.user || res.data;
};

// Get Any User by ID (for visiting profiles)
export const getUserById = async (userId) => {
  const res = await axios.get(`/api/v1/users/c/${userId}`, {
    withCredentials: true,
  });
  return res.data?.user || res.data;
};
