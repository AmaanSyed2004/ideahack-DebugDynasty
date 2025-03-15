import React, { useRef, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import AppointmentSection from "./components/AppointmentSection";
import FAQSection from "./components/FAQSection";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  // Refs for landing page sections
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const appointmentRef = useRef(null);
  const faqRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll handler to update nav style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to scroll to a specific section
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  // LandingPage component that renders the sections
  function LandingPage() {
    return (
      <>
        <HeroSection ref={heroRef} onDiscoverMore={() => scrollToSection(featuresRef)} />
        <FeaturesSection ref={featuresRef} />
        <AppointmentSection ref={appointmentRef} />
        <FAQSection ref={faqRef} />
      </>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route
          path="/"
          element={
            <>
              <NavBar
                isScrolled={isScrolled}
                onScrollToHero={() => scrollToSection(heroRef)}
                onScrollToFeatures={() => scrollToSection(featuresRef)}
                onScrollToAppointment={() => scrollToSection(appointmentRef)}
                onScrollToFAQ={() => scrollToSection(faqRef)}
              />
              <LandingPage />
            </>
          }
        />
        {/* Login Page Route (without NavBar) */}
        <Route path="/login" element={<Login />} />
        {/* Signup Page Route (without NavBar) */}
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
