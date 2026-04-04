import React from 'react';
// Components import kar rahe hain tere folder structure ke according
import Navbar from '../components/LandingPage/Navbar';
import Hero from '../components/LandingPage/Hero';
import Features from '../components/LandingPage/Features';
import Workflow from '../components/LandingPage/Workflow';
import CTA from '../components/LandingPage/CTA';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F5] selection:bg-[#121212] selection:text-[#F5F5F5]">
      {/* 1. Navbar Call */}
      <Navbar />

      <main>
        {/* 2. Hero Section Call */}
        <Hero />

        <Features />
        <Workflow />
        <CTA />
      </main>

      {/* Optional: Footer yaha add kar sakte hain baad mein */}
    </div>
  );
};

export default LandingPage;