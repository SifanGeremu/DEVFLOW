import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authApi = {
  googleLogin: () => api.get('/auth/google'),
  handleCallback: (code: string) => api.post('/auth/google/callback', { code }),
};

// User endpoints
export const userApi = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: ProfileUpdate) => api.patch('/user/profile', data),
};

// Tasks endpoints
export const tasksApi = {
  getRoadmapTasks: () => api.get('/api/roadmap/tasks'),
  getTodayTasks: () => api.get('/tasks/today'),
  completeTask: (id: string) => api.patch(`/tasks/${id}/complete`),
};

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  goal: string;
  dailyTime: number;
  currentStreak: number;
  longestStreak: number;
}

export interface ProfileUpdate {
  name?: string;
  skillLevel?: string;
  goal?: string;
  dailyTime?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedTime: number;
  completed: boolean;
  order: number;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  phase: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  tasks: Task[];
}

export default api;
