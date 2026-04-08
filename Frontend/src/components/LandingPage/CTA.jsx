import React, { useEffect, useState } from 'react';

const CTA = () => {
  // State for scroll animations
  const [visibleItems, setVisibleItems] = useState({});

  useEffect(() => {
    // Setup Intersection Observer for smooth scroll reveals
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

  return (
    <React.Fragment>
      {/* Call to Action Section - Dark Teal Theme for high impact and contrast */}
      <section className="relative w-full py-20 lg:py-32 bg-[#224D59] overflow-hidden">
        
        {/* Background decorative elements for premium feel */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-[#B8CC34] mix-blend-overlay filter blur-[120px] opacity-30"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-[#668824] mix-blend-overlay filter blur-[150px] opacity-40"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <h2 
            data-id="cta-heading"
            className={`animate-on-scroll text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight transition-all duration-700 ease-out ${
              visibleItems['cta-heading'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            Ready to transform your <br className="hidden sm:block" />
            placement cell?
          </h2>
          
          <p 
            data-id="cta-desc"
            className={`animate-on-scroll text-lg md:text-xl text-[#F5F7F2]/80 max-w-2xl mx-auto font-medium mb-10 leading-relaxed transition-all duration-700 ease-out delay-150 ${
              visibleItems['cta-desc'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            Join top institutions using Athenura to streamline their TPO management, track intern performance, and boost placement conversion rates.
          </p>
          
          <div 
            data-id="cta-buttons"
            className={`animate-on-scroll flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 transition-all duration-700 ease-out delay-300 ${
              visibleItems['cta-buttons'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            {/* Primary Action Button - Lime Green for maximum pop */}
            <a 
              href="/register" 
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#B8CC34] text-[#224D59] font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(184,204,52,0.4)] hover:bg-[#cbe044] text-center"
            >
              Get Started Now
            </a>
            
            {/* Secondary Action Button - Transparent with white border */}
            <a 
              href="/login" 
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-transparent border-2 border-white/30 text-white font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:border-white hover:bg-white hover:text-[#224D59] hover:shadow-lg text-center"
            >
              Admin Login
            </a>
          </div>
          
          {/* Trust indicator or final micro-copy */}
          <div 
            data-id="cta-trust"
            className={`animate-on-scroll mt-10 flex items-center justify-center space-x-2 text-sm text-[#F5F7F2]/60 font-medium transition-all duration-700 ease-out delay-500 ${
              visibleItems['cta-trust'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <svg className="w-5 h-5 text-[#B8CC34]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <span>Secure & encrypted data architecture</span>
          </div>

        </div>
      </section>

      {/* Footer Section - Light Premium Theme with Staggered Reveals */}
      <footer className="bg-[#F5F7F2] border-t border-[#224D59]/10 pt-16 pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
            
            {/* Brand Column with Image Logo */}
            <div 
              data-id="foot-brand"
              className={`animate-on-scroll col-span-1 md:col-span-1 transition-all duration-700 ease-out ${
                visibleItems['foot-brand'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
            >
              <a href="/" className="block mb-6 transform transition-transform duration-300 hover:scale-105 origin-left w-fit">
                <img 
                  src="/Logo.png" 
                  alt="Athenura Logo" 
                  className="h-10 sm:h-12 w-auto object-contain scale-125 origin-left" 
                />
              </a>
              <p className="text-[#384022]/80 text-sm font-medium leading-relaxed mb-6">
                The ultimate MERN-stack powered Training & Placement Opportunity management system for modern institutions.
              </p>
            </div>
            
            {/* Quick Links Column */}
            <div 
              data-id="foot-links-1"
              className={`animate-on-scroll col-span-1 transition-all duration-700 ease-out delay-150 ${
                visibleItems['foot-links-1'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <h4 className="text-[#224D59] font-bold mb-4 uppercase text-sm tracking-wider">Platform</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="inline-block text-[#384022]/70 hover:text-[#668824] font-medium text-sm transition-all duration-300 hover:translate-x-1.5">Features</a></li>
                <li><a href="#workflow" className="inline-block text-[#384022]/70 hover:text-[#668824] font-medium text-sm transition-all duration-300 hover:translate-x-1.5">How it Works</a></li>
                <li><a href="/login" className="inline-block text-[#384022]/70 hover:text-[#668824] font-medium text-sm transition-all duration-300 hover:translate-x-1.5">Dashboard</a></li>
              </ul>
            </div>
            
            {/* Resources Column */}
            <div 
              data-id="foot-links-2"
              className={`animate-on-scroll col-span-1 transition-all duration-700 ease-out delay-300 ${
                visibleItems['foot-links-2'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <h4 className="text-[#224D59] font-bold mb-4 uppercase text-sm tracking-wider">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="inline-block text-[#384022]/70 hover:text-[#668824] font-medium text-sm transition-all duration-300 hover:translate-x-1.5">Documentation</a></li>
                <li><a href="#" className="inline-block text-[#384022]/70 hover:text-[#668824] font-medium text-sm transition-all duration-300 hover:translate-x-1.5">API Reference</a></li>
                <li><a href="#" className="inline-block text-[#384022]/70 hover:text-[#668824] font-medium text-sm transition-all duration-300 hover:translate-x-1.5">Help Center</a></li>
              </ul>
            </div>
            
            {/* Contact Column */}
            <div 
              data-id="foot-links-3"
              className={`animate-on-scroll col-span-1 transition-all duration-700 ease-out delay-500 ${
                visibleItems['foot-links-3'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <h4 className="text-[#224D59] font-bold mb-4 uppercase text-sm tracking-wider">Connect</h4>
              <ul className="space-y-3">
                <li><a href="#" className="inline-block text-[#384022]/70 hover:text-[#668824] font-medium text-sm transition-all duration-300 hover:translate-x-1.5">Support</a></li>
                <li><a href="#" className="inline-block text-[#384022]/70 hover:text-[#668824] font-medium text-sm transition-all duration-300 hover:translate-x-1.5">Contact Sales</a></li>
              </ul>
            </div>
            
          </div>
          
          {/* Bottom Copyright Bar */}
          <div 
            data-id="foot-bottom"
            className={`animate-on-scroll border-t border-[#224D59]/10 pt-8 flex flex-col md:flex-row items-center justify-between transition-all duration-1000 ease-out delay-700 ${
              visibleItems['foot-bottom'] ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <p className="text-[#384022]/60 font-medium text-sm text-center md:text-left mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Athenura TPO System. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {/* Linked to Privacy Policy page */}
              <a href="/privacy-policy" className="text-[#384022]/60 hover:text-[#668824] font-medium text-sm transition-colors duration-200 hover:underline underline-offset-4">Privacy Policy</a>
              {/* Linked to Terms of Service page */}
              <a href="/terms-of-service" className="text-[#384022]/60 hover:text-[#668824] font-medium text-sm transition-colors duration-200 hover:underline underline-offset-4">Terms of Service</a>
            </div>
          </div>
          
        </div>
      </footer>
    </React.Fragment>
  );
};

export default CTA;