import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const RaiseQuery = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

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
      console.log("Selected Query:", selectedOption);
      navigate("/next-step");
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

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="bg-white max-w-2xl mx-auto p-8 rounded-3xl shadow-xl">
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

          {/* Next Button */}
          <button
            onClick={handleNext}
            className={`mt-8 w-full group flex items-center justify-center bg-gradient-to-r from-blue-600 to-red-600 text-white py-4 px-8 rounded-full text-lg font-medium transition-all transform hover:scale-102 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
              selectedOption ? "animate-pulse" : ""
            }`}
            disabled={!selectedOption}
          >
            Proceed to Next Step
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RaiseQuery;
