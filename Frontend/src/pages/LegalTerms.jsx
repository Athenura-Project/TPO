import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/LandingPage/Navbar";
import Footer from "../components/LandingPage/Footer";
import { useEffect, useRef, useState } from "react";
import FadeInUp from "../components/FadeInUp";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: (
      <>
        <p className="text-sm text-[#384022]/70 leading-relaxed">
          By accessing or using the Athenura Training & Placement Operations
          (TPO) platform, you agree to be bound by these Terms of Service. If
          you do not agree with any part of these terms, you may not access or
          use our platform.
        </p>
        <p className="text-sm text-[#384022]/70 leading-relaxed mt-3">
          These terms apply to all users including Administrators, Interns, and
          any institutional representatives using the Athenura platform in any
          capacity.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Eligibility & Account Registration",
    content: (
      <>
        <p className="text-sm text-[#384022]/70 leading-relaxed mb-4">
          To use Athenura, you must meet the following requirements:
        </p>
        <ul className="flex flex-col gap-3">
          {[
            "You must be affiliated with a registered institution or organization using the Athenura platform.",
            "Admin accounts require a valid Admin Secret Key issued by your institution.",
            "You are responsible for maintaining the confidentiality of your credentials.",
            "You agree to provide accurate, current, and complete information during registration.",
            "Each user may only maintain one active account on the platform.",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-[#384022]/70 leading-relaxed"
            >
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#b3c633] shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "platform-use",
    title: "Permitted Use of the Platform",
    content: (
      <>
        <p className="text-sm text-[#384022]/70 leading-relaxed mb-4">
          Athenura is designed exclusively for managing Training & Placement
          Operations. You agree to use the platform only for its intended
          purposes.
        </p>
        <div className="flex flex-col gap-3">
          {[
            {
              label: "Permitted:",
              text: "Managing intern profiles, uploading placement data, tracking leads, generating reports, and communicating within the platform ecosystem.",
            },
            {
              label: "Not Permitted:",
              text: "Using the platform to store unrelated data, attempting to gain unauthorized access, reverse engineering any part of the system, or using automated bots to interact with the platform.",
            },
          ].map((item) => (
            <div key={item.label} className="pl-4 border-l-2 border-[#0d9488]">
              <span className="text-xs font-bold text-[#224D59] uppercase tracking-wider">
                {item.label}
              </span>
              <p className="text-sm text-[#384022]/70 leading-relaxed mt-1">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "data-ownership",
    title: "Data Ownership & Responsibility",
    content: (
      <>
        <p className="text-sm text-[#384022]/70 leading-relaxed mb-4">
          All institutional data uploaded to Athenura remains the property of
          the respective institution. Athenura acts solely as a data processor.
        </p>
        <ul className="flex flex-col gap-3">
          {[
            "Institutions retain full ownership of all placement data, intern records, and corporate leads they upload.",
            "Athenura will not sell, rent, or transfer institutional data to any third party without explicit consent.",
            "Administrators are responsible for the accuracy and legality of data they upload via CSV/Excel imports.",
            "Users are responsible for any content or communications made through their accounts.",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-[#384022]/70 leading-relaxed"
            >
              <span className="text-[#0d9488] mt-0.5 shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: (
      <>
        <p className="text-sm text-[#384022]/70 leading-relaxed">
          The Athenura platform, including its interface, codebase, branding,
          and all associated materials, is the exclusive intellectual property
          of Athenura and its founders. All rights are reserved.
        </p>
        <p className="text-sm text-[#384022]/70 leading-relaxed mt-3">
          You may not copy, reproduce, distribute, modify, or create derivative
          works from any part of the Athenura platform without prior written
          consent. The Athenura name, logo, and product identity may not be used
          in connection with any other product or service.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    title: "Account Suspension & Termination",
    content: (
      <>
        <p className="text-sm text-[#384022]/70 leading-relaxed mb-4">
          Athenura reserves the right to suspend or terminate accounts under the
          following circumstances:
        </p>
        <div className="flex flex-col gap-3">
          {[
            {
              label: "Policy Violation",
              text: "Any breach of these Terms of Service or our Privacy Policy may result in immediate account suspension.",
            },
            {
              label: "Fraudulent Activity",
              text: "Accounts found engaging in fraudulent behavior, data manipulation, or unauthorized access attempts will be permanently banned.",
            },
            {
              label: "Institutional Request",
              text: "Administrators may deactivate intern accounts within their institutional boundary at any time.",
            },
          ].map((item) => (
            <div key={item.label} className="bg-[#f0f7f4] rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-[#224D59] uppercase tracking-wider">
                {item.label}
              </span>
              <p className="text-sm text-[#384022]/70 leading-relaxed mt-1">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers & Limitation of Liability",
    content: (
      <>
        <p className="text-sm text-[#384022]/70 leading-relaxed">
          The Athenura platform is provided on an "as is" and "as available"
          basis. We make no warranties, expressed or implied, regarding the
          reliability, accuracy, or availability of the platform at any given
          time.
        </p>
        <p className="text-sm text-[#384022]/70 leading-relaxed mt-3">
          To the maximum extent permitted by law, Athenura shall not be liable
          for any indirect, incidental, special, or consequential damages
          arising from your use of the platform, including but not limited to
          loss of data, loss of revenue, or reputational harm.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact & Governing Law",
    content: (
      <>
        <p className="text-sm text-[#384022]/70 leading-relaxed mb-5">
          These Terms of Service are governed by the laws of India. Any disputes
          arising from these terms shall be subject to the exclusive
          jurisdiction of courts in Uttar Pradesh, India.
        </p>
        <div className="bg-[#224D59] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-base mb-2">
              Athenura Legal Team
            </p>
            <p className="text-white/70 text-sm flex items-center gap-2">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              legal@athenura.in
            </p>
            <p className="text-white/70 text-sm flex items-center gap-2 mt-1">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.64 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l.98-.98a2 2 0 0 1 2.1-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z" />
              </svg>
              +91 98350 51934
            </p>
          </div>
          <a
            href="mailto:legal@athenura.in"
            className="shrink-0 px-5 py-2.5 bg-[#b3c633] text-[#224D59] font-bold text-sm rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
          >
            Send an Email
          </a>
        </div>
      </>
    ),
  },
];

const LegalTerms = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState("acceptance");
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#F5F7F2] min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-[#224D59]/10 text-sm font-bold text-[#224D59] hover:bg-[#F5F7F2] hover:border-[#B8CC34]/50 transition-all duration-300 mb-8 group shadow-sm"
        >
          <svg
            className="w-4 h-4 mr-2 text-[#668824] transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to Home
        </a>
        <FadeInUp>
          <div className="mb-2">
            <h1 className="text-4xl text-center sm:text-5xl font-extrabold text-[#224D59] tracking-tight leading-tight mb-3">
              Terms of Service
            </h1>
            <div className="flex items-center gap-3 text-xs text-[#384022]/50 font-medium flex justify-center">
              <span className="w-1 h-1 rounded-full bg-[#384022]/30" />
              <span>Updated: April 10, 2026</span>
            </div>
          </div>
        </FadeInUp>

        <div className="mt-10 flex gap-8 items-start">
          <aside className="hidden lg:block w-56 shrink-0 sticky top-24">
            <p className="text-xs font-bold text-[#384022]/40 tracking-widest uppercase mb-3">
              Contents
            </p>
            <ul className="flex flex-col gap-1">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`flex items-center gap-2 text-xs py-1.5 px-2 rounded-lg transition-all duration-200 leading-snug
                      ${
                        activeId === s.id
                          ? "text-[#224D59] font-bold bg-white border-l-2 border-[#b3c633]"
                          : "text-[#384022]/50 hover:text-[#224D59] hover:bg-white/60"
                      }`}
                  >
                    <span
                      className={`shrink-0 text-[10px] font-bold ${activeId === s.id ? "text-[#b3c633]" : "text-[#384022]/30"}`}
                    >
                      {i + 1}.
                    </span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {sections.map((s, i) => (
              <div
                key={s.id}
                id={s.id}
                ref={(el) => (sectionRefs.current[s.id] = el)}
                className={`px-8 sm:px-12 py-10 ${i !== sections.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-7 h-7 rounded-lg bg-[#e8efb9] flex items-center justify-center text-xs font-extrabold text-[#668824] shrink-0">
                    {i + 1}
                  </span>
                  <h2 className="text-lg font-extrabold text-[#224D59] tracking-tight">
                    {s.title}
                  </h2>
                </div>
                {s.content}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LegalTerms;
