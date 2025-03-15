import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import AppointmentSection from './components/AppointmentSection';
import FAQSection from './components/FAQSection';

// Separate pages for Login/Signup
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Refs for scrolling
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const appointmentRef = useRef(null);
  const faqRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Home layout with plain divs for each section (no reanimation)
  const HomeLayout = () => {
    return (
      <div className="relative">
        <NavBar
          isScrolled={isScrolled}
          onScrollToHero={() => scrollTo(heroRef)}
          onScrollToFeatures={() => scrollTo(featuresRef)}
          onScrollToAppointment={() => scrollTo(appointmentRef)}
          onScrollToFAQ={() => scrollTo(faqRef)}
        />
        <div ref={heroRef}>
          <HeroSection />
        </div>
        <div ref={featuresRef}>
          <FeaturesSection />
        </div>
        <div ref={appointmentRef}>
          <AppointmentSection />
        </div>
        <div ref={faqRef}>
          <FAQSection />
        </div>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        {/* Landing/Home Page */}
        <Route path="/" element={<HomeLayout />} />

        {/* Separate routes for Login & Signup */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
