import React, { useState } from "react";
import { LogIn, UserPlus, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

function NavBar({
  isScrolled,
  onScrollToHero,
  onScrollToFeatures,
  onScrollToAppointment,
  onScrollToFAQ,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (callback) => {
    callback();
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-effect shadow-lg" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand Name */}
          <div className="transform hover:scale-105 transition-transform">
            <span className="text-2xl sm:text-3xl font-bold text-gradient">
              UBI भरोसा
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => handleNavClick(onScrollToHero)}
                className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick(onScrollToFeatures)}
                className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
              >
                Features
              </button>
              <button
                onClick={() => handleNavClick(onScrollToAppointment)}
                className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
              >
                Appointment
              </button>
              <button
                onClick={() => handleNavClick(onScrollToFAQ)}
                className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
              >
                FAQ
              </button>
            </div>
            {/* Desktop Auth Buttons */}
            <div className="flex items-center space-x-2 ml-6">
              <Link
                to="/login"
                className="relative overflow-hidden flex items-center px-6 py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
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
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-red-600"
                />
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => handleNavClick(onScrollToHero)}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-blue-900 hover:text-red-600 hover:bg-gray-50 rounded-md"
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavClick(onScrollToFeatures)}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-blue-900 hover:text-red-600 hover:bg-gray-50 rounded-md"
                >
                  Features
                </button>
                <button
                  onClick={() => handleNavClick(onScrollToAppointment)}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-blue-900 hover:text-red-600 hover:bg-gray-50 rounded-md"
                >
                  Appointment
                </button>
                <button
                  onClick={() => handleNavClick(onScrollToFAQ)}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-blue-900 hover:text-red-600 hover:bg-gray-50 rounded-md"
                >
                  FAQ
                </button>
              </div>
              <div className="px-2 pt-2 pb-3 space-y-2">
                <Link
                  to="/login"
                  className="block w-full text-center px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center justify-center">
                    <LogIn className="h-5 w-5 mr-2" />
                    Login
                  </div>
                </Link>
                <Link
                  to="/signup"
                  className="block w-full text-center px-3 py-2 text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center justify-center">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Sign Up
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default NavBar;
