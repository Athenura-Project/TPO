import axios from "axios";

const IS_PROD = import.meta.env.PROD;
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (IS_PROD ? "" : "http://localhost:5000"),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
