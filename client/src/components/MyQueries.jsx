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
    // Set dummy queries
    setQueries([
      {
        ticketNumber: "TCK12345",
        category: "Tax Filing Issue",
        submissionType: "text",
        timestamp: Date.now(),
        status: "active",
        response: "Your query is being reviewed.",
      },
      {
        ticketNumber: "TCK67890",
        category: "GST Registration",
        submissionType: "audio",
        timestamp: Date.now() - 86400000,
        status: "pending",
        response: "We will update you soon.",
      },
    ]);
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
    <div className="min-h-screen bg-blue-50">
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
          <h1 className="text-3xl font-bold text-blue-900 mb-8">My Queries</h1>
          {queries.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">
              No queries found
            </p>
          ) : (
            queries.map((query, index) => (
              <div
                key={query.ticketNumber}
                className="bg-white rounded-2xl shadow-md overflow-hidden mb-4"
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
                    <p className="text-gray-900">{query.response}</p>
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
