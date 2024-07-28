// /src/api/CourtAPI.jsx
import apiClient from "./apiClient";
import axios from 'axios';

const CourtAPI = {
  getCourts: async (
    page = 0,
    size = 8,
    sortBy = "price",
    sortOrder = "desc"
  ) => {
    try {
      const response = await apiClient.get(
        `/courts?page=${page}&size=${size}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      return response.data;
    } catch (error) {
      console.error("Can't fetch courts:", error);
      throw error;
    }
  },

  getCourtsAdmin: async () => {
    try {
      const response = await apiClient.get("/courts/manage"); // Ensure you're using the correct method and endpoint
      return response.data.content; // Return the content array
    } catch (error) {
      console.error("Can't fetch courts:", error);
      throw error;
    }
  },
  getCourtsByUserId: async (userId, page = 0, size = 100) => {
    try {
      const response = await apiClient.get(
        `/courts/user/${userId}?page=${page}&size=${size}`
      );
      return response.data.content;
    } catch (error) {
      console.error(`Can't fetch courts for user ${userId}:`, error);
      throw error;
    }
  },

  searchCourtsByName: async (courtName, page = 0, size = 10) => {
    try {
      const response = await apiClient.get(
        `/courts/search?courtName=${courtName}&page=${page}&size=${size}`
      );
      return response.data.content;
    } catch (error) {
      console.error(`Can't search courts by name ${courtName}:`, error);
      throw error;
    }
  },

  createCourt: async (courtData) => {
    try {
      const response = await apiClient.post("/courts", courtData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Validation error
        const errorMessage = error.response.data; // Expecting a single error message
        console.error("Validation error:", errorMessage);
        throw new Error(errorMessage); // Throw the single error message
      } else {
        // Other errors
        console.error(`Can't update court ${courtId}:`, error);
        throw error;
      }
    }
  },

  updateCourt: async (courtId, updatedCourt) => {
    try {
      const response = await apiClient.put(
        `/courts/update/${courtId}`,
        updatedCourt
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Validation error
        const errorMessage = error.response.data; // Expecting a single error message
        console.error("Validation error:", errorMessage);
        throw new Error(errorMessage); // Throw the single error message
      } else {
        // Other errors
        console.error(`Can't update court ${courtId}:`, error);
        throw error;
      }
    }
  },

  deleteCourt: async (courtId) => {
    const response = await apiClient.delete(`/courts/delete/${courtId}`);
    return response.data;
  },
  getCourtById: async (courtId) => {
    try {
      const response = await apiClient.get(`/courts/${courtId}`);
      return response.data;
    } catch (error) {
      console.error(`Can't fetch court with ID ${courtId}:`, error);
      throw error;
    }
  },

   getTotalAccounts: async (courtId) => {
    try {
      const response = await axios.get(`/api/accounts/total?courtId=${courtId}`);
      return response.data.totalAccounts;
    } catch (error) {
      console.error('Error fetching total accounts:', error);
      throw error; // Re-throw the error to be handled by the calling function
    }
  },
};

export default CourtAPI;
