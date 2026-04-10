import React from "react";
import Navbar from "../components/LandingPage/Navbar";
import Counter from "../components/Counter";
import { ActivitySquare, CheckCircle2, ClockFading, Globe, CircleCheck, MessageSquare, Milestone, PenLine, Rocket, Sparkles, Users2 } from "lucide-react";
import Footer from "../components/LandingPage/Footer";

const About = () => {
  const features = [
    {
      icon: <PenLine size={22} strokeWidth={1.8} className="text-[#0d9488]" />,
      title: "Tailored Solutions",
      desc: "Every engagement is custom-built for your unique goals.",
    },
    {
      icon: (
        <ActivitySquare
          size={22}
          strokeWidth={1.8}
          className="text-[#0d9488]"
        />
      ),
      title: "Data-Driven Decisions",
      desc: "Every strategy is backed by rigorous research and analytics.",
    },
    {
      icon: (
        <CheckCircle2 size={22} strokeWidth={1.8} className="text-[#0d9488]" />
      ),
      title: "Proven Delivery",
      desc: "240+ completed projects with consistent on-time delivery.",
    },
    {
      icon: (
        <MessageSquare size={22} strokeWidth={1.8} className="text-[#0d9488]" />
      ),
      title: "Ongoing Partnership",
      desc: "We stay with you well beyond the launch of every project.",
    },
    {
      icon: <Globe size={22} strokeWidth={1.8} className="text-[#0d9488]" />,
      title: "Global Perspective",
      desc: "Insights and experience from 14+ diverse global markets.",
    },
  ];

  const bullets = [
    "Full-spectrum capabilities from research and strategy to design and engineering",
    "Agile delivery model that adapts to your business velocity",
    "Deep industry expertise across fintech, edtech, healthcare & e-commerce",
    "Dedicated client success team available throughout and after delivery",
    "Transparent pricing with no hidden costs or scope surprises",
    "Proven track record with 98% client satisfaction across 14 countries",
  ];

  return (
    <div>
      <Navbar />
      {/* hero section */}
      <section className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-10 lg:py-20">
          <div className="flex flex-col space-y-6 md:space-y-8 text-center z-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#224D59] leading-tight tracking-tight">
              We Build the Digital <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#224D59] to-[#668824]">
                Future Together
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#384022]/80 max-w-2xl mx-auto font-medium leading-relaxed">
              Athenura is a passionate team of innovators, developers, and
              strategists dedicated to building digital solutions that transform
              businesses and create lasting impact.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-2">
              <a
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#224D59] text-white font-semibold text-base sm:text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(34,77,89,0.3)] hover:bg-[#1A3A43] text-center"
              >
                Create Account
              </a>

              <a
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/60 border border-[#224D59]/10 backdrop-blur-md text-[#224D59] font-semibold text-base sm:text-lg transition-all duration-300 transform hover:-translate-y-1 hover:bg-white hover:shadow-lg text-center"
              >
                Login to Portal
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats cards */}
      <section className="bg-[#224D59] py-2 flex justify-center">
        <div className="flex flex-wrap justify-center gap-10 lg:gap-20 max-w-7xl">
          <div className="flex flex-col gap-2 items-center px-10 py-10">
            <span className="text-5xl font-bold text-[#b3c633]">
              <Counter end={120} duration={1500} />+
            </span>
            <span className="text-slate-100">Global Clients</span>
          </div>
          <div className="flex flex-col gap-2 items-center px-10 py-10">
            <span className="text-5xl font-bold text-[#b3c633]">
              <Counter end={240} duration={1500} />+
            </span>
            <span className="text-slate-100">Projects Delivered</span>
          </div>
          <div className="flex flex-col gap-2 items-center px-10 py-10">
            <span className="text-5xl font-bold text-[#b3c633]">
              <Counter end={14} duration={1000} />
            </span>
            <span className="text-slate-100">Countries Reached</span>
          </div>
          <div className="flex flex-col gap-2 items-center px-10 py-10">
            <span className="text-5xl font-bold text-[#b3c633]">
              <Counter end={98} duration={1500} />%
            </span>
            <span className="text-slate-100">Client Satisfaction</span>
          </div>
        </div>
      </section>

      {/* Our story section */}
      <section className="flex justify-center">
        <div className="px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center max-w-7xl w-full">
          <p className="text-[#b3c633] font-medium">OUR STORY</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#224D59] leading-tight mb-4 tracking-tight">
            From Vision <br /> to{" "}
            <span className="font-normal italic text-transparent bg-clip-text bg-linear-to-r from-[#224D59] to-[#668824] pr-1">
              Reality
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#384022]/80 max-w-3xl mx-auto leading-relaxed my-2">
            Founded with a vision to shape the future of digital innovation,
            Athenura officially established its foundation in 2026 as a focused
            team driven by creativity, technology, and purpose.
          </p>
          <p className="text-base sm:text-lg md:text-xl text-[#384022]/80 max-w-3xl mx-auto leading-relaxed my-2">
            Today, we are a growing organization delivering impactful digital
            solutions to businesses across diverse industries and regions. Our
            journey is guided by a clear philosophy: build solutions that create
            real value.
          </p>

          <div className="mt-5 flex flex-col gap-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className="md:col-span-2 bg-gray-200 rounded-lg p-6 md:p-8 flex flex-col gap-10 md:gap-15
          group shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1
          relative overflow-hidden
          before:absolute before:top-0 before:left-0 before:h-[3px] before:w-0
          before:bg-[#b3c633] before:transition-all before:duration-500
          hover:before:w-full"
              >
                <p className="text-[#b3c633] font-medium flex gap-2 tracking-widest">
                  <Rocket
                    className="mt-0.5 transition-transform duration-300 group-hover:scale-125"
                    strokeWidth={3}
                  />
                  THE BEGINNING
                </p>
                <div>
                  <h3 className="text-start font-bold text-lg">
                    Foundation & Focus
                  </h3>
                  <p className="text-start text-base text-[#384022]/80 max-w-xl leading-relaxed">
                    Every strategy we design, every product we develop, and
                    every experience we craft is centered on solving real-world
                    problems and helping our clients grow with confidence in a
                    digital-first world.
                  </p>
                </div>
              </div>

              <div
                className="md:col-span-1 bg-[#224D59] rounded-lg p-6 md:p-8 flex flex-col gap-10 md:gap-15
          group shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1
          relative overflow-hidden
          before:absolute before:top-0 before:left-0 before:h-[3px] before:w-0
          before:bg-lime-400 before:transition-all before:duration-500
          hover:before:w-full"
              >
                <Sparkles
                  className="text-[#b3c633] transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12"
                  strokeWidth={3}
                />
                <div>
                  <h3 className="text-start font-bold text-lg text-white">
                    Ethics of Digital
                  </h3>
                  <p className="text-base text-start text-gray-100 max-w-3xl leading-relaxed">
                    Innovation is not just building software, it is the digital
                    manifestation of our values and academic insight.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div
                className="md:col-span-2 flex flex-col items-start bg-white rounded-lg px-5 py-8
          group shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1
          relative overflow-hidden
          before:absolute before:top-0 before:left-0 before:h-[3px] before:w-0
          before:bg-[#0d9488] before:transition-all before:duration-500
          hover:before:w-full"
              >
                <span className="font-medium tracking-widest flex gap-2">
                  <Milestone
                    className="transition-transform duration-300 group-hover:scale-125"
                    strokeWidth={3}
                  />
                  MILESTONES
                </span>
                <div className="flex flex-col items-start mt-8 px-3 border-l-2 border-[#0d9488]">
                  <span className="text-sm text-[#0d9488] font-bold">
                    2026 - Founding
                  </span>
                  <h5 className="font-bold">Athenura Is Born</h5>
                  <p className="text-[#384022]/80 text-start text-sm">
                    A small but ambitious team comes together with a shared
                    vision to bridge the gap between academic insight and
                    real-world digital execution.
                  </p>
                </div>
                <div className="flex flex-col items-start px-3 mt-5 border-l-2 border-[#0d9488]">
                  <span className="text-sm text-[#0d9488] font-bold">
                    2026 - Growth
                  </span>
                  <h5 className="font-bold">First Clients</h5>
                  <p className="text-[#384022]/80 text-start text-sm">
                    Rapid growth across sectors as early adopters recognize the
                    depth and quality of Athenura's digital strategy and product
                    development.
                  </p>
                </div>
                <div className="flex flex-col items-start px-3 mt-5 border-l-2 border-[#0d9488]">
                  <span className="text-sm text-[#0d9488] font-bold">
                    2026 - Momentum
                  </span>
                  <h5 className="font-bold">Building Tomorrow</h5>
                  <p className="text-[#384022]/80 text-start text-sm">
                    With active clients and delivered projects, we continue to
                    push the boundaries of what digital solutions can achieve.
                  </p>
                </div>
              </div>

              <div className="md:col-span-3 flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div
                    className="bg-gray-300 p-6 md:p-8 rounded-lg flex flex-col items-start gap-5
              group shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1
              relative overflow-hidden
              before:absolute before:top-0 before:left-0 before:h-[3px] before:w-0
              before:bg-[#384022] before:transition-all before:duration-500
              hover:before:w-full"
                  >
                    <span className="inline-block bg-white p-2.5 rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md">
                      <ClockFading />
                    </span>
                    <div>
                      <h4 className="font-bold text-start">Future Focused</h4>
                      <p className="text-start text-base text-[#384022]/80 max-w-xl leading-relaxed">
                        Designing for the next decade of digital evolution, not
                        just the next trend. Our solutions are built to scale
                        and endure.
                      </p>
                    </div>
                  </div>

                  <div
                    className="p-6 md:p-8 bg-[#e8efb9] rounded-lg flex flex-col items-start gap-5
              group shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1
              relative overflow-hidden
              before:absolute before:top-0 before:left-0 before:h-[3px] before:w-0
              before:bg-[#384022] before:transition-all before:duration-500
              hover:before:w-full"
                  >
                    <span className="inline-block bg-white p-2.5 rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-md">
                      <Users2 />
                    </span>
                    <div>
                      <h4 className="font-bold text-start">Human Centric</h4>
                      <p className="text-start text-base text-[#384022]/80 max-w-xl leading-relaxed">
                        Our studio operates as a flat collective. Every voice
                        from strategy to code shapes the final vision for our
                        clients.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="bg-[#224D59] rounded-lg px-8 md:px-20 py-10 md:py-0 h-full flex flex-col gap-2 justify-center
            group shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1
            relative overflow-hidden
            before:absolute before:top-0 before:left-0 before:h-[3px] before:w-0
            before:bg-lime-400 before:transition-all before:duration-500
            hover:before:w-full"
                >
                  <p className="text-gray-300 text-start text-sm tracking-widest">
                    OUR PHILOSOPHY
                  </p>
                  <p className="text-white font-bold text-xl md:text-3xl text-start tracking-wide italic">
                    &#10077; We build the silent architecture of the digital
                    world. &#10078;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team section */}
      <section className="flex justify-center">
        <div className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl w-full">
          <div className="max-w-lg mb-14">
            <p className="text-[#b3c633] font-medium tracking-widest text-sm flex items-center gap-2 mb-3">
              THE TEAM
            </p>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#224D59] leading-tight mb-4">
              The People Behind
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#224D59] to-[#668824]">
              the Vision
              </span>
            </h2>
            <p className="text-base text-[#384022]/80 leading-relaxed">
              A diverse collective of strategists, engineers, and creatives
              united by a passion for impact and a drive to build digital
              experiences that matter.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                initial: "S",
                name: "Sameer Singh",
                role: "Co-Founder & CEO",
                bio: "Visionary leader with a background in product strategy and digital transformation. Passionate about bridging theory with real-world execution.",
                skills: ["Strategy", "Leadership", "Product"],
                avatarBg: "bg-[#224D59]",
                border: "hover:before:bg-[#b3c633]",
              },
              {
                initial: "A",
                name: "Alok Singh",
                role: "Co-Founder",
                bio: "Full-stack architect with 10+ years building scalable systems. Champions clean code, robust architecture, and developer-first culture.",
                skills: ["Engineering", "Architecture", "Branding"],
                avatarBg: "bg-[#0d9488]",
                border: "hover:before:bg-[#0d9488]",
              },
              {
                initial: "N",
                name: "Ayush Kumar",
                role: "Co-Founder",
                bio: "Award-winning designer focused on human-centered experiences. Believes every pixel has a purpose and every interaction tells a story.",
                skills: ["UX Design", "Full-Stack", "Research"],
                avatarBg: "bg-[#1a6b5c]",
                border: "hover:before:bg-[#b3c633]",
              },
            ].map((member) => (
              <div
                key={member.name}
                className="group rounded-2xl overflow-hidden border border-gray-200 bg-white
            transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
            relative before:absolute before:top-0 before:left-0 before:h-[3px]
            before:w-0 before:transition-all before:duration-500 hover:before:w-full"
                style={{ "--tw-before-bg": "red" }}
              >
                <div
                  className={`${member.avatarBg} h-48 flex items-center justify-center relative`}
                >
                  <span className="text-8xl font-black text-white/20 transition-all duration-300 group-hover:text-white/35 group-hover:scale-105 select-none">
                    {member.initial}
                  </span>
                  <span className="absolute bottom-3 right-3 text-xs text-white/80 font-medium bg-white/15 border border-white/25 rounded-full px-3 py-1">
                    {member.role}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#224D59] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#0d9488] tracking-wide uppercase mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-[#384022]/80 leading-relaxed">
                    {member.bio}
                  </p>
                  <div className="border-t border-gray-100 mt-4 pt-4 flex flex-wrap gap-2">
                    {member.skills.map((skill, i) => (
                      <span
                        key={skill}
                        className={`text-xs font-medium px-3 py-1 rounded-full ${
                          i % 2 === 0
                            ? "bg-[#e1f5ee] text-[#085041]"
                            : "bg-[#f0f5d0] text-[#384022]"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* why athenura section */}
      <section className="bg-[#f0f7f4] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left */}
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-[#b3c633] font-semibold text-sm tracking-widest uppercase mb-3">
                  Why Athenura
                </p>
                <h2 className="text-4xl lg:text-5xl font-extrabold text-[#224D59] leading-tight mb-5">
                  What Sets 
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-[#224D59] to-[#668824]">Us Apart</span>
                </h2>
                <p className="text-base sm:text-lg text-[#384022]/80 leading-relaxed max-w-lg">
                  We don't just deliver projects — we build lasting partnerships
                  grounded in strategy, craft, and measurable outcomes.
                </p>
              </div>

              <ul className="flex flex-col gap-3">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CircleCheck
                      size={20}
                      strokeWidth={2}
                      className="text-[#0d9488] mt-0.5 shrink-0"
                    />
                    <span className="text-sm sm:text-base text-[#384022]/80 leading-relaxed">
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-4">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-5 bg-white rounded-2xl px-5 py-5
                  border border-transparent hover:border-[#0d9488]/20
                  shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5
                  relative overflow-hidden
                  before:absolute before:top-0 before:left-0 before:h-[2px] before:w-0
                  before:bg-[#b3c633] before:transition-all before:duration-500
                  hover:before:w-full"
                >
                  <div
                    className="shrink-0 w-11 h-11 rounded-xl bg-[#e1f5ee] flex items-center justify-center
                  transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  >
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#224D59] text-base mb-1">
                      {f.title}
                    </h4>
                    <p className="text-sm text-[#384022]/70 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
