import apiClient from "./apiClient";

const UserAPI = {
  register: async (userData) => {
    try {
      const response = await apiClient.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      // Handle specific errors or return a generic error message
      if (error.response) {
        // Server responded with an error status code
        throw new Error(error.response.data.message || "Registration failed.");
      } else if (error.request) {
        // Request was made but no response received
        throw new Error("No response from server. Please try again later.");
      } else {
        // Something else happened while setting up the request
        throw new Error(
          "Failed to send request. Please check your network connection."
        );
      }
    }
  },

  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await apiClient.post("/users", userData);
    return response.data;
  },

  getAllUsers: async (page = 0, size = 10) => {
    const response = await apiClient.get(`/users?page=${page}&size=${size}`);
    return response.data;
  },

  deleteUserById: async (userId) => {
    const response = await apiClient.delete(`/users/delete/${userId}`);
    return response.data;
  },

  searchUsersByName: async (userName, page = 0, size = 10) => {
    const response = await apiClient.get(
      `/users/search?userName=${userName}&page=${page}&size=${size}`
    );
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  updateUser: async (userData) => {
    const response = await apiClient.put("/users", userData);
    return response.data;
  },

  getUsersByManagerId: async (managerId, page = 0, size = 10) => {
    const response = await apiClient.get(
      `/users/manager/${managerId}?page=${page}&size=${size}`
    );
    return response.data;
  },
  getUsersByRoleName: async (roleName) => {
    const response = await apiClient.get(`/users/role/${roleName}`);
    return response.data;
  },
};

export default UserAPI;
