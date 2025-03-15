import React, { useRef, useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import AppointmentSection from "./components/AppointmentSection";
import FAQSection from "./components/FAQSection";

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const appointmentRef = useRef(null);
  const faqRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <NavBar
          isScrolled={isScrolled}
          onScrollToHero={() => scrollToSection(heroRef)}
          onScrollToFeatures={() => scrollToSection(featuresRef)}
          onScrollToAppointment={() => scrollToSection(appointmentRef)}
          onScrollToFAQ={() => scrollToSection(faqRef)}
        />
        <HeroSection
          ref={heroRef}
          onDiscoverMore={() => scrollToSection(featuresRef)}
        />
        <FeaturesSection ref={featuresRef} />
        <AppointmentSection ref={appointmentRef} />
        <FAQSection ref={faqRef} />
      </div>
    </Router>
  );
}

export default App;
