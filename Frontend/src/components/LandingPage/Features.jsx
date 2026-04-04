import React from 'react';

const Features = () => {
  const featuresList = [
    {
      id: 1,
      title: "Role-Based Workspaces",
      description: "Dedicated interfaces for administrators to oversee operations and interns to manage their daily outreach targets efficiently.",
      icon: (
        <svg className="w-6 h-6 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
        </svg>
      )
    },
    {
      id: 2,
      title: "Bulk Data Import",
      description: "Seamlessly upload CSV or Excel files to onboard multiple interns and placement leads in seconds without manual entry.",
      icon: (
        <svg className="w-6 h-6 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
        </svg>
      )
    },
    {
      id: 3,
      title: "Automated Reminders",
      description: "Never miss a follow-up. The system automatically tracks pending leads and sends daily notifications to assigned interns.",
      icon: (
        <svg className="w-6 h-6 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
      )
    },
    {
      id: 4,
      title: "Performance Analytics",
      description: "Visualize conversion rates, track intern activity levels, and analyze monthly trends with interactive charts and reports.",
      icon: (
        <svg className="w-6 h-6 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      )
    }
  ];

  return (
    <section id="features" className="w-full py-20 lg:py-32 bg-[#F3EFEF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <span className="text-[#333333] font-semibold tracking-wider text-sm uppercase mb-3 block">
            Core Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#111111] leading-tight mb-6">
            Everything you need to scale your placements
          </h2>
          <p className="text-lg text-[#333333] font-light">
            Athenura provides a robust toolkit designed specifically for modern institutions to track, manage, and convert placement opportunities effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {featuresList.map((feature) => (
            <div 
              key={feature.id} 
              className="group relative bg-[#E2DFDF]/40 backdrop-blur-sm border border-[#B8B2B2]/30 rounded-2xl p-8 sm:p-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-[#E2DFDF]/60 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B8B2B2]/20 rounded-bl-full transform translate-x-16 -translate-y-16 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-xl bg-[#F3EFEF] shadow-sm flex items-center justify-center mb-6 border border-[#B8B2B2]/20 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-[#111111] mb-4">
                  {feature.title}
                </h3>
                <p className="text-[#333333] leading-relaxed font-light">
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