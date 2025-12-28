import React from "react";
import { Box, Monitor, Wrench } from "lucide-react";
import Login from "./Login";
import Signup from "./Signup";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background Circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-70" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-70" />

      {/* Header */}
      <header className="relative z-10 flex items-center gap-4 px-12 py-6">
        <img
          src="/logo.jpeg"
          alt="College Logo"
          className="w-14 h-14 object-contain"
        />
        <div>
          <h1 className="text-sm font-semibold tracking-wide text-gray-900">
            DATTA MEGHE COLLEGE OF ENGINEERING, AIROLI
          </h1>
          <span className="text-xs font-medium text-gray-600">
            COMPUTER DEPARTMENT
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center px-12 py-16 gap-10">
        {/* Left */}
        <div>
          <h1 className="text-4xl xl:text-5xl font-extrabold text-blue-700 leading-tight">
            INVENTORY <br /> MANAGEMENT
          </h1>

          <p className="mt-6 max-w-xl text-sm text-gray-600 leading-relaxed font-medium">
            MANAGE, TRACK, AND MONITOR COLLEGE ASSETS EFFICIENTLY IN ONE
            CENTRALIZED SYSTEM
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/login"
              className="px-6 py-2.5 text-sm font-semibold rounded-md bg-blue-700 text-white hover:bg-blue-800 transition"
            >
              Login
            </Link>
            <Link
              className="px-6 py-2.5 text-sm font-semibold rounded-md border border-blue-700 text-blue-700 hover:bg-blue-50 transition"
              to="/signup"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="flex justify-center lg:justify-end">
          <img
            src="/inventory-illustration.png"
            alt="Inventory Illustration"
            className="w-full max-w-md"
          />
        </div>
      </section>

      {/* Key Features */}
      <section className="relative z-10 px-12 py-14">
        <h2 className="text-center text-lg font-bold tracking-wide text-gray-900 mb-12">
          KEY FEATURES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-blue-100">
              <Monitor className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Real-time Tracking
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Monitor all lab equipment status in real time with instant updates
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-green-100">
              <Wrench className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Repair Management
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Streamline repair requests and track maintenance history
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-purple-100">
              <Box className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Stock Control
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Manage inventory levels and generate purchase requests
              automatically
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-center py-4">
        <p className="text-xs text-gray-300 font-medium">
          © 2025 Datta Meghe College of Engineering | Computer Department |
          Privacy Policy | Contact Us
        </p>
      </footer>
    </div>
  );
};

export default Home;
