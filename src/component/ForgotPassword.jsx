import { useState } from "react";
import { Input, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import UserAPI from "../api/UserAPI";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    try {
      await UserAPI.forgotPassword({ email });
      message.success("Password reset email sent successfully!");
    } catch (error) {
      message.error("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('src/assets/images/Big2.jpg')" }}
    >
      <h1 className="text-3xl font-bold mb-8 text-white outline-offset-2 outline-amber-500">Forgot Password</h1>
      <Input
        placeholder="Enter your email"
        prefix={<MailOutlined />}
        className="mb-4 w-1/5 rounded-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="bg-lime-500 hover:bg-amber-500 text-white px-8 py-4 h-10 flex items-center justify-center w-1/5 h-8 rounded-full"
        onClick={handleForgotPassword}
      >
        Submit
      </button>
    </div>
  );
};

export default ForgotPassword;
