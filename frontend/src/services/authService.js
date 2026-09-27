import axios from "axios";

const API_URL = "http://localhost:8081/api";

const authService = {
  async register(data) {
    const response = await axios.post(
      `${API_URL}/auth/register`,
      data
    );

    console.log("Register response:", response.data);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    if (response.data.user) {
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );
    }

    return response.data;
  },

  async login(data) {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      data
    );

    console.log("Login response:", response.data);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    if (response.data.user) {
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );
    }

    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken() {
    return localStorage.getItem("token");
  },

  getUser() {
    try {
      const user = localStorage.getItem("user");

      if (
        !user ||
        user === "undefined" ||
        user === "null"
      ) {
        return null;
      }

      return JSON.parse(user);
    } catch (error) {
      console.error("Failed to read user:", error);

      localStorage.removeItem("user");

      return null;
    }
  },

  isAuthenticated() {
    return Boolean(
      localStorage.getItem("token")
    );
  },
};

export default authService;