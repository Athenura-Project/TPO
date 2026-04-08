import React, { useState, useEffect } from 'react';

const FAQ = () => {
  const [visibleItems, setVisibleItems] = useState({});
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => ({
              ...prev,
              [entry.target.dataset.id]: true,
            }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What makes Athenura different from regular CRMs?",
      answer: "Athenura is purpose-built for Training & Placement Operations (TPO). Unlike generic CRMs, it features role-based workspaces for admins and interns, automated follow-up reminders tailored for corporate outreach, and instant bulk import for institutional data."
    },
    {
      question: "Can I upload bulk student and placement lead data?",
      answer: "Absolutely. Our platform supports seamless CSV and Excel file uploads. The system automatically parses the data, skips duplicates, and populates your database securely within seconds, eliminating manual entry."
    },
    {
      question: "How do the automated reminders work?",
      answer: "The system actively monitors the status of your leads. If an intern has a scheduled follow-up or a pending lead needs attention, Athenura automatically sends an email/dashboard notification at 8 AM daily so no opportunity slips through the cracks."
    },
    {
      question: "Is the institutional data completely secure?",
      answer: "Yes, security is our top priority. Athenura uses industry-standard encryption for data at rest and in transit. We also implement strict role-based access control, ensuring interns only see the data assigned to them, while admins have full oversight."
    },
    {
      question: "Can we track the performance of individual interns?",
      answer: "Yes! The admin dashboard provides a bird's-eye view of your entire operation. You can visualize conversion rates, track daily activity levels of specific interns, and analyze monthly trends through interactive charts."
    }
  ];

  return (
    <section id="faq" className="w-full py-24 lg:py-32 bg-[#F5F7F2] relative overflow-hidden">
      
      {/* Ultra-Premium Subtle Dotted Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#224D59 2px, transparent 2px)', 
          backgroundSize: '30px 30px' 
        }}
      ></div>

      {/* Soft Ambient Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#B8CC34]/5 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/4 z-0"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#224D59]/5 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/3 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Sticky Header & Support Widget */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-32 flex-shrink-0">
            <div 
              data-id="faq-header"
              className={`animate-on-scroll transition-all duration-1000 ease-out ${
                visibleItems['faq-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#B8CC34]/15 border border-[#B8CC34]/40 text-[#668824] text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
                FAQ
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#224D59] leading-tight mb-6 tracking-tight">
                We've got <br className="hidden lg:block"/> the answers.
              </h2>
              <p className="text-lg text-[#384022]/80 font-medium leading-relaxed mb-10">
                Everything you need to know about the product and billing. Can't find the answer you're looking for?
              </p>

              {/* Premium Support Widget */}
              <div className="bg-white/80 backdrop-blur-md border border-[#224D59]/10 rounded-2xl p-6 shadow-[0_10px_40px_rgba(34,77,89,0.05)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#B8CC34]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  {/* Overlapping Avatar Bubbles */}
                  <div className="flex -space-x-3 mb-5">
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-[#224D59] flex items-center justify-center text-xs font-bold text-white shadow-sm z-30">A</div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-[#668824] flex items-center justify-center text-xs font-bold text-white shadow-sm z-20">B</div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-[#B8CC34] flex items-center justify-center text-xs font-bold text-[#224D59] shadow-sm z-10">C</div>
                  </div>
                  <h4 className="text-lg font-bold text-[#224D59] mb-2">Still have questions?</h4>
                  <p className="text-sm text-[#384022]/70 font-medium mb-5">
                    Our team is here to help you get the most out of Athenura.
                  </p>
                  <a href="#contact" className="inline-flex items-center text-sm font-bold text-[#668824] hover:text-[#224D59] transition-colors group/link">
                    Contact Support
                    <svg className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion List */}
          <div className="w-full lg:w-2/3 space-y-4 pt-2">
            {faqs.map((faq, index) => {
              const isActive = activeIndex === index;
              
              return (
                <div 
                  key={index}
                  data-id={`faq-${index}`}
                  className={`animate-on-scroll transition-all duration-700 ease-out ${
                    visibleItems[`faq-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div 
                    className={`relative bg-white/70 backdrop-blur-sm rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden group ${
                      isActive 
                        ? 'border-[#668824]/50 shadow-[0_15px_40px_rgba(34,77,89,0.08)] bg-white' 
                        : 'border-[#224D59]/10 hover:border-[#224D59]/20 hover:shadow-md hover:bg-white'
                    }`}
                    onClick={() => toggleFAQ(index)}
                  >
                    {/* Active State Accent Line */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-[#B8CC34] transition-transform duration-500 origin-top ${isActive ? 'scale-y-100' : 'scale-y-0'}`}></div>

                    {/* Question Header */}
                    <div className="px-6 py-6 sm:px-8 sm:py-7 flex justify-between items-center z-10 relative">
                      <h3 className={`text-base sm:text-lg font-bold pr-8 transition-colors duration-300 ${
                        isActive ? 'text-[#224D59]' : 'text-[#224D59]/80 group-hover:text-[#224D59]'
                      }`}>
                        {faq.question}
                      </h3>
                      
                      {/* Premium Morphing Plus/Minus Icon */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${
                        isActive ? 'bg-[#224D59] border-[#224D59] text-[#B8CC34] rotate-180' : 'bg-transparent border-[#224D59]/20 text-[#224D59] group-hover:bg-[#224D59]/5'
                      }`}>
                        <svg 
                          className={`w-4 h-4 transform transition-transform duration-500 ${isActive ? 'rotate-45' : 'rotate-0'}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
                        </svg>
                      </div>
                    </div>

                    {/* Answer Content (Smooth Grid Height Transition) */}
                    <div 
                      className={`grid transition-all duration-500 ease-in-out ${
                        isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0 text-[#384022]/70 font-medium leading-relaxed text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                    
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQ;