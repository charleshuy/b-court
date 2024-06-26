import apiClient from "./apiClient";

const RoleAPI = {
  getRoles: async (roleData) => {
    try {
      const response = await apiClient.post("/roles/register", roleData);
      return response.data;
    } catch (error) {
      console.error("Cant fetch role:", error);
      throw error;
    }
  },
};
