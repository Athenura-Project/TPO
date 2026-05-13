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
          <div className="w-16 h-16 rounded-full bg-[#F5F7F2] border-2 border-dashed border-[#B8CC34]/60 flex items-center justify-center shadow-sm">
            <svg className="w-8 h-8 text-[#224D59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="w-3/4 h-3 bg-[#E8EFE9] rounded-full overflow-hidden shadow-inner">
            <div className="w-2/3 h-full bg-gradient-to-r from-[#668824] to-[#B8CC34] animate-pulse"></div>
          </div>
          <div className="text-xs font-semibold text-[#384022]/70 tracking-wide">Uploading tpo_leads_2026.xlsx...</div>
        </div>
      )
    },
    {
      id: "step-2",
      title: "Assign Opportunities",
      description: "Select multiple TPOs and assign them to specific interns with a single click. The system instantly notifies the intern about their newly allocated targets.",
      badge: "02 / Distribute",
      mockup: (
        <div className="w-full h-full p-2 sm:p-4 flex flex-col justify-center space-y-3.5 bg-gradient-to-br from-[#F5F7F2]/40 to-transparent rounded-2xl">
          {[
            { text: "Assign Delhi Tech Univ. to Riya", active: true },
            { text: "Verify BITS Pilani TPO details", active: false },
            { text: "Distribute 50 new leads to Aman", active: false }
          ].map((item, index) => (
            /* Premium Card: Soft shadow, white background, elegant hover effect */
            <div key={index} className="w-full bg-white rounded-xl p-3.5 flex items-center justify-between border border-[#224D59]/5 shadow-[0_2px_10px_rgba(34,77,89,0.03)] hover:shadow-[0_8px_25px_rgba(34,77,89,0.08)] hover:border-[#B8CC34]/30 transition-all duration-300 group cursor-pointer transform hover:-translate-y-0.5">
              
              <div className="flex items-center space-x-3.5 w-full">
                {/* Left: Deep Green Checkbox (Matching Image) */}
                <div className="w-[22px] h-[22px] rounded-[5px] bg-[#224D59] flex items-center justify-center shadow-sm flex-shrink-0 group-hover:bg-[#1A3A43] transition-colors">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                {/* Center: Premium Text + Subtle Line (Matching Image Layout) */}
                <div className="flex flex-col w-full pr-2">
                  <span className="text-[13px] font-extrabold text-[#224D59] truncate group-hover:text-[#668824] transition-colors">
                    {item.text}
                  </span>
                  <div className="w-16 h-1.5 bg-[#F5F7F2] rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-[#B8CC34]/40 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                  </div>
                </div>
              </div>

              {/* Right: Light Grey Circle (Matching Image) */}
              <div className="w-8 h-8 rounded-full bg-[#F5F7F2] border border-[#224D59]/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#B8CC34]/15 transition-colors duration-300">
                {/* Optional tiny dot indicator inside circle for active state */}
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${item.active ? 'bg-[#668824] shadow-[0_0_5px_#668824]' : 'bg-transparent group-hover:bg-[#224D59]/20'}`}></div>
              </div>

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
          <div className="w-[80%] bg-white rounded-2xl p-4 shadow-[0_15px_35px_rgba(34,77,89,0.08)] border border-[#224D59]/5 transform rotate-3 transition-transform hover:rotate-0 duration-300">
            <div className="flex items-center space-x-3 mb-4 border-b border-[#224D59]/5 pb-3">
              <div className="w-8 h-8 rounded-full bg-[#B8CC34]/20 border border-[#B8CC34]/40 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#668824] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </div>
              <div>
                <div className="text-sm font-bold text-[#224D59]">Reminder</div>
                <div className="text-xs text-[#384022]/60 font-medium">Follow up required today</div>
              </div>
            </div>
            <div className="w-full h-9 bg-gradient-to-r from-[#224D59] to-[#1A3A43] rounded-lg text-white flex items-center justify-center text-xs font-bold shadow-[0_4px_10px_rgba(34,77,89,0.2)] hover:shadow-[0_4px_15px_rgba(34,77,89,0.3)] transition-shadow cursor-pointer">Mark as Done</div>
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
        <div className="w-full h-full flex items-end justify-between px-4 pb-2 space-x-3">
          <div className="w-1/4 bg-gradient-to-t from-[#668824]/30 to-[#668824]/60 h-[40%] rounded-t-md"></div>
          <div className="w-1/4 bg-gradient-to-t from-[#B8CC34]/50 to-[#B8CC34]/80 h-[75%] rounded-t-md"></div>
          <div className="w-1/4 bg-gradient-to-t from-[#224D59]/80 to-[#224D59] h-[100%] rounded-t-md shadow-[0_0_20px_rgba(34,77,89,0.15)]"></div>
          <div className="w-1/4 bg-gradient-to-t from-[#668824]/40 to-[#668824]/70 h-[60%] rounded-t-md"></div>
        </div>
      )
    }
  ];

  return (
    <section id="workflow" className="w-full py-20 lg:py-32 bg-white relative overflow-hidden" ref={sectionRef}>
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-[-10%] w-96 h-96 bg-[#B8CC34]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-[-10%] w-96 h-96 bg-[#224D59]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#B8CC34]/15 border border-[#B8CC34]/40 text-[#384022] font-bold tracking-widest text-xs uppercase mb-6 shadow-sm">
            The Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#224D59] leading-tight mb-6 tracking-tight">
            How Athenura Works
          </h2>
          <p className="text-lg text-[#384022]/80 font-medium leading-relaxed">
            A seamless, end-to-end workflow designed to convert institutional leads into successful placement opportunities.
          </p>
        </div>

        <div className="relative flex flex-col space-y-16 lg:space-y-32">
          
          {/* Central Elegant Timeline Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#224D59]/15 to-transparent transform -translate-x-1/2 z-0"></div>

          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            const isVisible = visibleItems[index];

            return (
              <div 
                key={step.id} 
                data-index={index}
                className={`workflow-step relative z-10 flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-16`}
              >
                
                {/* Timeline Node */}
                <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-[#224D59]/30 items-center justify-center z-20 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#B8CC34] animate-pulse shadow-[0_0_8px_#B8CC34]"></div>
                </div>

                <div 
                  className={`w-full lg:w-1/2 flex ${isEven ? 'lg:justify-end' : 'lg:justify-start'} transition-all duration-1000 ease-out delay-100 ${
                    isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 translate-y-10 ${isEven ? 'lg:-translate-x-10 lg:translate-y-0' : 'lg:translate-x-10 lg:translate-y-0'}`
                  }`}
                >
                  <div className={`max-w-md ${isEven ? 'lg:text-right' : 'lg:text-left'} text-center`}>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#F5F7F2] border border-[#B8CC34]/30 text-[#668824] text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
                      {step.badge}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#224D59] mb-4">
                      {step.title}
                    </h3>
                    <p className="text-[#384022]/80 text-base md:text-lg font-medium leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div 
                  className={`w-full lg:w-1/2 flex ${isEven ? 'lg:justify-start' : 'lg:justify-end'} transition-all duration-1000 ease-out delay-300 ${
                    isVisible ? 'opacity-100 translate-x-0 translate-y-0 shadow-[0_20px_40px_rgba(34,77,89,0.06)]' : `opacity-0 translate-y-10 shadow-none ${isEven ? 'lg:translate-x-10 lg:translate-y-0' : 'lg:-translate-x-10 lg:translate-y-0'}`
                  }`}
                >
                  {/* Light Glassmorphism Mockup Container */}
                  <div className="w-full max-w-md h-64 md:h-72 bg-white/80 backdrop-blur-2xl border border-[#224D59]/10 rounded-3xl p-6 relative overflow-hidden group hover:border-[#B8CC34]/40 transition-colors duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F5F7F2]/50 to-transparent z-0 pointer-events-none"></div>
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