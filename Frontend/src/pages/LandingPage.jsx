import React from 'react';

// Components import
import Navbar from '../components/LandingPage/Navbar';
import Hero from '../components/LandingPage/Hero';
import Features from '../components/LandingPage/Features';
import Workflow from '../components/LandingPage/Workflow';
import FAQ from '../components/LandingPage/FAQ'; 
import CTA from '../components/LandingPage/CTA';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F7F2] selection:bg-[#B8CC34] selection:text-[#224D59] relative overflow-x-hidden">
      
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main>
        <Hero />
        <Features />
        <Workflow />
        <FAQ />
        <CTA />
      </main>

    </div>
  );
};

export default LandingPage;