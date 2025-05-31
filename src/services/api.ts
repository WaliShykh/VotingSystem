import axios from "axios";
//@ts-ignore
import type { AxiosRequestConfig } from "axios";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:5174/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
      portal: "user",
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    dob: string;
    gender: string;
    password: string;
    confirmPassword: string;
    agreedToTerms: boolean;
  }): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>(
      "/auth/register",
      userData
    );
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};

// Correct default export
export default api;
