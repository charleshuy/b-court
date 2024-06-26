// /src/api/CourtAPI.jsx
import apiClient from "./apiClient";

const CourtAPI = {
  getCourts: async () => {
    try {
      const response = await apiClient.get("/courts"); // Ensure you're using the correct method and endpoint
      return response.data.content; // Return the content array
    } catch (error) {
      console.error("Can't fetch courts:", error);
      throw error;
    }
  },
  getCourtsByUserId: async (userId, page = 0, size = 10) => {
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
      console.error("Can't create court:", error);
      throw error;
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
      console.error(`Can't update court ${courtId}:`, error);
      throw error;
    }
  },
};

export default CourtAPI;
