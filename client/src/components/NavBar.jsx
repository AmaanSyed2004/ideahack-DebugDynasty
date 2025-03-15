import React from 'react';
import { Shield, LogIn, UserPlus, HelpCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

function NavBar({ isScrolled, onScrollToFeatures, onScrollToQuery, onScrollToAppointment }) {
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-effect shadow-lg' : 'bg-white'}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center transform hover:scale-105 transition-transform">
            <Shield className="h-10 w-10 text-red-600 animate-pulse-slow" />
            <span className="ml-2 text-3xl font-bold text-gradient">UBI Bharosa</span>
          </div>
          <div className="flex items-center space-x-8">
            <button
              onClick={onScrollToFeatures}
              className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
            >
              Features
            </button>
            <button
              onClick={onScrollToQuery}
              className="nav-link text-blue-900 hover:text-red-600 transition-colors flex items-center text-lg"
            >
              <HelpCircle className="h-5 w-5 mr-1" />
              Query Resolution
            </button>
            <button
              onClick={onScrollToAppointment}
              className="nav-link text-blue-900 hover:text-red-600 transition-colors flex items-center text-lg"
            >
              <Calendar className="h-5 w-5 mr-1" />
              Schedule
            </button>
            <Link
              to="/login"
              className="flex items-center px-6 py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all hover:shadow-lg hover:scale-105 transform"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Login
            </Link>
            <Link
              to="/signup"
              className="flex items-center px-6 py-3 text-white bg-red-600 rounded-full hover:bg-red-700 transition-all hover:shadow-lg hover:scale-105 transform"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
