import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection = React.forwardRef(({ onDiscoverMore }, ref) => {
  // Check localStorage on first render so the hero doesn't reanimate on remounts
  const [hasAnimated, setHasAnimated] = useState(() => {
    return localStorage.getItem("heroHasAnimated") === "true";
  });

  useEffect(() => {
    if (!hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
        localStorage.setItem("heroHasAnimated", "true");
      }, 600); // duration of the slide-in animation
      return () => clearTimeout(timer);
    }
  }, [hasAnimated]);

  return (
    <div ref={ref} className="pt-32 pb-20 px-6 hero-gradient">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Apply animation only if not yet animated */}
          <div className={`lg:w-1/2 lg:pr-12 ${!hasAnimated ? 'animate-slide-in' : ''}`}>
            <h1 className="text-6xl font-bold text-gradient mb-8 leading-tight">
              Revolutionizing Digital Banking with UBI भरोसा
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Experience the future of banking with our AI-powered facial recognition and intelligent scheduling system—designed for secure and efficient service.
            </p>
            <button
              onClick={onDiscoverMore}
              className="group flex items-center px-8 py-4 text-white bg-gradient-to-r from-blue-600 to-red-600 rounded-full hover:shadow-2xl transition-all hover:scale-105 transform"
            >
              Learn More
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0">
            <img
              src="https://img.freepik.com/free-vector/online-banking-concept-illustration_114360-13925.jpg"
              alt="Banking Interface"
              className="rounded-3xl shadow-2xl animate-float hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] transition-shadow"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default HeroSection;
