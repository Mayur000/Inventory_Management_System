import React, { useState, useRef, useEffect } from "react";
import { registerUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import {
  ChevronDown,
  Shield,
  FlaskConical,
  GraduationCap,
  Wrench,
} from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [roleOpen, setRoleOpen] = useState(false);

  const roles = [
    { label: "Admin (HOD)", value: "admin", icon: Shield },
    { label: "Practical Incharge", value: "practicalIncharge", icon: GraduationCap },
    { label: "Lab Incharge", value: "labIncharge", icon: FlaskConical },
    { label: "Lab Assistant", value: "labAssistant", icon: Wrench },
  ];

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setRoleOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaf1ff] relative overflow-hidden">
      {/* Decorative Background Circles */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-400 rounded-full opacity-60" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 rounded-full opacity-50" />

      {/* Main Container */}
      <div className="relative w-[900px] h-[500px] bg-gradient-to-r from-[#bcd3ff] to-[#4f7df3] rounded-[28px] shadow-xl flex overflow-hidden">
        {/* Left Illustration */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src="/signup-banner.png"
            alt="Signup Illustration"
            className="w-[280px]"
          />
        </div>

        {/* Right Signup Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white w-[380px] rounded-[22px] px-8 py-10 shadow-md flex flex-col justify-center"
        >
          <h1 className="text-xl font-semibold text-gray-900 text-center mb-6">
            Create Account
          </h1>

          {/* Custom Role Dropdown */}
          <div className="relative mb-4" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setRoleOpen(!roleOpen)}
              className="w-full flex items-center justify-between px-5 h-11 border border-gray-300 rounded-full text-sm text-gray-600 bg-white hover:border-blue-400"
            >
              <span>
                {form.role
                  ? roles.find((r) => r.value === form.role)?.label
                  : "Select Your Role"}
              </span>
              <ChevronDown size={16} />
            </button>

            {roleOpen && (
              <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <div
                      key={role.value}
                      onClick={() => {
                        setForm({ ...form, role: role.value });
                        setRoleOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                    >
                      <Icon size={16} className="text-blue-600" />
                      {role.label}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Name */}
          <input
            name="name"
            type="text"
            onChange={handleChange}
            required
            placeholder="Name"
            className="mb-3 px-5 h-11 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            onChange={handleChange}
            required
            placeholder="Email"
            className="mb-3 px-5 h-11 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Password */}
          <input
            name="password"
            type="password"
            onChange={handleChange}
            required
            placeholder="Password"
            className="mb-4 px-5 h-11 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Create Account Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white h-11 rounded-full text-sm font-semibold hover:bg-blue-700 transition"
          >
            Create Account
          </button>

          {/* Login Link */}
          <p className="text-xs text-center text-gray-600 mt-4">
            Already have an account?
            <Link
              to="/login"
              className="text-blue-600 hover:underline ml-1"
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
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-full py-2 text-xs font-medium hover:bg-gray-50"
            >
              <img src="/google.jpeg" alt="Google" className="w-4" />
              Sign up with Google
            </button>

            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-full py-2 text-xs font-medium hover:bg-gray-50"
            >
              <img src="/facebook.png" alt="Facebook" className="w-4" />
              Sign up with Facebook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
