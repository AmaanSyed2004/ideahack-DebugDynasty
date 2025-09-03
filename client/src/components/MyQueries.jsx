import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  Calendar,
  MessageSquare,
  Mic,
  Video,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axios from "axios";

const MyQueries = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedQuery, setExpandedQuery] = useState(null);
  const [queries, setQueries] = useState({ tickets: [] });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchQueries = async () => {
      const response = await axios.get(
        "http://localhost:5555/data/tickets",
        { withCredentials: true }
      );
      setQueries(response.data);
    };
    fetchQueries();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "in_progress":
        return "bg-yellow-100 text-yellow-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getModeIcon = (mode) => {
    switch (mode.toLowerCase()) {
      case "text":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "audio":
        return <Mic className="h-5 w-5 text-purple-500" />;
      case "video":
      case "live":
        return <Video className="h-5 w-5 text-red-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "glass-effect shadow-lg" : "bg-blue-50"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <span className="text-2xl sm:text-3xl font-bold text-gradient">
            UBI भरोसा
          </span>
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/dashboard" className="nav-link text-lg">
              Home
            </Link>
            <Link to="/my-tickets" className="nav-link text-lg">
              My ticket history
            </Link>
            <Link to="/my-appointments" className="nav-link text-lg">
              My Appointments
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-900 mb-8">
            My Ticket History
          </h1>

          {queries.tickets.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">No tickets found</p>
          ) : (
            queries.tickets.map((query, index) => (
              <div
                key={query.ticketID}
                className="bg-white rounded-2xl shadow-md overflow-hidden mb-6 border border-gray-100"
              >
                <div
                  className="p-6 cursor-pointer flex items-center justify-between"
                  onClick={() =>
                    setExpandedQuery(expandedQuery === index ? null : index)
                  }
                >
                  {/* Left side: Icon + Department */}
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      {getModeIcon(query.resolution_mode)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 capitalize">
                        {query.Department?.departmentName || "Unknown Dept"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Ticket ID: {query.ticketID.slice(0, 8)}...
                      </p>
                    </div>
                  </div>

                  {/* Right side: Status */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      query.status
                    )}`}
                  >
                    {query.status.replace("_", " ")}
                  </span>

                  {expandedQuery === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                {/* Expanded details */}
                {expandedQuery === index && (
                  <div className="px-6 pb-6 pt-4 border-t border-gray-100">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Raised By</p>
                        <p className="font-medium">
                          {query.User?.fullName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Resolution Mode</p>
                        <p className="font-medium capitalize">
                          {query.resolution_mode}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Priority Score</p>
                        <p className="font-medium">{query.priority_score}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-500">
                          Created: {formatDate(query.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-500">
                          Updated: {formatDate(query.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyQueries;
