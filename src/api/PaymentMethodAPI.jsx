// /src/api/CourtAPI.jsx
import apiClient from "./apiClient";

const PaymentMethodAPI = {
  getPaymentMethods: async () => {
    try {
      const response = await apiClient.get("/payment-methods"); // Ensure you're using the correct method and endpoint
      return response.data.content; // Return the content array
    } catch (error) {
      console.error("Can't fetch methods:", error);
      throw error;
    }
  },
};

export default PaymentMethodAPI;
