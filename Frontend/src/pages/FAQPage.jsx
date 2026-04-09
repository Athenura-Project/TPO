import React, { useState, useEffect, useRef } from 'react';

const FAQPage = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [activeCategory, setActiveCategory] = useState('general');
  // Track which specific question is open. Store as "categoryIndex-questionIndex"
  const [openQuestion, setOpenQuestion] = useState('0-0'); 
  const mainContentRef = useRef(null);

  useEffect(() => {
    // Quick fade-in effect on mount
    const timer = setTimeout(() => setFadeIn(true), 100);

    // Precise Scroll Tracking Logic for Sticky Sidebar
    const handleScroll = () => {
      const categories = faqData.map(cat => document.getElementById(cat.id));
      let currentActive = faqData[0].id;
      
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        if (category) {
          // Adjust 150 buffer so the active state switches slightly before the title hits the very top
          const categoryTop = category.getBoundingClientRect().top;
          if (categoryTop <= 150) { 
            currentActive = category.id;
          }
        }
      }
      setActiveCategory(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  // Smooth scroll handler for sidebar links
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header/spacing
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Athenura Specific FAQ Data Document
  const faqData = [
    {
      id: "general",
      title: "General",
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      questions: [
        {
          q: "What makes Athenura different from regular CRMs?",
          a: "Athenura is purpose-built specifically for Training & Placement Operations (TPO). Unlike generic CRMs, it features role-based workspaces for admins and interns, automated follow-up reminders tailored for corporate outreach, and instant bulk import for institutional data."
        },
        {
          q: "Who is this platform for?",
          a: "It is designed for modern educational institutions, placement officers (Admins), and student coordinators (Interns) who want to streamline their outreach to companies and track placement conversions effectively."
        }
      ]
    },
    {
      id: "administrators",
      title: "For Administrators",
      icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
      questions: [
        {
          q: "How do I upload student and placement lead data?",
          a: "You can seamlessly upload CSV or Excel files. Our system automatically parses the document, skips duplicate entries, and populates your secure database within seconds, completely eliminating manual entry."
        },
        {
          q: "Can I track the performance of individual interns?",
          a: "Yes! The admin dashboard provides a bird's-eye view of your entire operation. You can visualize conversion rates, track daily activity levels of specific interns, and analyze monthly trends through interactive charts."
        },
        {
          q: "How do I assign opportunities to interns?",
          a: "From your workspace, you can select multiple corporate leads or TPOs and assign them to specific interns with a single click. The system instantly notifies the intern about their newly allocated targets."
        }
      ]
    },
    {
      id: "interns",
      title: "For Interns",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      questions: [
        {
          q: "How do the automated reminders work?",
          a: "The system actively tracks your pending leads. If you have a scheduled follow-up, Athenura will automatically send a daily notification at 8 AM directly to your dashboard, ensuring no opportunity slips through the cracks."
        },
        {
          q: "How do I update the status of a lead?",
          a: "Inside your personalized intern dashboard, you can click on any assigned company lead, add communication logs, and change the status (e.g., Pending, Contacted, Converted). These updates reflect in real-time for the admin."
        }
      ]
    },
    {
      id: "security",
      title: "Security & Data",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      questions: [
        {
          q: "Is the institutional data completely secure?",
          a: "Absolutely. Security is our top priority. Athenura uses industry-standard encryption for data at rest and in transit. We have strict data architectures to prevent any unauthorized access."
        },
        {
          q: "Who can see the data I upload?",
          a: "We implement strict role-based access control. Interns can only see the specific corporate leads and student data assigned to them. Administrators have full oversight of the institution's workspace."
        }
      ]
    }
  ];

  return (
    <div className={`min-h-screen bg-[#F5F7F2] pt-24 pb-20 relative transition-opacity duration-700 ease-out ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Background Wrapper (Fixes sticky scrolling issues) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Dotted Grid Background */}
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ 
            backgroundImage: 'radial-gradient(#224D59 2px, transparent 2px)', 
            backgroundSize: '30px 30px' 
          }}
        ></div>
        {/* Soft Ambient Glows */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#224D59]/5 to-transparent"></div>
        <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-[#B8CC34]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-[-10%] w-[600px] h-[600px] bg-[#224D59]/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="max-w-3xl mb-12 lg:mb-20 pt-8 text-center md:text-left">
          <a href="/" className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-[#224D59]/10 text-sm font-bold text-[#224D59] hover:bg-[#F5F7F2] hover:border-[#B8CC34]/50 transition-all duration-300 mb-8 group shadow-sm">
            <svg className="w-4 h-4 mr-2 text-[#668824] transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Home
          </a>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#224D59] tracking-tight mb-6">
            Help Center & FAQ
          </h1>
          <p className="text-lg md:text-xl text-[#384022]/70 font-medium leading-relaxed">
            Everything you need to know about Athenura. Learn how to manage placements, onboard interns, and secure your institutional data.
          </p>
        </div>

        {/* Main Content Layout (Sidebar + Content) */}
        <div className="flex flex-col lg:flex-row gap-12 items-start relative">
          
          {/* Sticky Sidebar Navigation */}
          <aside className="hidden lg:block w-1/4 sticky top-28 self-start flex-shrink-0 z-20">
            <div className="bg-white/60 backdrop-blur-xl border border-[#224D59]/10 rounded-3xl p-6 shadow-[0_10px_30px_rgba(34,77,89,0.03)] relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B8CC34] to-[#224D59] opacity-80"></div>
              <h3 className="text-xs font-black text-[#224D59] uppercase tracking-widest mb-5 mt-2">Categories</h3>
              
              <nav className="space-y-2 relative border-l-2 border-[#224D59]/10 pl-4 ml-2">
                {faqData.map((category) => {
                  const isActive = activeCategory === category.id;
                  return (
                    <a 
                      key={category.id} 
                      href={`#${category.id}`}
                      onClick={(e) => scrollToSection(e, category.id)}
                      className={`flex items-center px-3 py-3 text-sm font-semibold rounded-xl transition-all duration-300 relative ${
                        isActive 
                          ? 'text-[#224D59] bg-white shadow-sm border border-[#224D59]/5 scale-105 origin-left' 
                          : 'text-[#384022]/60 hover:text-[#668824] hover:bg-white/70'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute -left-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#B8CC34] shadow-[0_0_8px_#B8CC34]"></span>
                      )}
                      <svg className={`w-4 h-4 mr-3 ${isActive ? 'text-[#B8CC34]' : 'text-current opacity-70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={category.icon}></path>
                      </svg>
                      {category.title}
                    </a>
                  );
                })}
              </nav>
            </div>
            
            {/* Contact Support Widget */}
            <div className="mt-6 bg-gradient-to-br from-[#224D59] to-[#1A3A43] rounded-3xl p-6 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B8CC34] rounded-full blur-3xl opacity-20 pointer-events-none"></div>
              <div className="relative z-10">
                <h4 className="text-white font-bold mb-2">Still need help?</h4>
                <p className="text-[#F5F7F2]/70 text-sm font-medium mb-4">Our support team is ready to assist your institution.</p>
                <a href="mailto:support@athenura.com" className="block w-full py-2.5 px-4 bg-[#B8CC34] text-[#224D59] text-sm font-bold text-center rounded-xl hover:bg-white transition-colors duration-300 shadow-sm">
                  Contact Support
                </a>
              </div>
            </div>
          </aside>

          {/* FAQ Accordion Content */}
          <main className="w-full lg:w-3/4 z-10 space-y-16 pb-10" ref={mainContentRef}>
            {faqData.map((category, catIndex) => (
              <section 
                key={category.id} 
                id={category.id} 
                className="scroll-mt-32"
              >
                <div className="flex items-center mb-8">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#224D59]/10 shadow-sm flex items-center justify-center mr-4 text-[#B8CC34]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={category.icon}></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#224D59]">{category.title}</h2>
                </div>
                
                <div className="space-y-4">
                  {category.questions.map((item, qIndex) => {
                    const uniqueId = `${catIndex}-${qIndex}`;
                    const isOpen = openQuestion === uniqueId;
                    
                    return (
                      <div 
                        key={qIndex}
                        className={`bg-white/80 backdrop-blur-sm rounded-2xl border transition-all duration-300 overflow-hidden group cursor-pointer ${
                          isOpen 
                            ? 'border-[#B8CC34]/60 shadow-[0_15px_40px_rgba(34,77,89,0.06)] bg-white' 
                            : 'border-[#224D59]/5 hover:border-[#224D59]/20 hover:shadow-md'
                        }`}
                        onClick={() => toggleQuestion(uniqueId)}
                      >
                        {/* Question Header */}
                        <div className="px-6 py-5 sm:px-8 sm:py-6 flex justify-between items-center z-10 relative">
                          <h3 className={`text-base sm:text-lg font-bold pr-8 transition-colors duration-300 ${
                            isOpen ? 'text-[#224D59]' : 'text-[#224D59]/80 group-hover:text-[#224D59]'
                          }`}>
                            {item.q}
                          </h3>
                          
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 border ${
                            isOpen ? 'bg-[#224D59] border-[#224D59] text-[#B8CC34] rotate-180' : 'bg-[#F5F7F2] border-transparent text-[#224D59] group-hover:bg-[#224D59]/5'
                          }`}>
                            <svg className={`w-4 h-4 transform transition-transform duration-500 ${isOpen ? 'rotate-45' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
                            </svg>
                          </div>
                        </div>

                        {/* Answer Content (Smooth Expand/Collapse) */}
                        <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                          <div className="overflow-hidden">
                            <p className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0 text-[#384022]/70 font-medium leading-relaxed text-base">
                              {item.a}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}

            {/* Bottom Call to Action for unresolved queries */}
            <div className="mt-16 pt-10 border-t border-[#224D59]/10 text-center">
              <h3 className="text-2xl font-bold text-[#224D59] mb-4">Didn't find your answer?</h3>
              <p className="text-[#384022]/70 font-medium mb-8">Reach out to our support team and we'll get back to you shortly.</p>
              <a href="mailto:support@athenura.com" className="inline-flex items-center px-8 py-3.5 rounded-xl bg-white border border-[#224D59]/20 text-[#224D59] font-bold text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#B8CC34]/50 group">
                <svg className="w-5 h-5 mr-3 text-[#B8CC34]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Send us an Email
              </a>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;