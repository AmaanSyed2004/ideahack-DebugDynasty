import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Video, MessageSquare, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const EmployeeAppointments = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const appointments = [
    {
      id: 1,
      customerName: "test pratham",
      time: "10:00 AM",
      date: "2025-03-20",
      type: "Video Call",
      status: "Upcoming",
      meetLink: "https://meet.ubi.com/xyz123",
      queryDetails: "Account services discussion",
      recommendations: [
        "Review account statement",
        "Prepare KYC documents",
        "Check credit score",
        "Recent transaction history",
      ],
    },
    {
      id: 2,
      customerName: "test varnika",
      time: "11:30 AM",
      date: "2025-03-20",
      type: "Instant Query",
      status: "Upcoming",
      meetLink: "https://meet.ubi.com/abc456",
      queryDetails: "Loan application review",
      recommendations: [
        "Income documents verification",
        "Property valuation report",
        "EMI calculator discussion",
        "Loan terms explanation",
      ],
    },
    {
      id: 3,
      customerName: "test amaan",
      time: "2:00 PM",
      date: "2025-03-20",
      type: "Video Call",
      status: "Upcoming",
      meetLink: "https://meet.ubi.com/def789",
      queryDetails: "Investment portfolio discussion",
      recommendations: [
        "Risk assessment review",
        "Portfolio diversification options",
        "Market analysis presentation",
        "Investment strategy planning",
      ],
    },
    {
      id: 4,
      customerName: "test keshav",
      time: "3:30 PM",
      date: "2025-03-20",
      type: "Instant Query",
      status: "Upcoming",
      meetLink: "https://meet.ubi.com/ghi012",
      queryDetails: "Credit card services",
      recommendations: [
        "Card benefits overview",
        "Security features explanation",
        "Reward points system",
        "International usage guidelines",
      ],
    },
  ];

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
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/employee/dashboard"
              className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg font-medium"
            >
              Home
            </Link>
            <Link
              to="/employee/live-queries"
              className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg font-medium"
            >
              Live Queries
            </Link>
            <Link
              to="/employee/appointments"
              className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg font-medium"
            >
              Appointments
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-3xl font-bold text-gradient mb-8">
          My Appointments
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                onClick={() => setSelectedAppointment(appointment)}
                className={`cursor-pointer bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all ${
                  selectedAppointment?.id === appointment.id
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {appointment.type === "Video Call" ? (
                      <Video className="h-5 w-5 text-blue-600" />
                    ) : (
                      <MessageSquare className="h-5 w-5 text-green-600" />
                    )}
                    <span className="font-medium text-gray-900">
                      {appointment.type}
                    </span>
                  </div>
                  <span className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    {appointment.time}
                  </span>
                </div>
                <h3 className="font-medium text-blue-900 mb-2">
                  {appointment.customerName}
                </h3>
                <p className="text-gray-600 text-sm">
                  {appointment.queryDetails}
                </p>
              </div>
            ))}
          </div>

          {selectedAppointment ? (
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-blue-900">
                  Appointment Details
                </h2>
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-1" />
                  {selectedAppointment.status}
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name
                  </label>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-blue-900">
                      {selectedAppointment.customerName}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date & Time
                  </label>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-blue-900">
                      {selectedAppointment.date} at {selectedAppointment.time}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meet Link
                  </label>
                  <input
                    type="text"
                    value={selectedAppointment.meetLink}
                    readOnly
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personal Recommendations
                  </label>
                  <div className="space-y-2">
                    {selectedAppointment.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg text-gray-700"
                      >
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl hover:shadow-lg transition-all">
                    Start Meeting
                  </button>
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-lg flex items-center justify-center">
              <p className="text-gray-500">
                Select an appointment to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeAppointments;
