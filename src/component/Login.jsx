import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input, message } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import UserAPI from "../api/UserAPI";
import { jwtDecode } from "jwt-decode";
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { from } = location.state || { from: { pathname: "/" } }; // Get previous location

  const handleLogin = async () => {
    try {
      const credentials = { email, password };
      const response = await UserAPI.login(credentials);

      // Assuming the response contains a token or user data
      localStorage.setItem("token", response.token);
      message.success("Login successful!");
      onLogin(); // Update login status
      // Redirect to previous location after login
      navigate(from);
    } catch (error) {
      message.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-gradient-to-r from-green-500 to-yellow-500 text-white flex flex-col justify-center items-center relative rounded-ee-full">
        <div className="flex flex-col items-center absolute top-20 right-20 text-right">
          <h1 className="text-4xl font-bold mb-4">New here?</h1>
          <p className="mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, ex
            ratione. Aliquid!
          </p>
          {!localStorage.getItem("token") && (
            <Link
              to="/signup"
              className="bg-white text-green-400 px-4 py-2 rounded-full flex items-center justify-center"
            >
              Sign Up
            </Link>
          )}
        </div>
        <img
          src="src/assets/images/bad2-modified.png"
          alt="Badminton Player"
          className="absolute bottom-0 left-50 w-1/2"
        />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-8">Sign in</h1>
        <Input
          placeholder="Username"
          prefix={<UserOutlined />}
          className="mb-4 w-1/3 rounded-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input.Password
          placeholder="Password"
          prefix={<LockOutlined />}
          className="mb-4 w-1/3 rounded-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* <a href="#" className="mb-4 text-green-400">
          Forgot Password?
        </a> */}
        <button
          className="bg-green-400 text-white w-1/3 h-8 rounded-full"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
