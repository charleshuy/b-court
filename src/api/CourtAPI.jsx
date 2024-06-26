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
};

export default CourtAPI;
