import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Star,
  MessageSquare,
  Send,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

const Feedback = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save feedback to localStorage for demo purposes
    const feedback = {
      id: Date.now(),
      rating,
      comment,
      timestamp: new Date().toISOString(),
    };

    const existingFeedback = JSON.parse(
      localStorage.getItem("userFeedback") || "[]"
    );
    localStorage.setItem(
      "userFeedback",
      JSON.stringify([...existingFeedback, feedback])
    );

    setIsSubmitted(true);
  };

  if (isSubmitted) {
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
                to="/my-queries"
                className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
              >
                My Queries
              </Link>
              <Link
                to="/my-appointments"
                className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
              >
                My Appointments
              </Link>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
              Thank You for Your Feedback!
            </h2>
            <p className="text-gray-600 mb-8">
              Your feedback helps us improve our services.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              to="/my-queries"
              className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
            >
              My Queries
            </Link>
            <Link
              to="/my-appointments"
              className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
            >
              My Appointments
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-blue-900 mb-8">
              Share Your Experience
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-lg font-medium text-blue-900 mb-4">
                  How would you rate your experience?
                </label>
                <div className="flex items-center justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className="p-2 transition-all transform hover:scale-110"
                      onMouseEnter={() => setHoveredRating(value)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(value)}
                    >
                      <Star
                        className={`h-8 w-8 ${
                          value <= (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-blue-900 mb-4">
                  Tell us more about your experience
                </label>
                <div className="relative">
                  <MessageSquare className="absolute top-3 left-3 h-6 w-6 text-gray-400" />
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full h-32 pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
                    placeholder="Your feedback helps us improve..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!rating}
                className="w-full group flex items-center justify-center bg-gradient-to-r from-blue-600 to-red-600 text-white py-4 px-8 rounded-full text-lg font-medium transition-all transform hover:scale-102 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Feedback
                <Send className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
