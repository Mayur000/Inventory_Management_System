import React, { useState } from "react";
import { registerUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      alert("Signup successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaf1ff]">
      {/* Decorative Shapes */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-400 rounded-full opacity-60" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 rounded-full opacity-50" />

      {/* Main Container */}
      <div className="relative w-225 h-125 bg-linear-to-r from-[#bcd3ff] to-[#4f7df3] rounded-[28px] overflow-hidden shadow-xl flex">
        {/* Left Illustration */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src="/signup-banner.png"
            alt="Signup Illustration"
            className="w-75"
          />
        </div>

        {/* Right Signup Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl w-96 shadow"
        >
          <div className="w-95 bg-white rounded-[22px] m-8 px-8 py-8 flex flex-col">
            <h1 className="text-xl font-semibold text-gray-900 text-center mb-6">
              Create Account
            </h1>

            {/* Role Selector */}
            <select
              name="role"
              onChange={handleChange}
              required
              className="mb-3 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="labAssistant">Lab Assistant</option>
              <option value="labIncharge">Lab Incharge</option>
              <option value="practicalIncharge">Practical Incharge</option>
            </select>

            {/* Name */}
            <input
              name="name"
              type="text"
              onChange={handleChange}
              required
              placeholder="Name"
              className="mb-3 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Email */}
            <input
              name="email"
              type="email"
              onChange={handleChange}
              required
              placeholder="Email"
              className="mb-3 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Password */}
            <input
              name="passwoed"
              type="password"
              onChange={handleChange}
              required
              placeholder="Password"
              className="mb-4 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Create Button */}
            <button className="w-full bg-blue-600 text-white py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition">
              Create Account
            </button>

            {/* Login Link */}
            <p className="text-xs text-center text-gray-600 mt-4">
              Already have an account?
              <Link
                to="/login"
                className="text-blue-600 cursor-pointer hover:underline ml-1"
              >
                Login
              </Link>
            </p>

            {/* OR Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-xs text-gray-500">OR</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Social Signup */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-full py-2 text-xs font-medium hover:bg-gray-50">
                <img src="/google.jpeg" alt="Google" className="w-4" />
                Sign up with Google
              </button>

              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-full py-2 text-xs font-medium hover:bg-gray-50">
                <img src="/facebook.png" alt="Facebook" className="w-4" />
                Sign up with Facebook
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
