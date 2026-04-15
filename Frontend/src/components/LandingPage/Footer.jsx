import { useEffect, useRef, useState } from "react";
import { ExternalLink, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const [visibleItems, setVisibleItems] = useState({});
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => ({
              ...prev,
              [entry.target.dataset.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <footer className="bg-[#F5F7F2] border-t border-[#224D59]/10 pt-16 pb-8 overflow-hidden">
      {/* 🚀 MAX-WIDTH REMOVED: Ab ye har screen par 100% stretch hoga minimal padding ke sath */}
      <div className="w-full px-5 sm:px-8 lg:px-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">

          <div
            data-id="foot-brand"
            className={`animate-on-scroll col-span-1 md:col-span-1 transition-all duration-700 ease-out ${
              visibleItems["foot-brand"]
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <a
              href="/"
              className="block mb-6 transform transition-transform duration-300 hover:scale-105 origin-left w-fit"
            >
              <img
                src="/Logo.png"
                alt="Athenura Logo"
                className="h-10 sm:h-12 w-auto object-contain scale-125 origin-left"
              />
            </a>
            <p className="text-[#384022]/80 text-sm font-medium leading-relaxed mb-6">
              The ultimate MERN-stack powered Training & Placement Opportunity
              management system for modern institutions.
            </p>
          </div>

          <div
            data-id="foot-links-1"
            className={`animate-on-scroll col-span-1 transition-all duration-700 ease-out delay-150 ${
              visibleItems["foot-links-1"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h4 className="text-[#224D59] font-bold mb-4 uppercase text-sm tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
              <a  
                  href="/"
                  className="inline-block text-[#384022]/70 hover:text-[#668824] font-medium text-sm transition-all duration-300 hover:translate-x-1.5"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="inline-block text-[#384022]/70 hover:text-[#668824] font-medium text-sm transition-all duration-300 hover:translate-x-1.5"
                >
                  about
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="inline-block text-[#384022]/70 hover:text-[#668824] font-medium text-sm transition-all duration-300 hover:translate-x-1.5"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="inline-block text-[#384022]/70 hover:text-[#668824] font-medium text-sm transition-all duration-300 hover:translate-x-1.5"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

{/* contact */}
          <div 
              data-id="foot-links-2"
              className={`animate-on-scroll col-span-1 transition-all duration-700 ease-out delay-300 ${
                visibleItems['foot-links-2'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <h4 className="text-[#224D59] font-bold mb-4 uppercase text-sm tracking-wider">Contact</h4>
              <ul className="flex flex-col gap-3">
                <li><a href="mailto:official@athenura.in"
                className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-[#224D59]/10
        bg-white hover:border-[#224D59]/25 hover:shadow-sm
        transition-all duration-300 hover:-translate-y-0.5">
          <div className='w-9 h-9 rounded-lg bg-[#224D59]/8 flex items-center justify-center shrink-0
        group-hover:bg-[#224D59]/15 transition-colors duration-300'>
            <Mail size={15} strokeWidth={1.8} className="text-[#224D59]" />
          </div>
          <div className='flex flex-col min-w-0'>
            <span className='text-[10px] font-semibold tracking-widest text-[#384022]/50 uppercase'>EMAIL</span>
            <span className='text-sm font-bold text-[#224D59] truncate'>official@athenura.in</span>
          </div>
          <ExternalLink size={15} strokeWidth={2} className="ml-auto text-[#384022]/30 group-hover:text-[#224D59] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0" />
        </a>
        </li>
        <li><a href="tel:+919835051934"
         className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-[#224D59]/10
        bg-white hover:border-[#224D59]/25 hover:shadow-sm
        transition-all duration-300 hover:-translate-y-0.5">
           <div className="w-9 h-9 rounded-lg bg-[#224D59]/8 flex items-center justify-center shrink-0
        group-hover:bg-[#224D59]/15 transition-colors duration-300">
        <Phone size={15} strokeWidth={1.8} className="text-[#224D59]" />
      </div>
       <div className="flex flex-col min-w-0">
        <span className="text-[10px] font-semibold tracking-widest text-[#384022]/50 uppercase">
          PHONE
        </span>
        <span className="text-sm font-bold text-[#224D59] truncate">
          +91 98350 51934
        </span>
      </div>
       <ExternalLink size={12} strokeWidth={2} className="ml-auto text-[#384022]/30 group-hover:text-[#224D59] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0" />
          </a></li>
                
              </ul>
            </div>

          <div
            data-id="foot-links-3"
            className={`animate-on-scroll col-span-1 transition-all duration-700 ease-out delay-500 ${
              visibleItems["foot-links-3"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h4 className="text-[#224D59] font-bold mb-4 uppercase text-sm tracking-wider">
              Location
            </h4>
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm h-36 w-56">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d21342.615133051324!2d77.364122!3d28.618435!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2cb70326146a27db%3A0x39227c4340f97501!2sAthenura!5e1!3m2!1sen!2sin!4v1775892049914!5m2!1sen!2sin"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  />
</div>
          </div>

        </div>

        <div
          data-id="foot-bottom"
          className={`animate-on-scroll border-t border-[#224D59]/10 pt-8 flex flex-col md:flex-row items-center justify-between transition-all duration-1000 ease-out delay-700 ${
            visibleItems["foot-bottom"] ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-[#384022]/60 font-medium text-sm text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Athenura TPO System. All rights
            reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="/privacy-policy"
              className="text-[#384022]/60 hover:text-[#668824] font-medium text-sm transition-colors duration-200 hover:underline underline-offset-4"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="text-[#384022]/60 hover:text-[#668824] font-medium text-sm transition-colors duration-200 hover:underline underline-offset-4"
            >
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}