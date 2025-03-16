import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Video,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const Appointments = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Load appointments from localStorage
    const savedAppointments = localStorage.getItem("userAppointments");
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    return time;
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return (
          <span className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            <Clock className="h-4 w-4 mr-1" />
            Upcoming
          </span>
        );
      case "completed":
        return (
          <span className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900">
              My Appointments
            </h1>
            <Link
              to="/raise-query"
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all transform hover:scale-105"
            >
              New Query
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                <p className="text-gray-600 text-lg mb-4">
                  No appointments found
                </p>
                <Link
                  to="/raise-query"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  Raise a query to book an appointment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ) : (
              appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        {appointment.type === "instant" ? (
                          <Clock className="h-6 w-6 text-blue-600" />
                        ) : (
                          <Calendar className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900">
                          {appointment.type === "instant"
                            ? "Instant Consultation"
                            : "Scheduled Appointment"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {appointment.queryTicket &&
                            `Related to ticket: ${appointment.queryTicket}`}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Date</p>
                      <p className="text-gray-900">
                        {formatDate(appointment.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Time</p>
                      <p className="text-gray-900">
                        {formatTime(appointment.time)}
                      </p>
                    </div>
                  </div>

                  {appointment.status === "upcoming" && (
                    <div className="flex space-x-4">
                      {appointment.meetLink ? (
                        <a
                          href={appointment.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Meeting
                        </a>
                      ) : (
                        <p className="text-sm text-gray-600">
                          Meeting link will be available 30 minutes before the
                          appointment
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
