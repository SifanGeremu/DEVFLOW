// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://devflow-1-u8q9.onrender.com/api",
  
});

// Add JWT token from localStorage if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
