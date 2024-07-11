import React from "react";

const SuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Deposit Successful
        </h1>
        <p className="text-lg text-gray-800 mb-4">
          Your deposit has been successfully initiated.
        </p>
        <p className="text-gray-600">Thank you for using our service!</p>
      </div>
    </div>
  );
};

export default SuccessPage;
