import axiosInstance from "../utils/axios";

export const userService = {
  getAllUsers: async (params = {}) => {
    const response = await axiosInstance.get("/api/users", { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await axiosInstance.get(`/api/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await axiosInstance.post("/api/users", userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await axiosInstance.put(`/api/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/api/users/${id}`);
    return response.data;
  },

  restoreUser: async (id) => {
    const response = await axiosInstance.put(`/api/users/${id}/restore`);
    return response.data;
  },
};
