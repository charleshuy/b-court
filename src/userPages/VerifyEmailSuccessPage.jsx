import React from "react";

const VerifyEmailSuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Email Verified Successfully
        </h1>
        <p className="text-lg text-gray-800 mb-4">
          Your email has been successfully verified.
        </p>
        <p className="text-gray-600">
          Thank you for confirming your email address!
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailSuccessPage;
