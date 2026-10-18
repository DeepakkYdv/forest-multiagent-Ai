import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export function getApiErrorMessage(error) {
  return error.response?.data?.message || error.response?.data?.error || "Something went wrong. Please try again.";
}

export default apiClient;
