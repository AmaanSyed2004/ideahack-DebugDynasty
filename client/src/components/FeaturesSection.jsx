import React from 'react';
import { Shield, Users, Building2 } from 'lucide-react';

const FeaturesSection = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gradient mb-16">
          Experience Next-Gen Banking
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="feature-card bg-white p-8 rounded-2xl shadow-lg">
            <div className="bg-red-50 p-4 rounded-2xl inline-block mb-6">
              <Shield className="h-12 w-12 text-red-600" />
            </div>
            <h3 className="text-2xl font-semibold text-blue-900 mb-4">
              Fort Knox Security
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Bank with confidence using our military-grade encryption and
              multi-layer security protocols.
            </p>
          </div>
          <div className="feature-card bg-white p-8 rounded-2xl shadow-lg">
            <div className="bg-blue-50 p-4 rounded-2xl inline-block mb-6">
              <Users className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-blue-900 mb-4">
              24/7 Expert Support
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Our dedicated team of financial experts is always ready to assist
              you, anytime, anywhere.
            </p>
          </div>
          <div className="feature-card bg-white p-8 rounded-2xl shadow-lg">
            <div className="bg-red-50 p-4 rounded-2xl inline-block mb-6">
              <Building2 className="h-12 w-12 text-red-600" />
            </div>
            <h3 className="text-2xl font-semibold text-blue-900 mb-4">
              Pan-India Network
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Access your accounts seamlessly across our vast network of branches
              and digital platforms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default FeaturesSection;
