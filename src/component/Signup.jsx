import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, message, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import UserAPI from "/src/api/UserAPI";

const Signup = () => {
  const navigate = useNavigate();

  // State to handle messages
  const [messageApi, contextHolder] = message.useMessage();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be 50 characters or less")
        .matches(
          /^[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỳỵỷỹỲỴỶỸ ]+$/,
          "Name can only contain letters and spaces (Accepts Vietnamese names)"
        )
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string()
        .matches(/^\d{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .max(60, "Password must be 60 characters or less")
        .matches(
          /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]+$/,
          "Password contains invalid characters"
        )
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      console.log("Form data:", values);
      setSubmitting(true);
      try {
        const auth = await UserAPI.register(values);
        messageApi.success("Registration successful!");
        navigate("/login");
      } catch (error) {
        messageApi.error(error.message || "Registration failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex h-screen">
      {contextHolder}
      <div className="flex-1 flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-8">Sign up</h1>

        <form onSubmit={formik.handleSubmit} className="w-1/3">
          <Input
            name="name"
            placeholder="Name"
            prefix={<UserOutlined />}
            className={`mb-4 w-full rounded-full ${
              formik.errors.name && formik.touched.name ? "border-red-500" : ""
            }`}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-500 mb-2">{formik.errors.name}</div>
          ) : null}
          <Input
            name="email"
            placeholder="Email"
            prefix={<MailOutlined />}
            className={`mb-4 w-full rounded-full ${
              formik.errors.email && formik.touched.email
                ? "border-red-500"
                : ""
            }`}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 mb-2">{formik.errors.email}</div>
          ) : null}
          <Input
            name="phone"
            placeholder="Phone Number"
            prefix={<PhoneOutlined />}
            className={`mb-4 w-full rounded-full ${
              formik.errors.phone && formik.touched.phone
                ? "border-red-500"
                : ""
            }`}
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.phone && formik.errors.phone ? (
            <div className="text-red-500 mb-2">{formik.errors.phone}</div>
          ) : null}
          <Input.Password
            name="password"
            placeholder="Password"
            prefix={<LockOutlined />}
            className={`mb-4 w-full rounded-full ${
              formik.errors.password && formik.touched.password
                ? "border-red-500"
                : ""
            }`}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 mb-2">{formik.errors.password}</div>
          ) : null}
          <button
            type="submit"
            className="bg-green-400 text-white w-full h-8 rounded-full flex items-center justify-center"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? <Spin /> : "Sign Up"}
          </button>
        </form>

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
