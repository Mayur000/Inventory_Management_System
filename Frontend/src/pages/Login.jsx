import React, { useState } from "react";
import { loginUser } from "../api/authApi";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      login(res.data.data.user);

      // Role based redirect
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaf1ff]">
      {/* Main Card */}
      <div className="relative w-225 h-120 bg-linear-to-r from-[#bcd3ff] to-[#4f7df3] rounded-[28px] overflow-hidden shadow-xl flex">
        {/* Left Login Box */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl w-96 shadow"
        >
          <div className="w-90 bg-white rounded-[22px] m-8 px-8 py-10 flex flex-col">
            <h1 className="text-2xl font-semibold text-blue-600 text-center mb-8">
              Login
            </h1>

            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your Email"
              className="mb-4 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter Password"
              className="mb-6 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button className="w-28 mx-auto bg-blue-600 text-white py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition">
              Login
            </button>

            <div className="flex justify-between mt-6 text-xs text-blue-500">
              <span className="cursor-pointer hover:underline">Help?</span>
              <span className="cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>
          </div>
        </form>

        {/* Right Illustration */}
        <div className="flex-1 flex items-center justify-center relative">
          <img
            src="/login-banner.jpg"
            alt="Login Illustration"
            className="w-[320px]"
          />
        </div>

        {/* Decorative Curves */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-400 rounded-full opacity-60" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 rounded-full opacity-50" />
      </div>
    </div>
  );
};

export default Login;
