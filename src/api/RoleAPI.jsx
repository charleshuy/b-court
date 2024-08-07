import apiClient from "./apiClient";

const RoleAPI = {
  // Method to create a new role
  createRole: async (roleData) => {
    try {
      const response = await apiClient.post("/roles", roleData);
      return response.data;
    } catch (error) {
      console.error("Failed to create role:", error);
      throw error;
    }
  },

  // Method to get a role by its ID
  getRoleById: async (roleId) => {
    try {
      const response = await apiClient.get(`/roles/${roleId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch role with ID ${roleId}:`, error);
      throw error;
    }
  },

  // Method to update a role
  updateRole: async (roleId, roleData) => {
    try {
      const response = await apiClient.put(`/roles/${roleId}`, roleData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update role with ID ${roleId}:`, error);
      throw error;
    }
  },

  // Method to delete a role by its ID
  deleteRoleById: async (roleId) => {
    try {
      const response = await apiClient.delete(`/roles/${roleId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete role with ID ${roleId}:`, error);
      throw error;
    }
  },

  // Method to fetch all roles with pagination
  getAllRoles: async () => {
    try {
      const response = await apiClient.get(`/roles`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      throw error;
    }
  },
};

export default RoleAPI;
