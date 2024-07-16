import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import WalletAPI from "../api/WalletAPI";

const PaymentReturn = () => {
  const location = useLocation();

  useEffect(() => {
    const handlePaymentReturn = async () => {
      const params = new URLSearchParams(location.search);
      try {
        const response = await WalletAPI.paymentReturn(params);
        if (response.status === 200) {
          console.log("Payment return handled successfully:", response.data);
        }
      } catch (error) {
        console.error("Error handling payment return:", error);
      }
    };

    handlePaymentReturn();
  }, [location]);

  return (
    <div>
      <h1>Payment Return</h1>
      {/* Add any UI or messages you want to show the user */}
    </div>
  );
};

export default PaymentReturn;
