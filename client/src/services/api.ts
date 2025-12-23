import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Always send server JWT from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // server JWT
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userApi = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data: any) => api.put("/user/profile", data),
};

export default api;
// Add at the bottom of your api.ts
export const tasksApi = {
  getRoadmapTasks: () => api.get('/api/roadmap/tasks'),
  getTodayTasks: () => api.get('/tasks/today'),
  completeTask: (id: string) => api.patch(`/tasks/${id}/complete`),
};
