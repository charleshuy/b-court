import apiClient from "./apiClient";

const OrderAPI = {
  getOrders: async () => {
    try {
      const response = await apiClient.get("/orders"); // Ensure you're using the correct method and endpoint
      return response.data.content; // Return the content array
    } catch (error) {
      console.error("Can't fetch orders:", error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post("/orders", orderData);
      return response.data; // Return the created order data
    } catch (error) {
      console.error("Can't create order:", error);
      throw error;
    }
  },
};

export default OrderAPI;
