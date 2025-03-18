import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTicket } from "../context/TicketContext";
import axios from "axios";
const InstantAppointment = () => {
  const navigate = useNavigate();
  const {
    currentTicket,
    resolveTicket,
    startPolling,
    estimatedTime,
    meetingRoom,
  } = useTicket();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pollingStarted, setPollingStarted] = useState(false);
  const [status, setStatus]= useState(false)
  // Listen to scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Start ticket resolution and polling when currentTicket is available.
  useEffect(() => {
    const check = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/ticket/queue/checkStatus?ticketID=${currentTicket}`,
          { withCredentials: true }
        );
        setStatus(response.data.alloted);
        if (response.data.alloted) {
          clearInterval(interval);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error polling ticket status:", error);
        return false;
      }
    };
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, [currentTicket.ticketId]);
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
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8">
          {isLoading ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                Waiting for response!
              </h2>
              <p className="text-gray-600 mb-8">
                Estimated time:{" "}
                {estimatedTime ? estimatedTime : "Calculating..."}
              </p>
              <div className="flex justify-center mb-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                Thank you for your patience
              </h2>
              <div className="bg-gray-50 p-6 rounded-2xl mb-8">
                <p className="text-lg font-medium text-blue-900 mb-4">
                  Your meeting link is ready:
                </p>
                <a
                  href={"https://meet.google.com/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all"
                >
                  Join Meeting
                  <ArrowRight className="inline-block ml-2 h-5 w-5" />
                </a>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-900">
                  How was your experience?
                </h3>
                <div className="flex justify-center space-x-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-all"
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-8">
                <Link
                  to="/dashboard"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstantAppointment;
