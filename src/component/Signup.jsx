import { useState } from "react";
import { Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import UserAPI from "/src/api/UserAPI";

const Signup = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    // Log form data
    console.log("Form data:", userData);

    // Validate phone number
    if (userData.phone.length !== 10 || isNaN(userData.phone)) {
      message.error("Phone number must be 10 digits.");
      return;
    }

    try {
      await UserAPI.register(userData);
      message.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      message.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-8">Sign up</h1>
        <Input
          name="name"
          placeholder="Name"
          prefix={<UserOutlined />}
          className="mb-4 w-1/3 rounded-full"
          value={userData.name}
          onChange={handleChange}
        />
        <Input
          name="email"
          placeholder="Email"
          prefix={<MailOutlined />}
          className="mb-4 w-1/3 rounded-full"
          value={userData.email}
          onChange={handleChange}
        />
        <Input
          name="phone"
          placeholder="Phone Number"
          prefix={<PhoneOutlined />}
          className="mb-4 w-1/3 rounded-full"
          value={userData.phone}
          onChange={handleChange}
        />
        <Input
          name="address"
          placeholder="Address"
          prefix={<HomeOutlined />}
          className="mb-4 w-1/3 rounded-full"
          value={userData.address}
          onChange={handleChange}
        />
        <Input.Password
          name="password"
          placeholder="Password"
          prefix={<LockOutlined />}
          className="mb-4 w-1/3 rounded-full"
          value={userData.password}
          onChange={handleChange}
        />
        <button
          onClick={handleSubmit}
          className="bg-lime-500 hover:bg-amber-500 text-white px-8 py-4 h-10 flex items-center justify-center w-1/3 h-8 rounded-full"
        >
          Sign Up
        </button>
      </div>
      <div className="flex-1 bg-gradient-to-r from-yellow-500 to-green-400 text-white flex flex-col justify-center items-center relative rounded-es-full">
        <div className="flex flex-col items-center absolute top-20 right-20 text-right">
          <h1 className="text-4xl font-bold mb-4">One of us?</h1>
          <p className="mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
            laboriosam ad deleniti.
          </p>
          <Link
            to="/login"
            className="bg-white text-green-400 px-4 py-2 rounded-full flex items-center justify-center"
          >
            Sign in
          </Link>
        </div>
        <img
          src="src/assets/images/bad4-modified.png"
          alt="Badminton Player"
          className="absolute bottom-0 right-50 w-1/2"
        />
      </div>
    </div>
  );
};

export default Signup;
