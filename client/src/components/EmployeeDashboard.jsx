import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Clock,
  Calendar,
  MessageSquare,
  Video,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function EmployeeDashboard() {
  const employeeName = "Employee Name";
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Dummy data for live queries
  const liveQueries = [
    {
      id: "UBI123456",
      customerName: "John Doe",
      type: "Account Services",
      status: "Waiting",
      time: "10:30 AM",
      priority: "High",
    },
    {
      id: "UBI123457",
      customerName: "Jane Smith",
      type: "Loan Enquiry",
      status: "In Progress",
      time: "10:45 AM",
      priority: "Medium",
    },
  ];

  // Dummy data for today's appointments
  const todayAppointments = [
    {
      id: 1,
      customerName: "Alice Johnson",
      time: "11:00 AM",
      type: "Video Call",
      status: "Scheduled",
    },
    {
      id: 2,
      customerName: "Bob Wilson",
      time: "2:30 PM",
      type: "Instant Query",
      status: "Pending",
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

      <main className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-8 leading-tight">
              Welcome back, {employeeName}!
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900">
                    Active Users
                  </h3>
                </div>
                <p className="text-3xl font-bold text-blue-600">24</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900">
                    Pending Queries
                  </h3>
                </div>
                <p className="text-3xl font-bold text-green-600">12</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900">
                    Today's Appointments
                  </h3>
                </div>
                <p className="text-3xl font-bold text-purple-600">8</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Live Queries Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-blue-900">
                  Live Queries
                </h2>
                <Link
                  to="/employee/live-queries"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {liveQueries.map((query) => (
                  <div
                    key={query.id}
                    className="p-4 border-2 border-gray-100 rounded-xl hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {query.customerName}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          query.priority === "High"
                            ? "bg-red-100 text-red-600"
                            : query.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {query.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{query.type}</span>
                      <span>{query.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Appointments Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-blue-900">
                  Today's Appointments
                </h2>
                <Link
                  to="/employee/appointments"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 border-2 border-gray-100 rounded-xl hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {appointment.customerName}
                      </span>
                      <div className="flex items-center">
                        {appointment.type === "Video Call" ? (
                          <Video className="h-4 w-4 text-blue-600 mr-2" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-green-600 mr-2" />
                        )}
                        <span className="text-sm text-gray-600">
                          {appointment.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{appointment.time}</span>
                      <span
                        className={`flex items-center ${
                          appointment.status === "Scheduled"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {appointment.status === "Scheduled" ? (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        ) : (
                          <AlertCircle className="h-4 w-4 mr-1" />
                        )}
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EmployeeDashboard;
