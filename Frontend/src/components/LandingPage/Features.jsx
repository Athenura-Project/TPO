import React, { useEffect, useState } from 'react';

const Features = () => {
  // State to track which elements have scrolled into view
  const [visibleItems, setVisibleItems] = useState({});

  useEffect(() => {
    // Intersection Observer setup for smooth scroll reveals
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => ({
              ...prev,
              [entry.target.dataset.id]: true
            }));
            // Stop observing once revealed so it doesn't animate again and again
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Grab all elements we want to animate
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const featuresList = [
    {
      id: 1,
      title: "Role-Based Workspaces",
      description: "Dedicated interfaces for administrators to oversee operations and interns to manage their daily outreach targets efficiently.",
      icon: (
        <svg className="w-6 h-6 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
        </svg>
      )
    },
    {
      id: 2,
      title: "Bulk Data Import",
      description: "Seamlessly upload CSV or Excel files to onboard multiple interns and placement leads in seconds without manual entry.",
      icon: (
        <svg className="w-6 h-6 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
        </svg>
      )
    },
    {
      id: 3,
      title: "Automated Reminders",
      description: "Never miss a follow-up. The system automatically tracks pending leads and sends daily notifications to assigned interns.",
      icon: (
        <svg className="w-6 h-6 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
      )
    },
    {
      id: 4,
      title: "Performance Analytics",
      description: "Visualize conversion rates, track intern activity levels, and analyze monthly trends with interactive charts and reports.",
      icon: (
        <svg className="w-6 h-6 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      )
    }
  ];

  return (
    <section id="features" className="w-full py-20 lg:py-32 bg-[#F5F7F2] relative overflow-hidden">
      
      {/* Subtle Background Ambient Elements */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-[#B8CC34]/5 rounded-full blur-[100px] pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#224D59]/5 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/2 translate-y-1/4"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Animated Section Header */}
        <div 
          data-id="header"
          className={`animate-on-scroll transition-all duration-1000 ease-out text-center max-w-3xl mx-auto mb-16 lg:mb-24 ${
            visibleItems['header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#B8CC34]/15 border border-[#B8CC34]/40 text-[#384022] text-xs sm:text-sm font-bold tracking-widest uppercase mb-6 shadow-sm">
            Core Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#224D59] leading-tight mb-6 tracking-tight">
            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#224D59] to-[#668824]">scale your placements</span>
          </h2>
          <p className="text-lg text-[#384022]/80 font-medium leading-relaxed max-w-2xl mx-auto">
            Athenura provides a robust toolkit designed specifically for modern institutions to track, manage, and convert placement opportunities effectively.
          </p>
        </div>

        {/* Animated Features Grid with Staggered Delays */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {featuresList.map((feature, index) => (
            <div 
              key={feature.id}
              data-id={`card-${feature.id}`}
              className={`animate-on-scroll group relative bg-white border border-[#224D59]/5 rounded-3xl p-8 sm:p-10 transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(34,77,89,0.08)] overflow-hidden ${
                visibleItems[`card-${feature.id}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }} // Multiplier sets the staggered delay interval
            >
              {/* Decorative hover gradient blob in the corner */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#B8CC34]/20 to-[#668824]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                
                {/* Interactive Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-[#F5F7F2] text-[#224D59] shadow-sm flex items-center justify-center mb-6 border border-[#224D59]/10 group-hover:bg-[#B8CC34] group-hover:text-white group-hover:border-[#B8CC34] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-out">
                  {feature.icon}
                </div>
                
                {/* Text Content */}
                <h3 className="text-xl sm:text-2xl font-bold text-[#224D59] mb-4 group-hover:text-[#1A3A43] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-[#384022]/80 font-medium leading-relaxed">
                  {feature.description}
                </p>
                
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;