import React, { useEffect, useState } from 'react';
import Navbar from '../components/LandingPage/Navbar';
import Footer from '../components/LandingPage/Footer';
import FadeInUp from '../components/FadeInUp';

const LegalPrivacy = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [activeSection, setActiveSection] = useState('introduction');

  const policySections = [
    { id: "introduction", title: "1. Introduction" },
    { id: "data-collection", title: "2. Information We Collect" },
    { id: "data-usage", title: "3. How We Use Your Data" },
    { id: "data-sharing", title: "4. Data Sharing & Disclosure" },
    { id: "data-security", title: "5. Data Security" },
    { id: "user-rights", title: "6. Your Rights" },
    { id: "contact", title: "7. Contact Us" }
  ];

  useEffect(() => {
    // Quick fade-in effect on mount
    const timer = setTimeout(() => setFadeIn(true), 100);
    
    // Bulletproof Scroll Logic for Table of Contents
    const handleScroll = () => {
      // Find all section elements
      const sections = policySections.map(section => document.getElementById(section.id));
      
      let currentActive = 'introduction'; // Default to first section
      
      // Loop through sections to find which one is currently in view
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section) {
          const sectionTop = section.offsetTop;
          // 250px buffer allows the section to activate right as it comes into the reading area
          if (window.scrollY >= sectionTop - 250) {
            currentActive = section.id;
          }
        }
      }
      
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    // Call once to set initial state
    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`min-h-screen bg-[#F5F7F2] pt-24 relative transition-opacity duration-700 ease-out ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <Navbar />
      {/* Background Elements Wrapper */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Ultra-Premium Subtle Dotted Grid Background */}
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ 
            backgroundImage: 'radial-gradient(#224D59 2px, transparent 2px)', 
            backgroundSize: '30px 30px' 
          }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#224D59]/5 to-transparent"></div>
        <div className="absolute top-1/4 right-[-10%] w-[500px] h-[500px] bg-[#B8CC34]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] bg-[#224D59]/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-10">
        
        {/* Page Header */}
          <a href="/" className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-[#224D59]/10 text-sm font-bold text-[#224D59] hover:bg-[#F5F7F2] hover:border-[#B8CC34]/50 transition-all duration-300 mb-8 group shadow-sm">
            <svg className="w-4 h-4 mr-2 text-[#668824] transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Home
          </a>
          <FadeInUp>
        <div className="mb-12 lg:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center text-[#224D59] tracking-tight mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-[#384022]/70 font-medium flex items-center justify-center">
            <span className="text-[#B8CC34] mx-1">•</span> 
            <span className="ml-3">Updated: April 10, 2026</span>
          </p>
        </div>
        </FadeInUp>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-12 items-start relative">
          
          {/* Interactive Sticky Sidebar (Table of Contents) */}
          <aside className="hidden lg:block w-1/4 sticky top-28 self-start flex-shrink-0 z-20">
            <div className="bg-white/60 backdrop-blur-xl border border-[#224D59]/10 rounded-3xl p-6 shadow-[0_10px_30px_rgba(34,77,89,0.03)] relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B8CC34] to-[#224D59] opacity-80"></div>
              <h3 className="text-xs font-black text-[#224D59] uppercase tracking-widest mb-5 mt-2">Contents</h3>
              <nav className="space-y-1.5 relative border-l-2 border-[#224D59]/10 pl-4 ml-2">
                {policySections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <a 
                      key={section.id} 
                      href={`#${section.id}`}
                      className={`block px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-300 relative ${
                        isActive 
                          ? 'text-[#224D59] bg-white shadow-sm border border-[#224D59]/5 scale-105 origin-left' 
                          : 'text-[#384022]/60 hover:text-[#668824] hover:bg-white/70'
                      }`}
                    >
                      {/* Active Indicator Dot */}
                      {isActive && (
                        <span className="absolute -left-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#B8CC34] shadow-[0_0_8px_#B8CC34]"></span>
                      )}
                      {section.title}
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Privacy Content Area */}
          <main className="w-full lg:w-3/4 bg-white/90 backdrop-blur-sm border border-[#224D59]/5 rounded-[2rem] p-8 sm:p-12 md:p-16 shadow-[0_20px_50px_rgba(34,77,89,0.05)] z-10">
            
            <div className="prose prose-lg max-w-none text-[#384022]/80">
              
              <section id="introduction" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-[#224D59] mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-[#F5F7F2] text-[#B8CC34] flex items-center justify-center mr-4 text-base shadow-inner border border-[#224D59]/5">1</span>
                  Introduction
                </h2>
                <p className="leading-relaxed mb-4 font-medium">
                  Welcome to Athenura ("we," "our," or "us"). We are committed to protecting the privacy and security of the data entrusted to our Training & Placement Operations (TPO) platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                </p>
                <p className="leading-relaxed font-medium">
                  By accessing or using Athenura, you agree to the practices described in this policy. If you do not agree with this policy, please do not use our platform.
                </p>
              </section>

              <div className="w-full h-px bg-gradient-to-r from-[#224D59]/5 via-[#224D59]/10 to-transparent my-12"></div>

              <section id="data-collection" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-[#224D59] mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-[#F5F7F2] text-[#B8CC34] flex items-center justify-center mr-4 text-base shadow-inner border border-[#224D59]/5">2</span>
                  Information We Collect
                </h2>
                <p className="leading-relaxed mb-6 font-medium">
                  To provide you with our comprehensive placement management tools, we collect several types of information:
                </p>
                <div className="bg-[#F5F7F2]/50 rounded-2xl p-6 border border-[#224D59]/5">
                  <ul className="list-none space-y-4 font-medium m-0 p-0">
                    <li className="flex items-start">
                      <span className="text-[#B8CC34] mr-3 mt-1 text-xl leading-none">•</span>
                      <span><strong className="text-[#224D59]">Account Information:</strong> Name, email address, institutional affiliation, and role (e.g., Administrator, Intern) when you register.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#B8CC34] mr-3 mt-1 text-xl leading-none">•</span>
                      <span><strong className="text-[#224D59]">Placement Data:</strong> Institutional data uploaded via CSV/Excel, including student details, corporate leads, and follow-up statuses.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#B8CC34] mr-3 mt-1 text-xl leading-none">•</span>
                      <span><strong className="text-[#224D59]">Usage Data:</strong> Information about how you interact with our dashboard, including login times, feature usage, and communication logs.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#B8CC34] mr-3 mt-1 text-xl leading-none">•</span>
                      <span><strong className="text-[#224D59]">Device Information:</strong> IP address, browser type, and operating system used to access the platform.</span>
                    </li>
                  </ul>
                </div>
              </section>

              <div className="w-full h-px bg-gradient-to-r from-[#224D59]/5 via-[#224D59]/10 to-transparent my-12"></div>

              <section id="data-usage" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-[#224D59] mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-[#F5F7F2] text-[#B8CC34] flex items-center justify-center mr-4 text-base shadow-inner border border-[#224D59]/5">3</span>
                  How We Use Your Data
                </h2>
                <p className="leading-relaxed mb-6 font-medium">
                  We use the collected information strictly for the purpose of providing and improving the Athenura platform:
                </p>
                <div className="bg-[#F5F7F2]/50 rounded-2xl p-6 border border-[#224D59]/5">
                  <ul className="list-none space-y-4 font-medium m-0 p-0">
                    <li className="flex items-start"><span className="text-[#668824] mr-3 mt-1 text-xl leading-none">✓</span> To authenticate users and provide role-based workspace access.</li>
                    <li className="flex items-start"><span className="text-[#668824] mr-3 mt-1 text-xl leading-none">✓</span> To process bulk data imports and assign placement opportunities.</li>
                    <li className="flex items-start"><span className="text-[#668824] mr-3 mt-1 text-xl leading-none">✓</span> To send automated reminders and notifications regarding pending leads.</li>
                    <li className="flex items-start"><span className="text-[#668824] mr-3 mt-1 text-xl leading-none">✓</span> To generate performance analytics and conversion reports for administrators.</li>
                    <li className="flex items-start"><span className="text-[#668824] mr-3 mt-1 text-xl leading-none">✓</span> To maintain platform security and prevent unauthorized access.</li>
                  </ul>
                </div>
              </section>

              <div className="w-full h-px bg-gradient-to-r from-[#224D59]/5 via-[#224D59]/10 to-transparent my-12"></div>

              <section id="data-sharing" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-[#224D59] mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-[#F5F7F2] text-[#B8CC34] flex items-center justify-center mr-4 text-base shadow-inner border border-[#224D59]/5">4</span>
                  Data Sharing & Disclosure
                </h2>
                <p className="leading-relaxed mb-6 font-medium">
                  We treat institutional data with the highest level of confidentiality. We do not sell, rent, or trade your personal or institutional data to third parties. We may share information only in the following circumstances:
                </p>
                <div className="space-y-4">
                  <div className="p-5 rounded-xl border border-[#224D59]/10 hover:border-[#B8CC34]/50 transition-colors bg-white shadow-sm">
                    <strong className="text-[#224D59] block mb-1">Service Providers:</strong>
                    <span className="font-medium text-[#384022]/80">With trusted third-party vendors who assist in operating our platform (e.g., cloud hosting, email delivery), subject to strict data processing agreements.</span>
                  </div>
                  <div className="p-5 rounded-xl border border-[#224D59]/10 hover:border-[#B8CC34]/50 transition-colors bg-white shadow-sm">
                    <strong className="text-[#224D59] block mb-1">Legal Compliance:</strong>
                    <span className="font-medium text-[#384022]/80">If required to do so by law or in response to valid requests by public authorities.</span>
                  </div>
                  <div className="p-5 rounded-xl border border-[#224D59]/10 hover:border-[#B8CC34]/50 transition-colors bg-white shadow-sm">
                    <strong className="text-[#224D59] block mb-1">Institutional Boundaries:</strong>
                    <span className="font-medium text-[#384022]/80">Data is shared internally within your registered institution based on the role hierarchy (Admins can view intern data).</span>
                  </div>
                </div>
              </section>

              <div className="w-full h-px bg-gradient-to-r from-[#224D59]/5 via-[#224D59]/10 to-transparent my-12"></div>

              <section id="data-security" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-[#224D59] mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-[#F5F7F2] text-[#B8CC34] flex items-center justify-center mr-4 text-base shadow-inner border border-[#224D59]/5">5</span>
                  Data Security
                </h2>
                <p className="leading-relaxed mb-4 font-medium">
                  Security is paramount at Athenura. We implement industry-standard administrative, technical, and physical security measures to protect your information. This includes data encryption in transit and at rest, secure server architectures, and regular security audits. However, please be aware that no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <div className="w-full h-px bg-gradient-to-r from-[#224D59]/5 via-[#224D59]/10 to-transparent my-12"></div>

              <section id="user-rights" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-[#224D59] mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-[#F5F7F2] text-[#B8CC34] flex items-center justify-center mr-4 text-base shadow-inner border border-[#224D59]/5">6</span>
                  Your Rights
                </h2>
                <p className="leading-relaxed mb-4 font-medium">
                  Depending on your jurisdiction, you may have the right to access, correct, update, or request deletion of your personal data. Administrators have the capability to manage and delete institutional data directly through the Athenura dashboard. If you require assistance with data management, please contact our support team.
                </p>
              </section>

              <div className="w-full h-px bg-gradient-to-r from-[#224D59]/5 via-[#224D59]/10 to-transparent my-12"></div>

              <section id="contact" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-[#224D59] mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-[#F5F7F2] text-[#B8CC34] flex items-center justify-center mr-4 text-base shadow-inner border border-[#224D59]/5">7</span>
                  Contact Us
                </h2>
                <p className="leading-relaxed mb-8 font-medium">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please reach out to us:
                </p>
                
                <div className="bg-gradient-to-br from-[#224D59] to-[#1A3A43] p-8 rounded-3xl shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#B8CC34] rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                      <p className="font-bold text-white text-xl mb-2">Athenura Privacy Team</p>
                      <p className="text-[#F5F7F2]/80 font-medium mb-1 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-[#B8CC34]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        privacy@athenura.com
                      </p>
                      <p className="text-[#F5F7F2]/80 font-medium flex items-center">
                        <svg className="w-4 h-4 mr-2 text-[#B8CC34]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        support.athenura.com
                      </p>
                    </div>
                    
                    <a href="mailto:privacy@athenura.com" className="px-6 py-3 bg-[#B8CC34] text-[#224D59] font-bold rounded-xl hover:bg-white transition-colors duration-300 shadow-md whitespace-nowrap">
                      Send an Email
                    </a>
                  </div>
                </div>
              </section>

            </div>
          </main>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LegalPrivacy;
