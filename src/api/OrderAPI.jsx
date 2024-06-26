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
  getOrdersByUserId: async (userId, page = 0, size = 10) => {
    try {
      const response = await apiClient.get(`/orders/user/${userId}`, {
        params: { page, size },
      });
      return response.data.content;
    } catch (error) {
      console.error(`Can't fetch orders for user ${userId}:`, error);
      throw error;
    }
  },
  getOrdersByCourtId: async (courtId, page = 0, size = 10) => {
    try {
      const response = await apiClient.get(`/orders/court/${courtId}`, {
        params: { page, size },
      });
      return response.data.content;
    } catch (error) {
      console.error(`Can't fetch orders for court ${courtId}:`, error);
      throw error;
    }
  },

  deleteOrderById: async (orderId) => {
    try {
      await apiClient.delete(`/orders/delete/${orderId}`);
    } catch (error) {
      console.error(`Can't delete order ${orderId}:`, error);
      throw error;
    }
  },

  getOrdersByCourtAndDate: async (
    courtId,
    bookingDate,
    page = 0,
    size = 10
  ) => {
    try {
      const response = await apiClient.get(
        `/orders/court/${courtId}/date/${bookingDate}`,
        {
          params: { page, size },
        }
      );
      return response.data.content;
    } catch (error) {
      console.error(
        `Can't fetch orders for court ${courtId} and date ${bookingDate}:`,
        error
      );
      throw error;
    }
  },
  updateOrder: async (orderId, updatedOrderData) => {
    try {
      const response = await apiClient.put(
        `/orders/${orderId}`,
        updatedOrderData
      );
      return response.data;
    } catch (error) {
      console.error(`Can't update order ${orderId}:`, error);
      throw error;
    }
  },
  cancelOrder: async (orderId, userId) => {
    try {
      const response = await apiClient.put(`/orders/cancel/${orderId}`, null, {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      console.error(`Can't cancel order ${orderId}:`, error);
      throw error;
    }
  },
};

export default OrderAPI;
