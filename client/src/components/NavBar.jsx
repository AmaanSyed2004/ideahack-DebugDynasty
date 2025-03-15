import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// A reusable auth button component using Framer Motion for an underline animation
function AuthButton({ to, icon: Icon, children, bgColor, hoverBgColor }) {
  return (
    <Link
      to={to}
      className={`relative overflow-hidden flex items-center px-6 py-3 text-white rounded-full transition-all transform ${bgColor} ${hoverBgColor}`}
    >
      <div className="relative z-10 flex items-center">
        {Icon && <Icon className="h-5 w-5 mr-2" />}
        {children}
      </div>
      <motion.div
        initial={{ width: 0 }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-red-600"
      />
    </Link>
  );
}

function NavBar({ isScrolled, onScrollToFeatures, onScrollToAppointment, onScrollToFAQ }) {
  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-effect shadow-lg" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand Name with "Bharosa" in Hindi */}
        <div className="transform hover:scale-105 transition-transform">
          <span className="text-3xl font-bold text-gradient">UBI भरोसा</span>
        </div>
        <div className="flex items-center">
          <div className="flex items-center space-x-6">
            <button
              onClick={onScrollToFeatures}
              className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
            >
              Features
            </button>
            <button
              onClick={onScrollToAppointment}
              className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
            >
              Appointment
            </button>
            <button
              onClick={onScrollToFAQ}
              className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
            >
              FAQ
            </button>
          </div>
          {/* Auth Buttons with reduced spacing */}
          <div className="flex items-center space-x-2 ml-6">
            <AuthButton
              to="/login"
              icon={LogIn}
              bgColor="bg-blue-600"
              hoverBgColor="hover:bg-blue-700"
            >
              Login
            </AuthButton>
            <AuthButton
              to="/signup"
              icon={UserPlus}
              bgColor="bg-red-600"
              hoverBgColor="hover:bg-red-700"
            >
              Sign Up
            </AuthButton>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
