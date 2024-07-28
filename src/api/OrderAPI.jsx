import apiClient from "./apiClient";
import axios from 'axios';
const OrderAPI = {
  getOrders: async (page = 0, size = 1000) => {
    try {
      const response = await apiClient.get("/orders", {
        params: { page, size },
      });
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
  getOrdersByCourtId: async (courtId, page = 0, size = 50) => {
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
  refundForEWalletOrder: async (orderId) => {
    try {
      const response = await apiClient.put(`/orders/refund/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Can't process refund for order ${orderId}:`, error);
      throw error;
    }
  },
  
  getTotalAmount: async () => {
    const response = await axios.get('/api/orders/totalAmount');
  return response.data.totalAmount;
  },
};

export default OrderAPI;
