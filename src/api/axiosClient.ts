import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://library-backend-production-b9cf.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("booky_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Terjadi kesalahan."
    );
  }
  return "Terjadi kesalahan tidak diketahui.";
}

export function getMultipartHeaders() {
  return {
    "Content-Type": "multipart/form-data",
  };
}