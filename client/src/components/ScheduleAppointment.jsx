import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, CheckCircle } from "lucide-react";

const ScheduleAppointment = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      setIsConfirmed(true);
    }
  };

  if (isConfirmed) {
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
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center">
              <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900 mb-2">Done!</h2>
              <p className="text-gray-600 mb-8">
                Your appointment is confirmed! Please be ready.
              </p>

              <div className="bg-gray-50 p-6 rounded-2xl mb-8">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">
                  Appointment Details
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Date:</strong> {selectedDate}
                  </p>
                  <p className="text-gray-700">
                    <strong>Time:</strong> {selectedTime}
                  </p>
                  <p className="text-gray-700">
                    <strong>Meeting Link:</strong> Will be sent 30 minutes before
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  to="/my-appointments"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all"
                >
                  Go to my appointments
                  <ArrowRight className="inline-block ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
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
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-900 mb-8">
            Choose your appointment
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-4">
                Select Date
              </h3>
              <input
                type="date"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-4">
                Select Time
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedTime === time
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime}
              className="w-full group flex items-center justify-center bg-gradient-to-r from-blue-600 to-red-600 text-white py-4 px-8 rounded-full text-lg font-medium transition-all transform hover:scale-102 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm and book appointment
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAppointment;
