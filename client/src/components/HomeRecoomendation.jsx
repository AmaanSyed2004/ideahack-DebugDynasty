import React, { useState, useEffect } from "react";
import { CreditCard, Home, Briefcase } from "lucide-react";
import axios from "axios";

const DEFAULT_LOANS = [
  {
    type: "Personal Loan",
    icon: CreditCard,
    description:
      "Flexible credit options tailored for your personal needs with competitive interest rates.",
  },
  {
    type: "Home Loan",
    icon: Home,
    description:
      "Discover the best rates to finance your new home with flexible repayment options.",
  },
  {
    type: "Business Loan",
    icon: Briefcase,
    description:
      "Grow your business with our comprehensive financing solutions and expert guidance.",
  },
];

const HomeRecommendation = React.forwardRef((props, ref) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5555/api/recommend"
        ,{},{withCredentials:true});
        const fetchedLoans = response.data.top_3_loans || [];

        // Map fetched loans to include icons and descriptions
        const mappedLoans = fetchedLoans.map((loan) => {
          const defaultLoan =
            DEFAULT_LOANS.find((d) => d.type === loan) || DEFAULT_LOANS[0];
          return {
            type: loan,
            icon: defaultLoan.icon,
            description: defaultLoan.description,
          };
        });

        setRecommendations(
          mappedLoans.length > 0 ? mappedLoans : DEFAULT_LOANS
        );
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecommendations(DEFAULT_LOANS);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div ref={ref} className="py-20 bg-blue-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gradient mb-16">
          Personalized Recommendations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {recommendations.map((loan, index) => {
            const Icon = loan.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <div className="bg-blue-50 p-4 rounded-2xl inline-block mb-6">
                  <Icon className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-4">
                  {loan.type}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {loan.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

HomeRecommendation.displayName = "HomeRecommendation";

export default HomeRecommendation;
