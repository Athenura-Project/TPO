import React from 'react';

const CTA = () => {
  return (
    <React.Fragment>
      {/* Call to Action Section - Dark Theme for high impact */}
      <section className="relative w-full py-20 lg:py-32 bg-[#111111] overflow-hidden">
        
        {/* Background decorative elements for premium dark feel */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-[#333333] mix-blend-screen filter blur-[120px] opacity-40"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-[#B8B2B2] mix-blend-screen filter blur-[150px] opacity-10"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#F3EFEF] leading-tight mb-6 tracking-tight">
            Ready to transform your <br className="hidden sm:block" />
            placement cell?
          </h2>
          
          <p className="text-lg md:text-xl text-[#B8B2B2] max-w-2xl mx-auto font-light mb-10 leading-relaxed">
            Join top institutions using Athenura to streamline their TPO management, track intern performance, and boost placement conversion rates.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Primary Action Button */}
            <a 
              href="/register" 
              className="w-full sm:w-auto px-10 py-4 rounded-lg bg-[#F3EFEF] text-[#111111] font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(243,239,239,0.3)] hover:bg-white text-center"
            >
              Get Started Now
            </a>
            
            {/* Secondary Action Button */}
            <a 
              href="/login" 
              className="w-full sm:w-auto px-10 py-4 rounded-lg bg-transparent border border-[#333333] text-[#F3EFEF] font-medium text-lg transition-all duration-300 transform hover:-translate-y-1 hover:border-[#B8B2B2] hover:bg-[#333333]/30 text-center"
            >
              Admin Login
            </a>
          </div>
          
          {/* Trust indicator or final micro-copy */}
          <div className="mt-10 flex items-center justify-center space-x-2 text-sm text-[#B8B2B2]/60">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <span>Secure & encrypted data architecture</span>
          </div>

        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-[#111111] border-t border-[#333333]/50 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
            
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-1">
              <a href="/" className="text-2xl font-extrabold text-[#F3EFEF] tracking-wide block mb-4">
                Athenura
              </a>
              <p className="text-[#B8B2B2] text-sm leading-relaxed mb-6">
                The ultimate MERN-stack powered Training & Placement Opportunity management system for modern institutions.
              </p>
            </div>
            
            {/* Quick Links Column */}
            <div className="col-span-1">
              <h4 className="text-[#F3EFEF] font-semibold mb-4 uppercase text-sm tracking-wider">Platform</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-[#B8B2B2] hover:text-[#F3EFEF] text-sm transition-colors duration-200">Features</a></li>
                <li><a href="#workflow" className="text-[#B8B2B2] hover:text-[#F3EFEF] text-sm transition-colors duration-200">How it Works</a></li>
                <li><a href="/login" className="text-[#B8B2B2] hover:text-[#F3EFEF] text-sm transition-colors duration-200">Dashboard</a></li>
              </ul>
            </div>
            
            {/* Resources Column */}
            <div className="col-span-1">
              <h4 className="text-[#F3EFEF] font-semibold mb-4 uppercase text-sm tracking-wider">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[#B8B2B2] hover:text-[#F3EFEF] text-sm transition-colors duration-200">Documentation</a></li>
                <li><a href="#" className="text-[#B8B2B2] hover:text-[#F3EFEF] text-sm transition-colors duration-200">API Reference</a></li>
                <li><a href="#" className="text-[#B8B2B2] hover:text-[#F3EFEF] text-sm transition-colors duration-200">Help Center</a></li>
              </ul>
            </div>
            
            {/* Contact Column */}
            <div className="col-span-1">
              <h4 className="text-[#F3EFEF] font-semibold mb-4 uppercase text-sm tracking-wider">Connect</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[#B8B2B2] hover:text-[#F3EFEF] text-sm transition-colors duration-200">Support</a></li>
                <li><a href="#" className="text-[#B8B2B2] hover:text-[#F3EFEF] text-sm transition-colors duration-200">Contact Sales</a></li>
              </ul>
            </div>
            
          </div>
          
          {/* Bottom Copyright Bar */}
          <div className="border-t border-[#333333] pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-[#B8B2B2] text-sm text-center md:text-left mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Athenura TPO System. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-[#B8B2B2] hover:text-[#F3EFEF] text-sm transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-[#B8B2B2] hover:text-[#F3EFEF] text-sm transition-colors duration-200">Terms of Service</a>
            </div>
          </div>
          
        </div>
      </footer>
    </React.Fragment>
  );
};

export default CTA;