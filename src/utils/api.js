import axios from "axios";
import toast from "react-hot-toast";

const STORAGE_KEY = "space_admin";

export const api = axios.create({
  baseURL: "https://api-space-tourism.vercel.app/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Let the browser set Content-Type (multipart/form-data + boundary) for file uploads
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const isPasswordUpdateRequest = error?.config?.url?.includes("update-password") === true;

    if (status === 401 && !isPasswordUpdateRequest) {
      localStorage.removeItem(STORAGE_KEY);
      if (!window.location.pathname.includes("/dashboard/login")) {
        window.location.href = "/dashboard/login";
      }
    } else if (status !== 401) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
    return Promise.reject(error);
  }
);

export { STORAGE_KEY };
