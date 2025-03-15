import React from 'react';
import { Building, Users, Calendar } from 'lucide-react';

const AppointmentSection = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gradient mb-16">
          Schedule Your Visit
        </h2>
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-3xl font-semibold text-blue-900 mb-10">Why Choose an Appointment?</h3>
            <div className="space-y-8">
              <div className="feature-card flex items-start bg-white p-6 rounded-2xl shadow-lg">
                <Building className="h-8 w-8 text-red-600 mr-4 mt-1" />
                <div>
                  <h4 className="text-xl font-semibold text-blue-900 mb-2">Zero Wait Time</h4>
                  <p className="text-gray-600">Experience priority service with our streamlined appointment system.</p>
                </div>
              </div>
              <div className="feature-card flex items-start bg-white p-6 rounded-2xl shadow-lg">
                <Users className="h-8 w-8 text-blue-600 mr-4 mt-1" />
                <div>
                  <h4 className="text-xl font-semibold text-blue-900 mb-2">Personal Attention</h4>
                  <p className="text-gray-600">Get undivided attention from our expert financial advisors.</p>
                </div>
              </div>
              <div className="feature-card flex items-start bg-white p-6 rounded-2xl shadow-lg">
                <Calendar className="h-8 w-8 text-red-600 mr-4 mt-1" />
                <div>
                  <h4 className="text-xl font-semibold text-blue-900 mb-2">Convenient Timing</h4>
                  <p className="text-gray-600">Choose from flexible time slots that fit your schedule perfectly.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-2xl font-semibold text-blue-900 mb-8">Premium Services</h3>
            <div className="space-y-6">
              <div className="service-card p-6 border-2 border-gray-100 rounded-2xl hover:bg-gray-50">
                <h4 className="text-xl font-semibold text-blue-900 mb-2">Account Services</h4>
                <p className="text-gray-600">Open new accounts or upgrade existing ones with premium benefits</p>
              </div>
              <div className="service-card p-6 border-2 border-gray-100 rounded-2xl hover:bg-gray-50">
                <h4 className="text-xl font-semibold text-blue-900 mb-2">Loan Consultation</h4>
                <p className="text-gray-600">Explore personalized loan options with competitive interest rates</p>
              </div>
              <div className="service-card p-6 border-2 border-gray-100 rounded-2xl hover:bg-gray-50">
                <h4 className="text-xl font-semibold text-blue-900 mb-2">Wealth Management</h4>
                <p className="text-gray-600">Expert guidance for portfolio optimization and wealth growth</p>
              </div>
              <div className="service-card p-6 border-2 border-gray-100 rounded-2xl hover:bg-gray-50">
                <h4 className="text-xl font-semibold text-blue-900 mb-2">Document Services</h4>
                <p className="text-gray-600">Quick and efficient processing of all banking documents</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AppointmentSection;
