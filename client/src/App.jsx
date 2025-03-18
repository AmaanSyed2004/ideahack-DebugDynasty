import React, { useRef, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TicketProvider } from "./context/TicketContext";

// Import components
import NavBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import FAQSection from "./components/FAQSection";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserHomePage from "./components/UserHomePage";
import MyQueries from "./components/MyQueries";
import RaiseQuery from "./components/RaiseQuery";
import TicketSummary from "./components/TicketSummary"; // New route for ticket summary
import Feedback from "./components/Feedback";
import ProtectedRoute from "./components/ProtectedRoute";
import InstantAppointment from "./components/InstantAppointment";
import ScheduleAppointment from "./components/ScheduleAppointment";
import Appointments from "./components/Appointments";
import EmployeeDashboard from "./components/EmployeeDashboard.JSX";
import EmployeeLiveQueries from "./components/EmployeeLiveQueries";
import EmployeeAppointments from "./components/EmployeeAppointments";
import HomeAppointmentSection from "./components/HomeAppointmentSection";

function LandingPage({
  heroRef,
  featuresRef,
  appointmentRef,
  faqRef,
  scrollToSection,
}) {
  return (
    <>
      <HeroSection
        ref={heroRef}
        onDiscoverMore={() => scrollToSection(featuresRef)}
      />
      <FeaturesSection ref={featuresRef} />
      <HomeAppointmentSection ref={appointmentRef} />
      <FAQSection ref={faqRef} />
    </>
  );
}

function App() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const appointmentRef = useRef(null);
  const faqRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (ref) =>
    ref.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <AuthProvider>
      <TicketProvider>
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
                <ProtectedRoute allowedRoles={["customer"]}>
                  <UserHomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-tickets"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <MyQueries />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-appointments"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/raise-query"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <RaiseQuery />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ticket-summary"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <TicketSummary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <Feedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointment/instant"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <InstantAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointment/schedule"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <ScheduleAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute allowedRoles={["worker"]}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/live-queries"
              element={
                <ProtectedRoute allowedRoles={["worker"]}>
                  <EmployeeLiveQueries />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/appointments"
              element={
                <ProtectedRoute allowedRoles={["worker"]}>
                  <EmployeeAppointments />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </TicketProvider>
    </AuthProvider>
  );
}

export default App;
