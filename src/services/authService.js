import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://typing-speed-test-application-backend.onrender.com/api";

console.log("API BASE URL:", API_BASE_URL);

const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (credentials) => {
  console.log("Sending login request to:", `${API_BASE_URL}/auth/login`);

  const response = await authClient.post("/auth/login", {
    email: credentials.email,
    password: credentials.password,
  });

  return response.data;
};

export const register = async (userData) => {
  const response = await authClient.post("/auth/register", {
    username: userData.username,
    email: userData.email,
    password: userData.password,
  });

  return response.data;
};