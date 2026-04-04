import React, { useEffect, useRef, useState } from 'react';

const Workflow = () => {
  const [visibleItems, setVisibleItems] = useState({});
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => ({
              ...prev,
              [entry.target.dataset.index]: true
            }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll('.workflow-step');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const steps = [
    {
      id: "step-1",
      title: "Import Leads & Interns",
      description: "Admins start by bulk uploading institutional data via CSV or Excel. The system automatically parses the file, skips duplicates, and populates the database securely.",
      badge: "01 / Setup",
      mockup: (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#E2DFDF] border-2 border-dashed border-[#B8B2B2] flex items-center justify-center">
            <svg className="w-8 h-8 text-[#333333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="w-3/4 h-3 bg-[#E2DFDF] rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-[#111111] animate-pulse"></div>
          </div>
          <div className="text-xs font-medium text-[#333333]">Uploading tpo_leads_2026.xlsx...</div>
        </div>
      )
    },
    {
      id: "step-2",
      title: "Assign Opportunities",
      description: "Select multiple TPOs and assign them to specific interns with a single click. The system instantly notifies the intern about their newly allocated targets.",
      badge: "02 / Distribute",
      mockup: (
        <div className="w-full h-full flex flex-col space-y-3 p-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="w-full bg-[#F3EFEF] p-3 rounded-lg flex items-center justify-between shadow-sm border border-[#E2DFDF]">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded border border-[#B8B2B2] flex items-center justify-center bg-[#111111]">
                  <svg className="w-3 h-3 text-[#F3EFEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="w-24 h-2 bg-[#B8B2B2]/40 rounded"></div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#333333]/10"></div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: "step-3",
      title: "Outreach & Follow-ups",
      description: "Interns manage their personalized dashboard, update communication statuses, and receive automated 8 AM daily reminders for scheduled follow-ups.",
      badge: "03 / Execute",
      mockup: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-[80%] bg-[#F3EFEF] rounded-xl p-4 shadow-lg border border-[#E2DFDF] transform rotate-3 transition-transform hover:rotate-0 duration-300">
            <div className="flex items-center space-x-3 mb-3 border-b border-[#E2DFDF] pb-3">
              <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#F3EFEF] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </div>
              <div>
                <div className="text-sm font-bold text-[#111111]">Reminder</div>
                <div className="text-xs text-[#333333]">Follow up required today</div>
              </div>
            </div>
            <div className="w-full h-8 bg-[#111111] rounded-md text-[#F3EFEF] flex items-center justify-center text-xs font-semibold">Mark as Done</div>
          </div>
        </div>
      )
    },
    {
      id: "step-4",
      title: "Monitor Performance",
      description: "Track the entire process from a bird's-eye view. The admin dashboard calculates conversion rates, generates activity logs, and identifies top-performing interns.",
      badge: "04 / Analyze",
      mockup: (
        <div className="w-full h-full flex items-end justify-between px-4 pb-2 space-x-2">
          <div className="w-1/4 bg-[#111111]/30 h-[40%] rounded-t-md"></div>
          <div className="w-1/4 bg-[#111111]/60 h-[75%] rounded-t-md"></div>
          <div className="w-1/4 bg-[#111111] h-[100%] rounded-t-md shadow-lg"></div>
          <div className="w-1/4 bg-[#111111]/80 h-[60%] rounded-t-md"></div>
        </div>
      )
    }
  ];

  return (
    <section id="workflow" className="w-full py-20 lg:py-32 bg-gradient-to-b from-[#F3EFEF] to-[#ffffff] overflow-hidden" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <span className="text-[#333333] font-semibold tracking-wider text-sm uppercase mb-3 block">
            The Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#111111] leading-tight mb-6">
            How Athenura Works
          </h2>
          <p className="text-lg text-[#333333] font-light">
            A seamless, end-to-end workflow designed to convert institutional leads into successful placement opportunities.
          </p>
        </div>

        <div className="relative flex flex-col space-y-16 lg:space-y-32">
          
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-[#E2DFDF] transform -translate-x-1/2 z-0"></div>

          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            const isVisible = visibleItems[index];

            return (
              <div 
                key={step.id} 
                data-index={index}
                className={`workflow-step relative z-10 flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-16`}
              >
                
                <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#111111] border-4 border-[#ffffff] items-center justify-center z-20 shadow-md">
                  <div className="w-2 h-2 rounded-full bg-[#F3EFEF]"></div>
                </div>

                <div 
                  className={`w-full lg:w-1/2 flex ${isEven ? 'lg:justify-end' : 'lg:justify-start'} transition-all duration-1000 ease-out delay-100 ${
                    isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 translate-y-10 ${isEven ? 'lg:-translate-x-10 lg:translate-y-0' : 'lg:translate-x-10 lg:translate-y-0'}`
                  }`}
                >
                  <div className={`max-w-md ${isEven ? 'lg:text-right' : 'lg:text-left'} text-center`}>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#E2DFDF]/60 text-[#333333] text-xs font-bold tracking-widest uppercase mb-4">
                      {step.badge}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#111111] mb-4">
                      {step.title}
                    </h3>
                    <p className="text-[#333333] text-base md:text-lg font-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div 
                  className={`w-full lg:w-1/2 flex ${isEven ? 'lg:justify-start' : 'lg:justify-end'} transition-all duration-1000 ease-out delay-300 ${
                    isVisible ? 'opacity-100 translate-x-0 translate-y-0 shadow-2xl' : `opacity-0 translate-y-10 shadow-none ${isEven ? 'lg:translate-x-10 lg:translate-y-0' : 'lg:-translate-x-10 lg:translate-y-0'}`
                  }`}
                >
                  <div className="w-full max-w-md h-64 md:h-72 bg-[#ffffff]/60 backdrop-blur-md border border-[#E2DFDF] rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F3EFEF]/50 to-transparent z-0"></div>
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      {step.mockup}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Workflow;