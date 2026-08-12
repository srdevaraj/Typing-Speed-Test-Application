import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080/api";

const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Register a new user.
 *
 * POST /auth/register
 */
export const register = async (userData) => {
  const response = await authClient.post(
    "/auth/register",
    {
      username: userData.username,
      email: userData.email,
      password: userData.password,
    }
  );

  return response.data;
};

/**
 * Login user.
 *
 * POST /auth/login
 *
 * Expected response:
 *
 * {
 *   token: "...",
 *   username: "...",
 *   email: "..."
 * }
 */
export const login = async (credentials) => {
  const response = await authClient.post(
    "/auth/login",
    {
      email: credentials.email,
      password: credentials.password,
    }
  );

  return response.data;
};