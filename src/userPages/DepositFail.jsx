import React from "react";

const FailPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
      <div className="bg-white p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Deposit Failed</h1>
        <p className="text-lg text-gray-800 mb-4">
          Oops! Something went wrong while processing your deposit.
        </p>
        <p className="text-gray-600">
          Please try again later or contact support.
        </p>
      </div>
    </div>
  );
};

export default FailPage;
