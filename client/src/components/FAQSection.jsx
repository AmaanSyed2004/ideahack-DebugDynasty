import React from 'react';
import { ChevronRight } from 'lucide-react';

const FAQSection = React.forwardRef((props, ref) => {
  const faqItems = [
    {
      question: "How does UBI भरोसा work?",
      answer:
        "UBI भरोसा leverages AI-powered facial recognition, intelligent scheduling, and automated ticket generation to provide secure and efficient banking services.",
    },
    {
      question: "What are the benefits of booking an appointment?",
      answer:
        "Enjoy immediate service, personalized attention, and flexible scheduling that ensure a smoother and more secure banking experience.",
    },
    {
      question: "Is offline support available?",
      answer:
        "Yes, offline query storage and local language support are built in to ensure uninterrupted service even in areas with weak connectivity.",
    },
    {
      question: "How secure is your facial recognition system?",
      answer:
        "Our system uses Aadhaar-based facial recognition with advanced liveness detection and spoof prevention measures to ensure maximum security.",
    },
    {
      question: "How is my data protected?",
      answer:
        "We use end-to-end encryption (AES-256) and secure data transmission (SSL) along with industry-standard measures like SHA-256 hashing to protect your data.",
    },
    {
      question: "Which languages does UBI भरोसा support?",
      answer:
        "While the interface is in English, our system supports multiple regional languages for offline queries and notifications.",
    },
    {
      question: "Can I access UBI भरोसा on mobile devices?",
      answer:
        "Absolutely! Our responsive design ensures full functionality on both mobile and desktop platforms.",
    },
    {
      question: "What happens if I experience connectivity issues?",
      answer:
        "In case of connectivity issues, your queries are stored locally and automatically submitted once the connection is restored.",
    },
  ];

  return (
    <div ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gradient mb-16">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6 max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <div key={index} className="p-0.5 bg-gradient-to-r from-blue-300 to-red-300 rounded-2xl">
              <details className="group bg-white p-6 rounded-2xl shadow-md transition-all hover:shadow-lg">
                <summary className="font-medium text-xl text-blue-900 cursor-pointer flex items-center justify-between">
                  {item.question}
                  <ChevronRight className="h-5 w-5 transform group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-4 text-gray-600">
                  {item.answer}
                </p>
              </details>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default FAQSection;
