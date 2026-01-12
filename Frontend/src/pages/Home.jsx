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
      {/* <header className="relative z-10 flex items-center gap-4 px-12 py-6">
        <img
          src="/dmce.png"
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
      </header> */}

      {/* <header className="relative z-10 h-[140px] px-12 pt-6"> */}
        {/* Logo – top left */}
        {/* <img
          src="/dmce.png"
          alt="College Logo"
          className="absolute left-12 top-6 w-24 h-24 object-contain"
        /> */}
        
        {/* Centered text */}
        {/* <div className="text-center">
          <h1 className="font-jomhuria text-[75px] leading-none text-[#090F31]">
            DATTA MEGHE COLLEGE OF ENGINEERING, AIROLI
          </h1>
          <h2 className="font-jomhuria text-[64px] leading-none text-[#090F31]">
            COMPUTER DEPARTMENT
          </h2>
        </div>
      </header> */}

      <header className="relative z-10 px-6 pt-6 pb-10">
  <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">

    {/* Logo */}
    <img
      src="/dmce.png"
      alt="College Logo"
      className="w-20 h-20 object-contain"
    />

    {/* Text */}
    <h1 className="font-jomhuria text-center text-4xl md:text-6xl text-[#090F31] leading-tight">
      DATTA MEGHE COLLEGE OF ENGINEERING, AIROLI
    </h1>

    <h2 className="font-jomhuria text-center text-3xl md:text-5xl text-[#090F31] leading-tight">
      COMPUTER DEPARTMENT
    </h2>

  </div>
</header>

      {/* Hero Section */}
      {/* <section className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center px-12 py-16 gap-10"> */}
        {/* Left */}
        {/* <div>
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
        </div> */}

        {/* Right */}
        {/* <div className="flex justify-center lg:justify-end">
          <img
            src="/inventory-illustration.png"
            alt="Inventory Illustration"
            className="w-full max-w-md"
          />
        </div>
      </section> */}

      {/* Hero Section */}
{/* <section className="relative z-10 w-full mt-2"> */}
  {/* Canvas wrapper */}
  {/* <div className="relative mx-auto w-[1280px] h-[600px]"> */}
    
    {/* Hero Image (right aligned) */}
    {/* <img
      src="/inventory-illustration.png"
      alt="Inventory Illustration"
      className="absolute right-0 top-0 h-full object-contain"
    /> */}

    {/* Text Overlay */}
    {/* <div className="absolute top-[140px] left-[80px] max-w-md">
      <h1 className="font-jomhuria text-[96px] leading-none text-blue-700">
        INVENTORY <br /> MANAGEMENT
      </h1> */}

      {/* <p className="mt-4 font-jomhuria text-[30px] text-blue-600 leading-tight">
        MANAGE, TRACK, AND MONITOR COLLEGE ASSETS
        <br />
        EFFICIENTLY IN ONE CENTRALIZED SYSTEM.
      </p>

      <div className="mt-6 flex gap-4">
        <Link
          to="/login"
          className="px-8 py-3 rounded-full bg-blue-700 text-white font-semibold"
        >
          Login
        </Link>

        <Link
          to="/signup"
          className="px-8 py-3 rounded-full bg-blue-700 text-white font-semibold"
        >
          Sign up
        </Link>
      </div>
    </div>

  </div>
</section> */}

<section className="relative z-10 mt-6 md:mt-12 px-6">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-start gap-12">

    {/* Text */}
    <div className="text-center md:text-left">
      <h1 className="font-jomhuria text-5xl md:text-7xl text-blue-700 leading-none">
        INVENTORY <br /> MANAGEMENT
      </h1>

      <p className="mt-4 font-jomhuria text-lg sm:text-xl md:text-[30px] text-blue-600 leading-tight">
        MANAGE, TRACK, AND MONITOR COLLEGE ASSETS
        <br />
        EFFICIENTLY IN ONE CENTRALIZED SYSTEM.
      </p>

      <div className="mt-6 flex justify-center md:justify-start gap-4">
        <Link
          to="/login"
          className="px-6 py-3 rounded-full bg-blue-700 text-white font-semibold"
        >
          Login
        </Link>

        <Link
          to="/signup"
          className="px-6 py-3 rounded-full bg-blue-700 text-white font-semibold"
        >
          Sign up
        </Link>
      </div>
    </div>

    {/* Image */}
    <div className="flex justify-center">
      <img
        src="/inventory-illustration.png"
        alt="Inventory Illustration"
        className="w-full max-w-md md:max-w-xl object-contain"
      />
    </div>

  </div>
</section>


      {/* Key Features */}
      {/* <section className="relative z-10 px-12 py-14">
        <h2 className="text-center text-lg font-bold tracking-wide text-gray-900 mb-12">
          KEY FEATURES
        </h2> */}

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto"> */}
          {/* Feature 1 */}
          {/* <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-blue-100">
              <Monitor className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Real-time Tracking
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Monitor all lab equipment status in real time with instant updates
            </p>
          </div> */}

          {/* Feature 2 */}
          {/* <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-green-100">
              <Wrench className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Repair Management
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Streamline repair requests and track maintenance history
            </p>
          </div> */}

          {/* Feature 3 */}
          {/* <div className="text-center">
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
      </section> */}

{/* Key Features Section */}
<section className="relative z-10 py-16 md:py-12 px-4">
  <h2 className="text-center font-crimson text-3xl sm:text-4xl md:text-[40px] text-[#070363] mb-12 md:mb-10">
    KEY FEATURES
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">

    {/* Feature Card */}
    {[
      {
        icon: <Monitor className="w-12 h-12 text-blue-600" />,
        title: "Real-time Tracking",
        text: "Monitor all lab equipment status in real time with instant updates",
        bg: "bg-blue-100",
      },
      {
        icon: <Wrench className="w-12 h-12 text-green-600" />,
        title: "Repair Management",
        text: "Streamline repair requests and track maintenance history",
        bg: "bg-green-100",
      },
      {
        icon: <Box className="w-12 h-12 text-purple-600" />,
        title: "Stock Control",
        text: "Manage inventory levels and generate purchase requests automatically",
        bg: "bg-purple-100",
      },
    ].map((f, i) => (
      <div key={i} className="flex flex-col items-center text-center">
        <div className={`w-24 h-24 flex items-center justify-center rounded-full ${f.bg} mb-6`}>
          {f.icon}
        </div>

        <h3 className="font-calistoga text-2xl mb-4">
          {f.title}
        </h3>

        <p className="font-inter text-lg opacity-85 max-w-sm">
          {f.text}
        </p>
      </div>
    ))}

  </div>
</section>


      {/* Footer */}
      {/* <footer className="bg-black text-center py-4">
        <p className="text-xs text-gray-300 font-medium">
          © 2025 Datta Meghe College of Engineering | Computer Department |
          Privacy Policy | Contact Us
        </p>
      </footer> */}
      <footer className="bg-black py-6 px-4">
  <p className="font-crimson text-sm sm:text-lg md:text-[24px] text-white text-center">
    © 2025 Datta Meghe College of Engineering | Computer Department | Privacy Policy | Contact Us
  </p>
</footer>
    </div>
  );
};  

export default Home;
