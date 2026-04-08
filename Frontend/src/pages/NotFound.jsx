import React from 'react';
import { motion } from 'framer-motion';

const NotFound = () => {
  // Framer Motion variants for staggered physics-based animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 250, damping: 25 } 
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7F2] relative overflow-hidden">
      
      {/* Ultra-Premium Subtle Dotted Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#224D59 2px, transparent 2px)', 
          backgroundSize: '32px 32px' 
        }}
      ></div>

      {/* Smoothly Moving Ambient Glows using Framer Motion */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1], 
          rotate: [0, 90, 0],
          x: [0, 50, 0] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[15%] left-[15%] w-[450px] h-[450px] bg-[#B8CC34]/15 rounded-full blur-[120px] pointer-events-none"
      ></motion.div>
      
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1], 
          rotate: [0, -90, 0],
          x: [0, -50, 0] 
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] bg-[#224D59]/10 rounded-full blur-[130px] pointer-events-none"
      ></motion.div>

      {/* Main Glassmorphism Card Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-[90%] max-w-3xl mx-auto bg-white/60 backdrop-blur-3xl border border-white rounded-[3rem] shadow-[0_40px_100px_rgba(34,77,89,0.08)] p-10 md:p-16 flex flex-col items-center text-center"
      >
        
        {/* Floating Compass / Radar Graphic */}
        <motion.div variants={itemVariants} className="mb-6">
          <motion.div variants={floatVariants} animate="animate" className="relative w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-[#224D59]/10">
            {/* Soft glow behind icon */}
            <div className="absolute inset-0 bg-[#B8CC34] rounded-2xl blur-xl opacity-30"></div>
            <svg className="w-10 h-10 text-[#224D59] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
            </svg>
          </motion.div>
        </motion.div>

        {/* Premium Badge */}
        <motion.div variants={itemVariants}>
          <span className="inline-block px-5 py-2 rounded-full bg-[#224D59]/5 border border-[#224D59]/10 text-[#224D59] text-xs font-bold tracking-[0.2em] uppercase mb-4 shadow-sm">
            Error 404
          </span>
        </motion.div>

        {/* Massive Stylized Header */}
        <motion.h1 
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#224D59] mb-4 tracking-tight"
        >
          Lost in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#224D59] to-[#668824]">cloud?</span>
        </motion.h1>

        {/* Description */}
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-[#384022]/70 font-medium mb-12 max-w-lg mx-auto leading-relaxed"
        >
          We can't seem to find the page you're looking for. It might have been moved, renamed, or perhaps it never existed.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto"
        >
          {/* Primary Button to go Home */}
          <a 
            href="/" 
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#B8CC34] text-[#224D59] font-bold text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(184,204,52,0.4)] hover:bg-[#cbe044] text-center flex items-center justify-center group"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Return Home
          </a>
          
          {/* Secondary Button to Contact Support */}
          <a 
            href="mailto:support@athenura.com" 
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border-2 border-[#224D59]/10 text-[#224D59] font-bold text-base transition-all duration-300 hover:-translate-y-1 hover:border-[#224D59]/30 hover:shadow-xl text-center flex items-center justify-center"
          >
            Contact Support
          </a>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default NotFound;