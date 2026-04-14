import { useEffect, useRef, useState } from "react";

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
              Platform
            </h4>
            <ul className="space-y-3">
              <li>
              <a  
                  href="#features"
                  className="inline-block text-[#384022]/70 hover:text-[#668824] font-medium text-sm transition-all duration-300 hover:translate-x-1.5"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#workflow"
                  className="inline-block text-[#384022]/70 hover:text-[#668824] font-medium text-sm transition-all duration-300 hover:translate-x-1.5"
                >
                  How it Works
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="inline-block text-[#384022]/70 hover:text-[#668824] font-medium text-sm transition-all duration-300 hover:translate-x-1.5"
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          <div
            data-id="foot-links-2"
            className={`animate-on-scroll col-span-1 transition-all duration-700 ease-out delay-300 ${
              visibleItems["foot-links-2"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h4 className="text-[#224D59] font-bold mb-4 uppercase text-sm tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="inline-block text-[#384022]/70 hover:text-[#668824] font-medium text-sm transition-all duration-300 hover:translate-x-1.5"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-block text-[#384022]/70 hover:text-[#668824] font-medium text-sm transition-all duration-300 hover:translate-x-1.5"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="inline-block text-[#384022]/70 hover:text-[#668824] font-medium text-sm transition-all duration-300 hover:translate-x-1.5"
                >
                  Help Center
                </a>
              </li>
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
              Connect
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="inline-block text-[#384022]/70 hover:text-[#668824] font-medium text-sm transition-all duration-300 hover:translate-x-1.5"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-block text-[#384022]/70 hover:text-[#668824] font-medium text-sm transition-all duration-300 hover:translate-x-1.5"
                >
                  Contact Sales
                </a>
              </li>
            </ul>
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