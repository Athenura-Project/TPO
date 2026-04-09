import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Components import
import Navbar from '../components/LandingPage/Navbar';
import Hero from '../components/LandingPage/Hero';
import Features from '../components/LandingPage/Features';
import Workflow from '../components/LandingPage/Workflow';
import FAQ from '../components/LandingPage/FAQ'; 
import CTA from '../components/LandingPage/CTA';

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // Premium 0 to 100% Counter Logic
    let count = 0;
    const interval = setInterval(() => {
      count += 2; // Speed of the counter
      if (count > 100) count = 100;
      setCounter(count);
      
      // Jab 100% ho jaye, toh thoda pause leke loader hatao
      if (count === 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
        }, 500); // 500ms pause at 100% for satisfaction
      }
    }, 20); // Interval speed

    return () => clearInterval(interval);
  }, []);

  // Text Animation Variants
  const textContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const letterAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  const brandName = "ATHENURA".split("");

  return (
    <div className="min-h-screen bg-[#F5F7F2] selection:bg-[#B8CC34] selection:text-[#224D59] relative overflow-x-hidden">
      
      {/* 🚀 Ultra-Premium Curtain Reveal Preloader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="preloader"
            initial={{ y: 0 }}
            // Custom cubic-bezier for that "Apple-like" smooth exit
            exit={{ y: "-100%", transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#224D59] overflow-hidden"
          >
            {/* Background subtle glow inside preloader */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B8CC34]/15 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-6">
              
              {/* Animated Brand Name */}
              <motion.div 
                variants={textContainer}
                initial="hidden"
                animate="show"
                className="flex space-x-2 text-3xl md:text-5xl font-black text-white tracking-[0.2em] mb-12 drop-shadow-lg"
              >
                {brandName.map((letter, index) => (
                  <motion.span key={index} variants={letterAnim}>
                    {letter}
                  </motion.span>
                ))}
              </motion.div>

              {/* Progress Container */}
              <div className="w-full flex flex-col items-center">
                <div className="w-full flex justify-between items-end mb-3 px-1">
                  <span className="text-[#F5F7F2]/60 text-xs font-bold tracking-widest uppercase animate-pulse">
                    System Boot
                  </span>
                  {/* Dynamic Number Counter */}
                  <span className="text-[#B8CC34] text-xl md:text-2xl font-black tabular-nums">
                    {counter}%
                  </span>
                </div>

                {/* Progress Bar Line */}
                <div className="w-full h-1.5 bg-[#1A3A43] rounded-full overflow-hidden shadow-inner relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${counter}%` }}
                    transition={{ ease: "linear", duration: 0.1 }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#668824] to-[#B8CC34] shadow-[0_0_15px_#B8CC34]"
                  />
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <Navbar />

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