import React from 'react';
import { Shield, Wallet, PhoneCall, ChevronRight } from 'lucide-react';

const QueryResolution = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gradient mb-16">
          Swift Query Resolution
        </h2>
        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-10">
            <div className="feature-card flex items-start bg-gray-50 p-6 rounded-2xl">
              <Shield className="h-10 w-10 text-red-600 mr-6 mt-1" />
              <div>
                <h3 className="text-2xl font-semibold text-blue-900 mb-3">Account Security</h3>
                <p className="text-gray-600 leading-relaxed">
                  Instant resolution for security concerns, fraud prevention, and account protection measures.
                </p>
              </div>
            </div>
            <div className="feature-card flex items-start bg-gray-50 p-6 rounded-2xl">
              <Wallet className="h-10 w-10 text-blue-600 mr-6 mt-1" />
              <div>
                <h3 className="text-2xl font-semibold text-blue-900 mb-3">Transaction Support</h3>
                <p className="text-gray-600 leading-relaxed">
                  Quick assistance for all transaction-related queries and payment issues.
                </p>
              </div>
            </div>
            <div className="feature-card flex items-start bg-gray-50 p-6 rounded-2xl">
              <PhoneCall className="h-10 w-10 text-red-600 mr-6 mt-1" />
              <div>
                <h3 className="text-2xl font-semibold text-blue-900 mb-3">Always Available</h3>
                <p className="text-gray-600 leading-relaxed">
                  Round-the-clock support through multiple channels for your convenience.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-3xl font-semibold text-blue-900 mb-8">Popular Queries</h3>
            <div className="space-y-6">
              <details className="group bg-white p-6 rounded-2xl shadow-md transition-all">
                <summary className="font-medium text-xl text-blue-900 cursor-pointer flex items-center justify-between">
                  Password Reset Process
                  <ChevronRight className="h-5 w-5 transform group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-4 text-gray-600 details-animation">
                  Visit the login page and click on "Forgot Password". Follow the secure reset process through your registered email.
                </p>
              </details>
              <details className="group bg-white p-6 rounded-2xl shadow-md transition-all">
                <summary className="font-medium text-xl text-blue-900 cursor-pointer flex items-center justify-between">
                  Report Suspicious Activity
                  <ChevronRight className="h-5 w-5 transform group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-4 text-gray-600 details-animation">
                  Immediately report any unauthorized transactions through our 24/7 security hotline or online portal.
                </p>
              </details>
              <details className="group bg-white p-6 rounded-2xl shadow-md transition-all">
                <summary className="font-medium text-xl text-blue-900 cursor-pointer flex items-center justify-between">
                  Account Charges
                  <ChevronRight className="h-5 w-5 transform group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-4 text-gray-600 details-animation">
                  Transparent fee structure with minimal maintenance charges. Check our pricing page for detailed information.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default QueryResolution;
