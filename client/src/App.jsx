import React, { useRef, useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import AppointmentSection from './components/AppointmentSection';
import FAQSection from './components/FAQSection';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
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

  return (
    <div className="min-h-screen bg-white">
      <NavBar 
        isScrolled={isScrolled}
        onScrollToFeatures={() => scrollTo(featuresRef)}
        onScrollToAppointment={() => scrollTo(appointmentRef)}
        onScrollToFAQ={() => scrollTo(faqRef)}
      />
      <HeroSection onDiscoverMore={() => scrollTo(featuresRef)} />
      <FeaturesSection ref={featuresRef} />
      <AppointmentSection ref={appointmentRef} />

      <FAQSection ref={faqRef} />
    </div>
  );
}

export default App;
