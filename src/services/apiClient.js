import axios from "axios";

import {
  getToken,
  removeToken,
} from "../utils/authUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://typing-speed-test-application-backend.onrender.com/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Attach JWT to every request.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers = config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    console.log("========== API REQUEST ==========");
    console.log(
      "Method:",
      config.method?.toUpperCase()
    );
    console.log(
      "URL:",
      `${config.baseURL}${config.url}`
    );
    console.log(
      "JWT exists:",
      Boolean(token)
    );
    console.log(
      "Authorization:",
      token ? "Bearer <token>" : "Not attached"
    );
    console.log(
      "=================================");
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Handle API responses.
 */
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      "========== API RESPONSE =========="
    );
    console.log("Status:", response.status);
    console.log("URL:", response.config?.url);
    console.log(
      "=================================="
    );

    return response;
  },
  (error) => {
    console.error(
      "========== API ERROR =========="
    );
    console.error(
      "URL:",
      error.config?.url
    );
    console.error(
      "Method:",
      error.config?.method
    );
    console.error(
      "Status:",
      error.response?.status
    );
    console.error(
      "Response:",
      error.response?.data
    );
    console.error(
      "Message:",
      error.message
    );
    console.error(
      "================================"
    );

    /**
     * 401:
     * Token missing / invalid / expired.
     */
    if (error.response?.status === 401) {
      removeToken();

      if (
        window.location.pathname !== "/login"
      ) {
        window.location.replace("/login");
      }
    }

    /**
     * IMPORTANT:
     *
     * Do NOT remove the token for 403.
     *
     * 403 means authentication succeeded,
     * but authorization failed.
     */
    return Promise.reject(error);
  }
);

export default apiClient;