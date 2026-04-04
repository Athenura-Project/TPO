import React from 'react';

const Hero = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center pt-20 lg:pt-16 overflow-hidden bg-gradient-to-br from-[#F3EFEF] via-[#F3EFEF] to-[#E2DFDF]">
      {/* Hero container with padding for navbar and overflow handling */}
      
      {/* Background decorative ambient glows */}
      <div className="absolute top-0 left-0 w-64 h-64 md:w-[500px] md:h-[500px] bg-[#B8B2B2] rounded-full mix-blend-multiply filter blur-[80px] md:blur-[120px] opacity-20 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-64 h-64 md:w-[600px] md:h-[600px] bg-[#333333] rounded-full mix-blend-overlay filter blur-[100px] md:blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-10 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text Content */}
          <div className="flex flex-col space-y-6 md:space-y-8 text-center lg:text-left z-20">
            
            <div className="inline-flex items-center justify-center lg:justify-start">
              <span className="px-4 py-1.5 rounded-full bg-[#E2DFDF]/80 border border-[#B8B2B2]/50 text-[#333333] text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-sm shadow-sm">
                Web-Based TPO Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#111111] leading-tight tracking-tight">
              Manage Placements <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#111111] to-[#7a7a7a]">
                On The Cloud
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#333333] max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Athenura is a complete web portal for Training & Placement Operations. Assign leads, schedule automated follow-ups, and track intern performance through our interactive dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 pt-2">
              <a 
                href="/register" 
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-[#111111] text-[#F3EFEF] font-medium text-base sm:text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#111111]/20 text-center"
              >
                Create Account
              </a>
              
              <a 
                href="/login" 
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-[#E2DFDF]/50 backdrop-blur-md border border-[#B8B2B2]/50 text-[#111111] font-medium text-base sm:text-lg transition-all duration-300 transform hover:-translate-y-1 hover:bg-[#E2DFDF]/80 text-center"
              >
                Login to Portal
              </a>
            </div>
          </div>

          {/* Right Column: Premium Visual / Dashboard Mockup with Actual Text */}
          <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[500px] flex justify-center items-center perspective-1000 mt-8 lg:mt-0 z-10">
            
            {/* Main floating glass card */}
            <div className="absolute w-[95%] sm:w-[85%] md:w-[80%] h-[80%] bg-[#F3EFEF]/70 backdrop-blur-xl border border-[#ffffff]/60 rounded-2xl shadow-2xl p-4 sm:p-6 transform transition-transform duration-700 hover:rotate-y-3 hover:rotate-x-3 hover:scale-105 z-20 flex flex-col">
              
              {/* Mockup Header with Website Text */}
              <div className="flex justify-between items-center border-b border-[#B8B2B2]/40 pb-3 sm:pb-4">
                <div className="font-bold text-[#111111] text-sm sm:text-lg tracking-wide">
                  Admin Dashboard
                </div>
                <div className="flex space-x-3 items-center">
                  <span className="text-xs font-medium text-[#333333] hidden sm:block">Welcome, Admin</span>
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#111111] text-[#F3EFEF] flex items-center justify-center font-bold text-xs sm:text-sm shadow-md">
                    A
                  </div>
                </div>
              </div>

              {/* Mockup Body Content with Dashboard Stats */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 mt-4 sm:mt-6">
                
                {/* Left Mini Chart Area */}
                <div className="bg-[#E2DFDF]/50 border border-[#B8B2B2]/20 rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-sm">
                  <div className="text-xs sm:text-sm font-semibold text-[#333333] mb-2">Weekly Outreach</div>
                  <div className="w-full flex items-end justify-between space-x-1 sm:space-x-2 h-16 sm:h-24 pt-2">
                    <div className="w-1/5 bg-[#111111]/30 h-[40%] rounded-t-sm transition-all hover:bg-[#111111]/50"></div>
                    <div className="w-1/5 bg-[#111111]/50 h-[70%] rounded-t-sm transition-all hover:bg-[#111111]/70"></div>
                    <div className="w-1/5 bg-[#111111]/80 h-[50%] rounded-t-sm transition-all hover:bg-[#111111]"></div>
                    <div className="w-1/5 bg-[#111111] h-[90%] rounded-t-sm shadow-md"></div>
                    <div className="w-1/5 bg-[#111111]/60 h-[60%] rounded-t-sm transition-all hover:bg-[#111111]/80"></div>
                  </div>
                </div>

                {/* Right Mini Stats Area */}
                <div className="space-y-2 sm:space-y-3 flex flex-col justify-center">
                  <div className="bg-[#E2DFDF]/50 border border-[#B8B2B2]/20 rounded-lg p-2 sm:p-3 flex justify-between items-center shadow-sm">
                    <span className="text-xs sm:text-sm font-medium text-[#333333]">Active Interns</span>
                    <span className="text-sm sm:text-base font-bold text-[#111111]">24</span>
                  </div>
                  <div className="bg-[#E2DFDF]/50 border border-[#B8B2B2]/20 rounded-lg p-2 sm:p-3 flex justify-between items-center shadow-sm">
                    <span className="text-xs sm:text-sm font-medium text-[#333333]">Pending Leads</span>
                    <span className="text-sm sm:text-base font-bold text-[#111111]">142</span>
                  </div>
                  <div className="bg-[#E2DFDF]/50 border border-[#B8B2B2]/20 rounded-lg p-2 sm:p-3 flex justify-between items-center shadow-sm">
                    <span className="text-xs sm:text-sm font-medium text-[#333333]">System Status</span>
                    <span className="text-xs sm:text-sm font-bold text-[#111111] flex items-center">
                      <span className="w-2 h-2 rounded-full bg-[#111111] mr-1.5 animate-pulse"></span>
                      Online
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary decorative card behind the main card */}
            <div className="absolute top-[5%] right-[2%] sm:top-[10%] sm:right-[5%] w-[70%] sm:w-[60%] h-[70%] bg-[#333333]/5 backdrop-blur-md border border-[#B8B2B2]/30 rounded-2xl shadow-lg transform rotate-3 sm:rotate-6 z-10 transition-transform duration-700 hover:rotate-12"></div>
            
            {/* Floating stat badge */}
            <div className="absolute bottom-[2%] left-[2%] sm:bottom-[5%] sm:left-[5%] bg-[#111111] text-[#F3EFEF] px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl z-30 transform hover:-translate-y-2 transition-transform duration-300 animate-bounce" style={{ animationDuration: '3.5s' }}>
              <div className="text-xs sm:text-sm text-[#B8B2B2] mb-0.5">TPO Conversions</div>
              <div className="text-lg sm:text-2xl font-bold">84.2%</div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;