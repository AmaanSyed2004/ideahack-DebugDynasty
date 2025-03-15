import React, { useRef, useEffect, useState } from 'react';
import NavBar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import QueryResolution from './components/QueryResolution';
import AppointmentSection from './components/AppointmentSection';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const featuresRef = useRef(null);
  const queryRef = useRef(null);
  const appointmentRef = useRef(null);

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
        onScrollToQuery={() => scrollTo(queryRef)}
        onScrollToAppointment={() => scrollTo(appointmentRef)}
      />
      <HeroSection onDiscoverMore={() => scrollTo(featuresRef)} />
      <FeaturesSection ref={featuresRef} />
      <QueryResolution ref={queryRef} />
      <AppointmentSection ref={appointmentRef} />
    </div>
  );
}

export default App;
