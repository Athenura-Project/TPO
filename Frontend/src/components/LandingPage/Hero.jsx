import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  // Production level approach: Short snappy reveal (400ms) to let fonts/styles paint
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Trigger fade-in immediately after loader is removed
      requestAnimationFrame(() => setFadeIn(true));
    }, 400); // Snappy 400ms delay

    return () => clearTimeout(timer);
  }, []);

  // Premium Skeleton Loading Screen (Escalation Effect)
  if (isLoading) {
    return (
      // REDUCED TOP PADDING HERE: pt-12 lg:pt-20 instead of pt-24 lg:pt-32
      <section className="relative w-full min-h-[90vh] flex items-center pt-12 pb-12 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-24 overflow-hidden bg-[#F5F7F2]">
        {/* WIDER CONTAINER & RESPONSIVE PADDING ADDED HERE */}
        <div className="w-full max-w-[1536px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-20 relative z-10 py-8 lg:py-12">
          {/* INCREASED GAP FOR WIDER SCREENS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
            
            {/* Left Column Skeletons */}
            <div className="flex flex-col space-y-6 md:space-y-8 w-full">
              {/* Heading Skeletons */}
              <div className="space-y-4">
                <div className="w-3/4 h-14 md:h-16 rounded-xl bg-gray-300 animate-pulse delay-75"></div>
                <div className="w-1/2 h-14 md:h-16 rounded-xl bg-gray-300 animate-pulse delay-100"></div>
              </div>
              {/* Paragraph Skeletons */}
              <div className="space-y-3">
                <div className="w-full h-4 rounded bg-gray-200 animate-pulse delay-150"></div>
                <div className="w-5/6 h-4 rounded bg-gray-200 animate-pulse delay-200"></div>
                <div className="w-4/6 h-4 rounded bg-gray-200 animate-pulse delay-300"></div>
              </div>
            </div>

            {/* Right Column Mockup Skeleton */}
            <div className="w-full h-[350px] sm:h-[450px] lg:h-[500px] flex justify-center items-center mt-8 lg:mt-0">
              <div className="w-[95%] sm:w-[85%] md:w-[80%] h-[80%] bg-gray-200/50 rounded-3xl animate-pulse delay-300 p-6 flex flex-col">
                 <div className="w-1/3 h-6 bg-gray-300 rounded mb-8"></div>
                 <div className="flex-1 grid grid-cols-2 gap-4">
                   <div className="bg-gray-300/50 rounded-xl"></div>
                   <div className="space-y-3 flex flex-col justify-center">
                     <div className="h-12 bg-gray-300/50 rounded-lg"></div>
                     <div className="h-12 bg-gray-300/50 rounded-lg"></div>
                     <div className="h-12 bg-gray-300/50 rounded-lg"></div>
                   </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }

  // Actual Hero Content
  return (
    // REDUCED TOP PADDING HERE AS WELL TO MATCH SKELETON
    <section className={`relative w-full min-h-[90vh] flex items-center pt-12 pb-12 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-24 overflow-hidden bg-[#F5F7F2] transition-opacity duration-700 ease-out ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background decorative ambient glows */}
      <div className="absolute top-0 left-0 w-64 h-64 md:w-[500px] md:h-[500px] bg-[#B8CC34] rounded-full mix-blend-multiply filter blur-[90px] md:blur-[130px] opacity-20 animate-pulse-slow pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-64 h-64 md:w-[600px] md:h-[600px] bg-[#224D59] rounded-full mix-blend-multiply filter blur-[100px] md:blur-[150px] opacity-10 animate-pulse-slow pointer-events-none z-0"></div>

      {/* WIDER CONTAINER & RESPONSIVE PADDING */}
      <div className="w-full max-w-[1536px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-20 relative z-10 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
          
          {/* Left Column: Text Content */}
          <div className="flex flex-col space-y-6 md:space-y-8 text-center lg:text-left z-20">
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#224D59] leading-tight tracking-tight">
              Manage Placements <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#224D59] to-[#668824]">
                On The Cloud
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#384022]/80 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Athenura is a complete web portal for Training & Placement Operations. Assign leads, schedule automated follow-ups, and track intern performance through our interactive dashboard.
            </p>

          </div>

          {/* Right Column: Premium Light Glassmorphism Dashboard Mockup */}
          <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[500px] flex justify-center items-center perspective-1000 mt-8 lg:mt-0 z-10">
            
            <div className="absolute w-[95%] sm:w-[85%] md:w-[80%] h-[80%] bg-white/80 backdrop-blur-2xl border border-white rounded-3xl shadow-[0_20px_50px_rgba(34,77,89,0.1)] p-4 sm:p-6 transform transition-transform duration-700 hover:rotate-y-2 hover:rotate-x-2 hover:scale-105 z-20 flex flex-col">
              
              <div className="flex justify-between items-center border-b border-[#224D59]/10 pb-3 sm:pb-4">
                <div className="font-bold text-[#224D59] text-sm sm:text-lg tracking-wide">
                  Admin Dashboard
                </div>
                <div className="flex space-x-3 items-center">
                  <span className="text-xs font-semibold text-[#384022]/60 hidden sm:block">Welcome, Admin</span>
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#B8CC34] text-[#224D59] flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm">
                    A
                  </div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 mt-4 sm:mt-6">
                
                <div className="bg-[#F5F7F2]/80 border border-[#224D59]/5 rounded-2xl p-3 sm:p-4 flex flex-col justify-between shadow-inner">
                  <div className="text-xs sm:text-sm font-bold text-[#224D59] mb-2">Weekly Outreach</div>
                  <div className="w-full flex items-end justify-between space-x-1 sm:space-x-2 h-16 sm:h-24 pt-2">
                    <div className="w-1/5 bg-gradient-to-t from-[#668824] to-[#B8CC34] h-[40%] rounded-t-md opacity-80 hover:opacity-100 transition-opacity"></div>
                    <div className="w-1/5 bg-gradient-to-t from-[#668824] to-[#B8CC34] h-[70%] rounded-t-md opacity-80 hover:opacity-100 transition-opacity"></div>
                    <div className="w-1/5 bg-gradient-to-t from-[#668824] to-[#B8CC34] h-[50%] rounded-t-md opacity-80 hover:opacity-100 transition-opacity"></div>
                    <div className="w-1/5 bg-[#224D59] h-[90%] rounded-t-md shadow-md"></div>
                    <div className="w-1/5 bg-gradient-to-t from-[#668824] to-[#B8CC34] h-[60%] rounded-t-md opacity-80 hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3 flex flex-col justify-center">
                  <div className="bg-[#F5F7F2] border border-[#224D59]/5 rounded-xl p-2 sm:p-3 flex justify-between items-center transition-all hover:shadow-md">
                    <span className="text-xs sm:text-sm font-semibold text-[#384022]/70">Active Interns</span>
                    <span className="text-sm sm:text-base font-black text-[#224D59]">24</span>
                  </div>
                  <div className="bg-[#F5F7F2] border border-[#224D59]/5 rounded-xl p-2 sm:p-3 flex justify-between items-center transition-all hover:shadow-md">
                    <span className="text-xs sm:text-sm font-semibold text-[#384022]/70">Pending Leads</span>
                    <span className="text-sm sm:text-base font-black text-[#224D59]">142</span>
                  </div>
                  <div className="bg-[#F5F7F2] border border-[#224D59]/5 rounded-xl p-2 sm:p-3 flex justify-between items-center transition-all hover:shadow-md">
                    <span className="text-xs sm:text-sm font-semibold text-[#384022]/70">System Status</span>
                    <span className="text-xs sm:text-sm font-bold text-[#224D59] flex items-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#B8CC34] mr-1.5 animate-pulse shadow-[0_0_5px_#B8CC34]"></span>
                      Online
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-[5%] right-[2%] sm:top-[10%] sm:right-[5%] w-[70%] sm:w-[60%] h-[70%] bg-[#E8EFE9]/50 backdrop-blur-sm border border-white/60 rounded-3xl shadow-lg transform rotate-3 sm:rotate-6 z-10 transition-transform duration-700 hover:rotate-12"></div>
            
            <div className="absolute bottom-[2%] left-[2%] sm:bottom-[5%] sm:left-[5%] bg-[#384022] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-[0_15px_30px_rgba(56,64,34,0.3)] z-30 transform hover:-translate-y-2 transition-transform duration-300 animate-bounce" style={{ animationDuration: '3.5s' }}>
              <div className="text-xs sm:text-sm text-[#F5F7F2]/80 mb-0.5 font-medium">TPO Conversions</div>
              <div className="text-lg sm:text-2xl font-black text-[#B8CC34]">84.2%</div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;