import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  Calendar,
  MessageSquare,
  Mic,
  Video,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const MyQueries = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedQuery, setExpandedQuery] = useState(null);
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Load queries from localStorage
    const savedQueries = localStorage.getItem("userQueries");
    if (savedQueries) {
      setQueries(JSON.parse(savedQueries));
    }
  }, []);

  const getSubmissionTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "text":
        return <MessageSquare className="h-5 w-5" />;
      case "audio":
        return <Mic className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-600";
      case "resolved":
        return "text-blue-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
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
            <h1 className="text-3xl font-bold text-blue-900">My Queries</h1>
            <Link
              to="/raise-query"
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transition-all transform hover:scale-105"
            >
              New Query
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="space-y-4">
            {queries.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                <p className="text-gray-600 text-lg mb-4">No queries found</p>
                <Link
                  to="/raise-query"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  Raise your first query
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ) : (
              queries.map((query, index) => (
                <div
                  key={query.ticketNumber}
                  className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300"
                >
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() =>
                      setExpandedQuery(expandedQuery === index ? null : index)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-100 p-2 rounded-lg">
                          {getSubmissionTypeIcon(query.submissionType)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-blue-900">
                            {query.category}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Ticket: {query.ticketNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`text-sm font-medium ${getStatusColor(
                            query.status
                          )}`}
                        >
                          {query.status}
                        </span>
                        {expandedQuery === index ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedQuery === index && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            Submission Type
                          </p>
                          <p className="text-gray-900 flex items-center">
                            {getSubmissionTypeIcon(query.submissionType)}
                            <span className="ml-2">{query.submissionType}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            Created On
                          </p>
                          <p className="text-gray-900">
                            {formatDate(query.timestamp)}
                          </p>
                        </div>
                        {query.response && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2">
                              Response
                            </p>
                            <p className="text-gray-900">{query.response}</p>
                          </div>
                        )}
                        <div className="pt-4 flex space-x-4">
                          <button
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            onClick={() => {
                              /* Handle instant appointment */
                            }}
                          >
                            <Clock className="h-4 w-4" />
                            <span>Book Instant</span>
                          </button>
                          <button
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-lg hover:opacity-90 transition-colors"
                            onClick={() => {
                              /* Handle future appointment */
                            }}
                          >
                            <Calendar className="h-4 w-4" />
                            <span>Schedule</span>
                          </button>
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
    </div>
  );
};

export default MyQueries;
