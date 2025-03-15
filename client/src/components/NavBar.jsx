import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function NavBar({
  isScrolled,
  onScrollToHero,
  onScrollToFeatures,
  onScrollToAppointment,
  onScrollToFAQ,
}) {
  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glass-effect shadow-lg' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand Name with "Bharosa" in Hindi */}
        <div className="transform hover:scale-105 transition-transform">
          <span className="text-3xl font-bold text-gradient">UBI भरोसा</span>
        </div>
        <div className="flex items-center">
          <div className="flex items-center space-x-6">
            {/* NEW: Home button */}
            <button
              onClick={onScrollToHero}
              className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
            >
              Home
            </button>

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
          {/* Auth Buttons with route-based navigation */}
          <div className="flex items-center space-x-2 ml-6">
            <Link
              to="/login"
              className="relative overflow-hidden flex items-center px-6 py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Login
              <motion.div
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-red-600"
              />
            </Link>
            <Link
              to="/signup"
              className="relative overflow-hidden flex items-center px-6 py-3 text-white bg-red-600 rounded-full hover:bg-red-700 transition-all"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Sign Up
              <motion.div
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-red-600"
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
