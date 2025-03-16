import React, { useRef, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import existing components
import NavBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import AppointmentSection from "./components/AppointmentSection";
import FAQSection from "./components/FAQSection";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserHomePage from "./components/UserHomePage";

// Import new components for user-specific routes
import MyQueries from "./components/MyQueries";
import MyAppointments from "./components/MyAppointments";
import RaiseQuery from "./components/RaiseQuery";
import Feedback from "./components/Feedback";
import ProtectedRoute from "./components/ProtectedRoute";

/* LandingPage component renders the public homepage sections */
function LandingPage({ heroRef, featuresRef, appointmentRef, faqRef, scrollToSection }) {
  return (
    <>
      <HeroSection ref={heroRef} onDiscoverMore={() => scrollToSection(featuresRef)} />
      <FeaturesSection ref={featuresRef} />
      <AppointmentSection ref={appointmentRef} />
      <FAQSection ref={faqRef} />
    </>
  );
}

function App() {
  // Create refs for landing page sections
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const appointmentRef = useRef(null);
  const faqRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener to update nav style
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to scroll to a specific section
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Router>
      <Routes>
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
              <LandingPage
                heroRef={heroRef}
                featuresRef={featuresRef}
                appointmentRef={appointmentRef}
                faqRef={faqRef}
                scrollToSection={scrollToSection}
              />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-queries"
          element={
            <ProtectedRoute>
              <MyQueries />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/raise-query"
          element={
            <ProtectedRoute>
              <RaiseQuery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
