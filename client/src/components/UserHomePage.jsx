// UserHomePage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CreditCard, Car, Home } from "lucide-react";
import HomeRecommendation from "./HomeRecoomendation";

function UserHomePage() {
  // Fetch user name from AuthContext instead of hardcoding
  const { user, logout } = useAuth();
  const username = user?.fullName || "User";
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "glass-effect shadow-lg" : "bg-blue-50"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="transform hover:scale-105 transition-transform">
            <span className="text-2xl sm:text-3xl font-bold text-gradient">
              UBI भरोसा
            </span>
          </div>
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
            >
              Home
            </Link>
            <Link
              to="/my-tickets"
              className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
            >
              My Ticket History
            </Link>
            <Link
              to="/my-appointments"
              className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
            >
              My Appointments
            </Link>
            <button
              onClick={handleLogout}
              className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-8 leading-tight">
            Hello, {username}!
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-12">
            What would you like to do today?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/raise-query"
              className="group flex items-center px-6 md:px-8 py-3 md:py-4 text-white bg-gradient-to-r from-blue-600 to-red-600 rounded-full hover:shadow-2xl transition-all hover:scale-105 transform"
            >
              Raise a Query
            </Link>
            <Link
              to="/my-appointments"
              className="group flex items-center px-6 md:px-8 py-3 md:py-4 text-white bg-gradient-to-r from-blue-600 to-red-600 rounded-full hover:shadow-2xl transition-all hover:scale-105 transform"
            >
              View Upcoming Appointments
            </Link>
            <Link
              to="/feedback"
              className="group flex items-center px-6 md:px-8 py-3 md:py-4 text-white bg-gradient-to-r from-blue-600 to-red-600 rounded-full hover:shadow-2xl transition-all hover:scale-105 transform"
            >
              Give Feedback
            </Link>
          </div>
        </div>
        <section className="mt-20">
          <div className="container mx-auto px-6">
            <HomeRecommendation/>
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserHomePage;
