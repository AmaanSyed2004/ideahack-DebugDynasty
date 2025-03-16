import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Mic,
  Video,
  MessageSquare,
  CheckCircle,
  Calendar,
  Clock,
} from "lucide-react";

const RaiseQuery = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSubmissionOptions, setShowSubmissionOptions] = useState(false);
  const [submissionType, setSubmissionType] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [queryText, setQueryText] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const queryOptions = [
    {
      id: "account",
      title: "Account Related",
      description: "Balance inquiries, statement requests, or account updates",
    },
    {
      id: "transaction",
      title: "Transaction Issues",
      description: "Failed transactions, refunds, or transaction disputes",
    },
    {
      id: "loan",
      title: "Loan Enquiry",
      description: "New loan applications, EMI queries, or loan status",
    },
    {
      id: "technical",
      title: "Technical Support",
      description: "Mobile banking, net banking, or UPI related issues",
    },
  ];

  const handleNext = () => {
    if (selectedOption) {
      setShowSubmissionOptions(true);
    }
  };

  const handleBack = () => {
    setShowSubmissionOptions(false);
    setSubmissionType("");
    setQueryText("");
  };

  const handleSubmit = () => {
    if (submissionType && selectedOption) {
      const randomTicket = `UBI${Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0")}`;
      setTicketNumber(randomTicket);

      const newQuery = {
        ticketNumber: randomTicket,
        category: queryOptions.find((opt) => opt.id === selectedOption)?.title,
        submissionType,
        content: queryText,
        status: "Active",
        timestamp: new Date().toISOString(),
      };

      const existingQueries = JSON.parse(
        localStorage.getItem("userQueries") || "[]"
      );
      localStorage.setItem(
        "userQueries",
        JSON.stringify([newQuery, ...existingQueries])
      );

      setShowSuccess(true);
    }
  };

  const handleBookInstant = () => {
    navigate("/appointment/instant");
  };

  const handleBookFuture = () => {
    navigate("/appointment/schedule");
  };

  if (showSuccess) {
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
          <div className="bg-white max-w-2xl mx-auto p-8 rounded-3xl shadow-xl">
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-blue-900 mb-2">
                Service Ticket Created!
              </h2>
              <p className="text-gray-600 text-lg">
                Your ticket number is: {ticketNumber}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                Summary of the query
              </h3>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <strong>Category:</strong>{" "}
                  {queryOptions.find((opt) => opt.id === selectedOption)?.title}
                </p>
                <p className="text-gray-700">
                  <strong>Submission Type:</strong>{" "}
                  {submissionType.charAt(0).toUpperCase() +
                    submissionType.slice(1)}
                </p>
                <p className="text-gray-700">
                  <strong>Status:</strong>{" "}
                  <span className="text-green-600">Active</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleBookInstant}
                className="flex items-center justify-center space-x-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all transform hover:scale-102"
              >
                <Clock className="h-5 w-5" />
                <span>Book Instant Appointment</span>
              </button>
              <button
                onClick={handleBookFuture}
                className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl hover:opacity-90 transition-all transform hover:scale-102"
              >
                <Calendar className="h-5 w-5" />
                <span>Book Future Appointment</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/my-queries"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                View All Queries
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="bg-white max-w-2xl mx-auto p-8 rounded-3xl shadow-xl">
          {showSubmissionOptions && (
            <button
              onClick={handleBack}
              className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Query Selection
            </button>
          )}

          {!showSubmissionOptions ? (
            <>
              <h2 className="text-2xl md:text-3xl font-semibold text-blue-900 mb-6">
                Which of the following best describes your query?
              </h2>
              <div className="space-y-4">
                {queryOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`w-full p-6 text-left transition-all transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-2xl ${
                      selectedOption === option.id
                        ? "bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg"
                        : "bg-gray-50 hover:bg-gray-100 border-2 border-gray-100"
                    }`}
                    onClick={() => setSelectedOption(option.id)}
                  >
                    <div className="flex flex-col space-y-2">
                      <span className="text-lg md:text-xl font-semibold">
                        {option.title}
                      </span>
                      <span
                        className={`text-sm md:text-base ${
                          selectedOption === option.id
                            ? "text-gray-100"
                            : "text-gray-600"
                        }`}
                      >
                        {option.description}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                className={`mt-8 w-full group flex items-center justify-center bg-gradient-to-r from-blue-600 to-red-600 text-white py-4 px-8 rounded-full text-lg font-medium transition-all transform hover:scale-102 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedOption ? "animate-pulse" : ""
                }`}
                disabled={!selectedOption}
              >
                Proceed to Next Step
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-semibold text-blue-900 mb-6">
                How would you like to submit your query?
              </h2>
              <div className="space-y-4">
                <button
                  className={`w-full p-6 text-left transition-all transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-2xl ${
                    submissionType === "text"
                      ? "bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg"
                      : "bg-gray-50 hover:bg-gray-100 border-2 border-gray-100"
                  }`}
                  onClick={() => setSubmissionType("text")}
                >
                  <div className="flex items-center space-x-4">
                    <MessageSquare
                      className={`h-6 w-6 ${
                        submissionType === "text"
                          ? "text-white"
                          : "text-blue-600"
                      }`}
                    />
                    <div className="flex flex-col">
                      <span className="text-lg md:text-xl font-semibold">
                        Text Message
                      </span>
                      <span
                        className={`text-sm md:text-base ${
                          submissionType === "text"
                            ? "text-gray-100"
                            : "text-gray-600"
                        }`}
                      >
                        Type your query in detail
                      </span>
                    </div>
                  </div>
                </button>

                <button
                  className={`w-full p-6 text-left transition-all transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-2xl ${
                    submissionType === "audio"
                      ? "bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg"
                      : "bg-gray-50 hover:bg-gray-100 border-2 border-gray-100"
                  }`}
                  onClick={() => setSubmissionType("audio")}
                >
                  <div className="flex items-center space-x-4">
                    <Mic
                      className={`h-6 w-6 ${
                        submissionType === "audio"
                          ? "text-white"
                          : "text-blue-600"
                      }`}
                    />
                    <div className="flex flex-col">
                      <span className="text-lg md:text-xl font-semibold">
                        Voice Message
                      </span>
                      <span
                        className={`text-sm md:text-base ${
                          submissionType === "audio"
                            ? "text-gray-100"
                            : "text-gray-600"
                        }`}
                      >
                        Record an audio message
                      </span>
                    </div>
                  </div>
                </button>

                <button
                  className={`w-full p-6 text-left transition-all transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-2xl ${
                    submissionType === "video"
                      ? "bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg"
                      : "bg-gray-50 hover:bg-gray-100 border-2 border-gray-100"
                  }`}
                  onClick={() => setSubmissionType("video")}
                >
                  <div className="flex items-center space-x-4">
                    <Video
                      className={`h-6 w-6 ${
                        submissionType === "video"
                          ? "text-white"
                          : "text-blue-600"
                      }`}
                    />
                    <div className="flex flex-col">
                      <span className="text-lg md:text-xl font-semibold">
                        Video Call
                      </span>
                      <span
                        className={`text-sm md:text-base ${
                          submissionType === "video"
                            ? "text-gray-100"
                            : "text-gray-600"
                        }`}
                      >
                        Start a video consultation
                      </span>
                    </div>
                  </div>
                </button>
              </div>

              {submissionType && (
                <div className="mt-8 space-y-6">
                  <div className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-100">
                    {submissionType === "text" && (
                      <textarea
                        className="w-full h-32 p-4 bg-white rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
                        placeholder="Please describe your query in detail..."
                        value={queryText}
                        onChange={(e) => setQueryText(e.target.value)}
                      />
                    )}
                    {submissionType === "audio" && (
                      <div className="text-center py-8">
                        <Mic className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                        <p className="text-gray-600">
                          Click to start recording your message
                        </p>
                      </div>
                    )}
                    {submissionType === "video" && (
                      <div className="text-center py-8">
                        <Video className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                        <p className="text-gray-600">
                          Click to start video consultation
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full group flex items-center justify-center bg-gradient-to-r from-blue-600 to-red-600 text-white py-4 px-8 rounded-full text-lg font-medium transition-all transform hover:scale-102 hover:shadow-xl"
                  >
                    Submit Query
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RaiseQuery;
