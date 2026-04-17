import axiosInstance from "../utils/axios";

export const authService = {
  login: async (email, password) => {
    const response = await axiosInstance.post("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post("/api/auth/logout");
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get("/api/profile");
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await axiosInstance.put("/api/profile", userData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await axiosInstance.put(
      "/api/profile/change-password",
      passwordData,
    );
    return response.data;
  },
};
