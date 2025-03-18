import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  CheckCircle,
  ArrowLeft,
  Mic,
  Video,
  MessageSquare,
} from "lucide-react";

const EmployeeLiveQueries = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [liveQueries, setLiveQueries] = useState([]);
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

  useEffect(() => {
    const fetchLiveQueries = async () => {
      try {
        const response = await axios.get("http://localhost:5555/ticket/queue/",{withCredentials:true}); // Replace with actual path
        const data = response.data.nextTickets.map((ticket, index) => ({
          id: ticket.ticketID,
          priority: ticket.priority_score >= 75
            ? 1
            : ticket.priority_score >= 50
            ? 2
            : 3,
          serviceTicket: ticket.ticketID.slice(0, 8).toUpperCase(), // Taking first 8 chars as ticket no
          details: `Query related to department ${ticket.departmentID}`, // Random description
          meetLink: `https://meet.ubi.com/${ticket.ticketID.slice(0, 5)}`, // Dummy meet link
          customerName: `Customer ${index + 1}`, // Dummy customer name
          status: ticket.status,
        }));
        setLiveQueries(data);
      } catch (err) {
        console.error("Failed to fetch live queries", err);
      }
    };

    fetchLiveQueries();
  }, []);
  async function handleClick(){
    await axios.post("http://localhost:5555/ticket/queue/process", {ticketID: selectedQuery.id},{withCredentials:true});
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
          Live incoming queries
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {liveQueries.length === 0 ? (
              <p className="text-gray-500">No live queries at the moment.</p>
            ) : (
              liveQueries.map((query) => (
                <div
                  key={query.id}
                  onClick={() => setSelectedQuery(query)}
                  className={`cursor-pointer bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all ${
                    selectedQuery?.id === query.id
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        query.priority === 1
                          ? "bg-red-100 text-red-600"
                          : query.priority === 2
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      Priority {query.priority}
                    </span>
                    <span className="text-sm text-gray-500">
                      {query.serviceTicket}
                    </span>
                  </div>
                  <h3 className="font-medium text-blue-900 mb-2">
                    {query.customerName}
                  </h3>
                  <p className="text-gray-600 text-sm">{query.details}</p>
                </div>
              ))
            )}
          </div>

          {selectedQuery ? (
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-semibold text-blue-900 mb-6">
                Query Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service ticket
                  </label>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-blue-900">
                      {selectedQuery.serviceTicket}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-blue-900">
                      Priority {selectedQuery.priority}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Details
                  </label>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-blue-900">
                      {selectedQuery.customerName}
                    </p>
                    <p className="text-gray-600 mt-1">
                      {selectedQuery.details}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meet link
                  </label>
                  <input
                    type="text"
                    value={selectedQuery.meetLink}
                    readOnly
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-between pt-6">
                  <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl hover:shadow-lg transition-all" onClick={handleClick}>
                    Start
                  </button>
                  <button className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all">
                    Skip
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-lg flex items-center justify-center">
              <p className="text-gray-500">Select a query to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeLiveQueries;
