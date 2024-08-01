import apiClient from "./apiClient";
import axios from "axios";

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

  
getTotalCustomers: async (Customers) => {
    try {
      const response = await apiClient.get(`/users/role/${Customers}`);
      console.log(response.data)
      return response.data.count; 
    } catch (error) {
      console.error('Failed to fetch total customers:', error);
      throw new Error("Failed to retrieve total customers.");
    }
  },

  getTotalStaff: async (Staff) => {
    try {
      const response = await axios.get(`/users/role/${Staff}`);
      return response.data.count;
    } catch (error) {
      console.error('Failed to fetch total staff:', error);
      throw new Error("Failed to retrieve total customers.");
    }
  },
 
  getTotalManagers: async (Managers) => {
    try {
      const response = await axios.get(`/users/role/${Managers}`);
      return response.data.count;
    } catch (error) {
      console.error('Failed to fetch total managers:', error);
      throw new Error("Failed to retrieve total customers.");
    }
  }
  
  
};

export default RoleAPI;
