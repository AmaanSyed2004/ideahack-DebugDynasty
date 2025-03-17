import React from "react";
import { Building, Users, Calendar, Shield } from "lucide-react";

const HomeAppointmentSection = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="py-20 bg-blue-50">

      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gradient mb-16">
          Book Your Appointment
        </h2>
        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold text-blue-900 mb-8 md:mb-10">
              Why Book an Appointment with UBI भरोसा?
            </h3>
            <div className="space-y-6 md:space-y-8">
              <div className="feature-card flex items-start bg-white p-6 rounded-2xl shadow-lg">
                <Building className="h-8 w-8 text-red-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg md:text-xl font-semibold text-blue-900 mb-2">
                    Instant Service
                  </h4>
                  <p className="text-gray-600">
                    Receive prompt and secure service without delays.
                  </p>
                </div>
              </div>
              <div className="feature-card flex items-start bg-white p-6 rounded-2xl shadow-lg">
                <Users className="h-8 w-8 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg md:text-xl font-semibold text-blue-900 mb-2">
                    Personalized Attention
                  </h4>
                  <p className="text-gray-600">
                    Get expert advice and tailored solutions for your needs.
                  </p>
                </div>
              </div>
              <div className="feature-card flex items-start bg-white p-6 rounded-2xl shadow-lg">
                <Calendar className="h-8 w-8 text-red-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg md:text-xl font-semibold text-blue-900 mb-2">
                    Flexible Timing
                  </h4>
                  <p className="text-gray-600">
                    Choose an appointment slot that fits your schedule.
                  </p>
                </div>
              </div>
              <div className="feature-card flex items-start bg-white p-6 rounded-2xl shadow-lg">
                <Shield className="h-8 w-8 text-green-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg md:text-xl font-semibold text-blue-900 mb-2">
                    Enhanced Security
                  </h4>
                  <p className="text-gray-600">
                    Our robust facial recognition ensures rapid, secure
                    verification to reduce fraud risks.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl">
            <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-6 md:mb-8">
              Additional Services
            </h3>
            <div className="space-y-4 md:space-y-6">
              <div className="service-card p-6 border-2 border-gray-100 rounded-2xl hover:bg-gray-50">
                <h4 className="text-lg md:text-xl font-semibold text-blue-900 mb-2">
                  Account Services
                </h4>
                <p className="text-gray-600">
                  Open new accounts or upgrade existing ones with enhanced
                  benefits.
                </p>
              </div>
              <div className="service-card p-6 border-2 border-gray-100 rounded-2xl hover:bg-gray-50">
                <h4 className="text-lg md:text-xl font-semibold text-blue-900 mb-2">
                  Loan Consultation
                </h4>
                <p className="text-gray-600">
                  Get expert advice on your loan options.
                </p>
              </div>
              <div className="service-card p-6 border-2 border-gray-100 rounded-2xl hover:bg-gray-50">
                <h4 className="text-lg md:text-xl font-semibold text-blue-900 mb-2">
                  Wealth Management
                </h4>
                <p className="text-gray-600">
                  Optimize your portfolio with professional guidance.
                </p>
              </div>
              <div className="service-card p-6 border-2 border-gray-100 rounded-2xl hover:bg-gray-50">
                <h4 className="text-lg md:text-xl font-semibold text-blue-900 mb-2">
                  Document Services
                </h4>
                <p className="text-gray-600">
                  Experience quick and secure processing of your banking
                  documents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

HomeAppointmentSection.displayName = "HomeAppointmentSection";

export default HomeAppointmentSection;