import React from 'react';
import { ArrowRight } from 'lucide-react';

function HeroSection({ onDiscoverMore }) {
  return (
    <div className="pt-32 pb-20 px-6 hero-gradient">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 animate-slide-in">
            <h1 className="text-6xl font-bold text-gradient mb-8 leading-tight">
              Banking Reimagined for the Digital Age
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Experience the future of banking with UBI Bharosa. Secure, seamless, and
              always at your service. Your trusted partner in financial success.
            </p>
            <button
              onClick={onDiscoverMore}
              className="group flex items-center px-8 py-4 text-white bg-gradient-to-r from-blue-600 to-red-600 rounded-full hover:shadow-2xl transition-all hover:scale-105 transform"
            >
              Discover More
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0">
            <img
              src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=800&q=80"
              alt="Banking Interface"
              className="rounded-3xl shadow-2xl animate-float hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] transition-shadow"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
