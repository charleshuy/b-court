// WalletAPI.js
import apiClient from "./apiClient";

const WalletAPI = {
  deposit: (userId, amount, orderInfo) => {
    const formData = new URLSearchParams();
    formData.append("userId", userId);
    formData.append("amount", amount);
    formData.append("orderInfo", orderInfo);

    return apiClient.post("/wallet/deposit", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },

  paymentReturn: (queryParams) => {
    // Extract necessary parameters from queryParams or use a library like query-string
    // For example, extracting vnp_ResponseCode from queryParams:
    const vnp_ResponseCode = queryParams.vnp_ResponseCode;

    // Example logic based on vnp_ResponseCode
    if (vnp_ResponseCode === "00") {
      return "success";
    } else {
      return "failure";
    }
  },
};

export default WalletAPI;
