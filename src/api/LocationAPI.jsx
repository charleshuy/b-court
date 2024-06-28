import apiClient from "./apiClient";

const LocationAPI = {
  getAllCities: async () => {
    try {
      const response = await apiClient.get("/cities");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      throw error;
    }
  },

  getAllDistricts: async () => {
    try {
      const response = await apiClient.get("/districts");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch districts:", error);
      throw error;
    }
  },

  getDistrictsByCityId: async (cityId) => {
    try {
      const response = await apiClient.get(`/districts/${cityId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch districts for city ID ${cityId}:`, error);
      throw error;
    }
  },
};

export default LocationAPI;
