import React from "react";
import {
  Calendar,
  Users,
  Shield,
  PhoneCall,
  Shield as Shield2,
  HelpCircle,
} from "lucide-react";

const FeaturesSection = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="py-20 bg-blue-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gradient mb-16">
          Advanced Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {/* Feature 1 */}
          <div className="feature-card bg-white p-6 md:p-8 rounded-2xl shadow-lg">
            <div className="bg-blue-50 p-4 rounded-2xl inline-block mb-6">
              <Calendar className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-4">
              Smart Scheduling & Ticketing
            </h3>
            <p className="text-gray-600 leading-relaxed">
              AI transcribes and categorizes customer queries, linking them with
              credit history for faster resolution.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="feature-card bg-white p-6 md:p-8 rounded-2xl shadow-lg">
            <div className="bg-green-50 p-4 rounded-2xl inline-block mb-6">
              <Users className="h-10 w-10 md:h-12 md:w-12 text-green-600" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-4">
              Predictive Customer Engagement
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Analyze customer sentiment to predict urgency and suggest
              proactive solutions.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="feature-card bg-white p-6 md:p-8 rounded-2xl shadow-lg">
            <div className="bg-red-50 p-4 rounded-2xl inline-block mb-6">
              <Shield className="h-10 w-10 md:h-12 md:w-12 text-red-600" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-4">
              Risk & Fraud Detection
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Monitor transaction patterns to detect anomalies and prevent
              fraud.
            </p>
          </div>
          {/* Feature 4 */}
          <div className="feature-card bg-white p-6 md:p-8 rounded-2xl shadow-lg">
            <div className="bg-purple-50 p-4 rounded-2xl inline-block mb-6">
              <PhoneCall className="h-10 w-10 md:h-12 md:w-12 text-purple-600" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-4">
              Rural Accessibility & Offline Support
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Ensure uninterrupted banking with local language support and
              offline query storage.
            </p>
          </div>
          {/* Feature 5 */}
          <div className="feature-card bg-white p-6 md:p-8 rounded-2xl shadow-lg">
            <div className="bg-yellow-50 p-4 rounded-2xl inline-block mb-6">
              <Shield2 className="h-10 w-10 md:h-12 md:w-12 text-yellow-600" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-4">
              Advanced Facial Recognition & Spoof Prevention
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Secure authentication using Aadhaar-based facial recognition with
              liveness detection.
            </p>
          </div>
          {/* Feature 6 */}
          <div className="feature-card bg-white p-6 md:p-8 rounded-2xl shadow-lg">
            <div className="bg-indigo-50 p-4 rounded-2xl inline-block mb-6">
              <HelpCircle className="h-10 w-10 md:h-12 md:w-12 text-indigo-600" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-4">
              Multi-Language Support & Smart Notifications
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Receive real-time notifications and feedback in multiple languages
              with smart suggestions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

FeaturesSection.displayName = "FeaturesSection";

export default FeaturesSection;
