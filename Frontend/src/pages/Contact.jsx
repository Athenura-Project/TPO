import React, { useState } from "react";
import Navbar from "../components/LandingPage/Navbar";
import Footer from "../components/LandingPage/Footer";
import {
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  const infoCards = [
    {
      icon: <Phone size={20} strokeWidth={1.8} className="text-white" />,
      bg: "bg-[#224D59]",
      label: "Call Us",
      primary: "+91 98350 51934",
      secondary: "Mon–Sat, 10AM–6PM",
    },
    {
      icon: <Mail size={20} strokeWidth={1.8} className="text-white" />,
      bg: "bg-[#0d9488]",
      label: "Email Us",
      primary: "info.athenura@gmail.com",
      secondary: "Online Support 24/7",
    },
    {
      icon: <MapPin size={20} strokeWidth={1.8} className="text-white" />,
      bg: "bg-[#668824]",
      label: "Location",
      primary: "Uttar Pradesh, India",
      secondary: "Pan-India Remote Operations",
    },
  ];

  return (
    <div>
      <Navbar />

      {/* hero section */}
      <section className="bg-[#224D59] pt-28 pb-36 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-4">
          Let's Build Your <span className="text-[#b3c633]">Future</span>
          <br />
          Together.
        </h1>
        <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Whether you're a student seeking an internship or a brand looking to
          collaborate, our team is ready to connect.
        </p>
      </section>

      {/* Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-25">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {infoCards.map((card) => (
            <div
              key={card.label}
              className="group bg-white rounded-2xl px-8 py-12 flex flex-col items-center text-center
                shadow-md hover:shadow-xl border border-gray-100
                transition-all duration-300 hover:-translate-y-1
                relative overflow-hidden
                before:absolute before:top-0 before:left-0 before:h-[3px] before:w-0
                before:bg-[#b3c633] before:transition-all before:duration-500
                hover:before:w-full"
            >
              <div
                className={`${card.bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-4
                transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
              >
                {card.icon}
              </div>
              <p className="text-xs font-semibold tracking-widest text-[#384022]/50 uppercase mb-2">
                {card.label}
              </p>
              <p className="text-base font-bold text-[#224D59] mb-1">
                {card.primary}
              </p>
              <p className="text-sm text-[#384022]/60">{card.secondary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* form and map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-md border border-gray-100">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#224D59] mb-2">
              Send us a message
            </h2>
            <p className="text-sm text-[#384022]/60 mb-8">
              We usually respond within 24 business hours.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold tracking-widest text-[#384022]/50 uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#384022]
                      placeholder:text-[#384022]/30 focus:outline-none focus:border-[#0d9488]
                      transition-colors duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold tracking-widest text-[#384022]/50 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#384022]
                      placeholder:text-[#384022]/30 focus:outline-none focus:border-[#0d9488]
                      transition-colors duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-widest text-[#384022]/50 uppercase">
                  How can we help?
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe your inquiry..."
                  className="px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#384022]
                    placeholder:text-[#384022]/30 focus:outline-none focus:border-[#0d9488]
                    transition-colors duration-200 bg-gray-50 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="self-start flex items-center gap-2 px-8 py-3.5 rounded-xl
                  bg-[#224D59] text-white font-semibold text-sm
                  transition-all duration-300 hover:-translate-y-0.5
                  hover:shadow-[0_10px_25px_rgba(34,77,89,0.3)] hover:bg-[#1A3A43] cursor-pointer"
              >
                Send Message
                <Send size={16} strokeWidth={2} />
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#224D59] mb-5">
                Our Presence
              </h2>
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-64 w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d21342.615133051324!2d77.364122!3d28.618435!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2cb70326146a27db%3A0x39227c4340f97501!2sAthenura!5e1!3m2!1sen!2sin!4v1775892049914!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowfullscreen
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-[#0d9488] hover:underline underline-offset-4"
              >
                Open in Maps <ExternalLink size={12} />
              </a>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#224D59] mb-4">
                Join our Community
              </h3>
              <div className="flex gap-3 flex-wrap">
                {[
                  {
                    href: "https://www.linkedin.com/company/athenura/",
                    label: "LinkedIn",
                    hoverBg: "#0A66C2",
                    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                  },
                  {
                    href: "https://www.instagram.com/athenura.in/",
                    label: "Instagram",
                    hoverBg: "#E1306C",
                    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
                  },
                  {
                    href: "https://x.com/athenura_in",
                    label: "Twitter / X",
                    hoverBg: "#000000",
                    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z",
                  },
                  {
                    href: "https://athenura.medium.com/",
                    label: "Medium",
                    hoverBg: "green",
                    path: "M2.846 6.887c.03-.295-.083-.586-.303-.784l-2.24-2.7v-.403H7.26l5.378 11.795 4.728-11.795H24v.403l-1.917 1.837c-.165.126-.247.333-.213.538v13.498c-.034.204.048.411.213.537l1.87 1.837v.403h-9.41v-.403l1.937-1.882c.19-.19.19-.246.19-.537V8.395L11.001 21.82h-.728L3.937 8.395v8.988c-.052.385.076.774.347 1.052l2.52 3.058v.404H0v-.404l2.52-3.058c.27-.279.39-.67.326-1.052V6.887z",
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    style={{ "--hover-bg": s.hoverBg }}
                    className="group w-11 h-11 rounded-xl border border-gray-200 bg-white
        flex items-center justify-center text-[#224D59]
        transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
        hover:border-transparent"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = s.hoverBg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="17"
                      height="17"
                      fill="currentColor"
                      className="transition-colors duration-300 group-hover:text-white"
                    >
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <a
              href="https://wa.me/919835051934"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-6 py-4 rounded-2xl
                bg-lime-100 border border-lime-400
                hover:bg-lime-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md group"
            >
              <div className="flex items-center gap-3">
                <MessageCircle
                  size={20}
                  strokeWidth={1.8}
                  className="text-lime-400"
                />
                <span className="text-sm font-bold text-lime-500">
                  Chat with an Expert on WhatsApp
                </span>
              </div>
              <ExternalLink
                size={14}
                strokeWidth={2}
                className="text-[#668824] group-hover:translate-x-0.5 transition-transform"
              />
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
