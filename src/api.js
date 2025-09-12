import axios from "axios";
import { jwtDecode } from "jwt-decode";

// export const BASE_URL = "https://shoppit-api-5q6k.onrender.com";
export const BASE_URL = "http://127.0.0.1:8001";


const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      const decoded = jwtDecode(token);
      const expiry_date = decoded.exp;
      const current_time = Date.now() / 1000;

      if (expiry_date > current_time) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("Access token expired!");
        // here you can trigger refresh logic if needed
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
