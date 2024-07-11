import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import WalletAPI from "../api/WalletAPI";

const WalletComponent = () => {
  const token = localStorage.getItem("token");
  let userId;

  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.userId; // Adjust this according to your token's structure
    console.log(userId);
  } else {
    console.error("Token not found");
    return <div>Error: Token not found</div>;
  }

  const [amount, setAmount] = useState(10000); // Example default amount
  const orderInfo = `${userId}`;

  const handleDeposit = async () => {
    try {
      const response = await WalletAPI.deposit(userId, amount, orderInfo);
      if (response.status === 200) {
        // Extract the VNPay URL from the response data
        const vnpayUrl = response.data;

        // Redirect to VNPay URL
        window.location.href = vnpayUrl;
      }
    } catch (error) {
      console.error("Error initiating deposit:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Deposit to Your Wallet</h2>
      <form className="space-y-4">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount (VND)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <button
            type="button"
            onClick={handleDeposit}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Deposit
          </button>
        </div>
      </form>
    </div>
  );
};

export default WalletComponent;
