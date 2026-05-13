import React, { useState, useRef, useEffect } from 'react';

const faqs = [
  {
    question: "What makes Athenura different from regular CRMs?",
    answer:
      "Athenura is purpose-built for Training & Placement Operations (TPO). Unlike generic CRMs, it features role-based workspaces for admins and interns, automated follow-up reminders tailored for corporate outreach, and instant bulk import for institutional data.",
  },
  {
    question: "Can I upload bulk student and placement lead data?",
    answer:
      "Absolutely. Our platform supports seamless CSV and Excel file uploads. The system automatically parses the data, skips duplicates, and populates your database securely within seconds, eliminating manual entry.",
  },
  {
    question: "How do the automated reminders work?",
    answer:
      "The system actively monitors the status of your leads. If an intern has a scheduled follow-up or a pending lead needs attention, Athenura automatically sends an email or dashboard notification at 8 AM daily so no opportunity slips through the cracks.",
  },
  {
    question: "Is the institutional data completely secure?",
    answer:
      "Yes, security is our top priority. Athenura uses industry-standard encryption for data at rest and in transit. We also implement strict role-based access control, ensuring interns only see the data assigned to them, while admins have full oversight.",
  },
];

/* Smooth height-animating accordion item */
const FAQItem = ({ faq, index, isActive, onToggle, visible }) => {
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(isActive ? bodyRef.current.scrollHeight : 0);
    }
  }, [isActive]);

  return (
    <div
      className="faq-item"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`,
      }}
    >
      <div
        onClick={onToggle}
        className={`faq-card ${isActive ? 'active' : ''}`}
        role="button"
        aria-expanded={isActive}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      >
        {/* Question row */}
        <div className="faq-header">
          <span className="faq-index">{String(index + 1).padStart(2, '0')}</span>
          <h3 className="faq-question">{faq.question}</h3>
          <div className={`faq-chevron ${isActive ? 'open' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M4.5 6.75L9 11.25L13.5 6.75"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Animated body */}
        <div
          className="faq-body"
          style={{ height, overflow: 'hidden', transition: 'height 0.38s cubic-bezier(0.4,0,0.2,1)' }}
        >
          <div ref={bodyRef} className="faq-answer">
            {faq.answer}
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const toggle = (i) => setActiveIndex(activeIndex === i ? null : i);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .faq-section {
          width: 100%;
          padding: 96px 0 112px;
          background: #F5F7F2;
          position: relative;
          overflow: hidden;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }

        /* dot grid */
        .faq-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(#224D59 1.5px, transparent 1.5px);
          background-size: 28px 28px;
          opacity: 0.04;
          pointer-events: none;
        }

        /* soft glows */
        .faq-glow-tr {
          position: absolute; top: -80px; right: -80px;
          width: 520px; height: 520px;
          background: radial-gradient(circle, rgba(184,204,52,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .faq-glow-bl {
          position: absolute; bottom: -80px; left: -80px;
          width: 440px; height: 440px;
          background: radial-gradient(circle, rgba(34,77,89,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .faq-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .faq-header-block {
          text-align: center;
          margin-bottom: 64px;
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .faq-label {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #668824;
          background: rgba(102,136,36,0.1);
          border: 1px solid rgba(102,136,36,0.2);
          padding: 4px 14px;
          border-radius: 999px;
          margin-bottom: 20px;
        }
        .faq-title {
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          font-weight: 800;
          color: #224D59;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0 0 16px;
        }
        .faq-subtitle {
          font-size: 1.1rem;
          color: rgba(56,64,34,0.7);
          max-width: 560px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* Layout */
        .faq-layout {
          display: flex;
          gap: 48px;
          align-items: flex-start;
        }
        @media (max-width: 1024px) {
          .faq-layout { flex-direction: column; gap: 40px; }
          .faq-sidebar { position: static !important; width: 100% !important; }
        }

        /* Sidebar */
        .faq-sidebar {
          width: 300px;
          flex-shrink: 0;
          position: sticky;
          top: 120px;
        }
        .faq-sidebar-card {
          background: #fff;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 2px 16px rgba(34,77,89,0.07);
          margin-bottom: 16px;
          border: 1px solid rgba(34,77,89,0.07);
        }
        .faq-sidebar-card h4 {
          font-size: 15px;
          font-weight: 700;
          color: #224D59;
          margin: 0 0 8px;
        }
        .faq-sidebar-card p {
          font-size: 13px;
          color: rgba(56,64,34,0.65);
          margin: 0 0 16px;
          line-height: 1.6;
        }
        .faq-support-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #668824;
          text-decoration: none;
          transition: gap 0.2s ease;
        }
        .faq-support-link:hover { gap: 10px; }
        .faq-explore-link {
          display: block;
          padding: 20px 24px;
          background: #fff;
          border-radius: 16px;
          border: 1px solid rgba(34,77,89,0.1);
          text-decoration: none;
          transition: box-shadow 0.22s ease, transform 0.22s ease;
        }
        .faq-explore-link:hover {
          box-shadow: 0 8px 24px rgba(34,77,89,0.1);
          transform: translateY(-2px);
        }
        .faq-explore-link h4 {
          font-size: 14px;
          font-weight: 700;
          color: #224D59;
          margin: 0 0 4px;
        }
        .faq-explore-link p {
          font-size: 12px;
          color: rgba(56,64,34,0.55);
          margin: 0;
        }

        /* Accordion list */
        .faq-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 0;
        }

        /* FAQ card */
        .faq-item { width: 100%; }
        .faq-card {
          background: #fff;
          border-radius: 18px;
          border: 1px solid rgba(34,77,89,0.08);
          cursor: pointer;
          transition: box-shadow 0.25s ease, border-color 0.25s ease;
          outline: none;
        }
        .faq-card:hover {
          box-shadow: 0 6px 28px rgba(34,77,89,0.09);
          border-color: rgba(34,77,89,0.14);
        }
        .faq-card.active {
          box-shadow: 0 8px 32px rgba(34,77,89,0.12);
          border-color: rgba(34,77,89,0.18);
        }
        .faq-card:focus-visible {
          box-shadow: 0 0 0 3px rgba(102,136,36,0.35);
        }

        .faq-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 22px 24px;
          user-select: none;
        }
        .faq-index {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: rgba(34,77,89,0.3);
          min-width: 24px;
          font-variant-numeric: tabular-nums;
          transition: color 0.25s ease;
        }
        .faq-card.active .faq-index { color: #668824; }

        .faq-question {
          flex: 1;
          font-size: 15px;
          font-weight: 700;
          color: #224D59;
          margin: 0;
          line-height: 1.4;
        }

        .faq-chevron {
          color: rgba(34,77,89,0.4);
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), color 0.25s ease;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .faq-chevron.open {
          transform: rotate(180deg);
          color: #224D59;
        }

        .faq-answer {
          padding: 0 24px 22px 64px;
          font-size: 14.5px;
          color: rgba(56,64,34,0.72);
          line-height: 1.75;
          /* small top separator */
          border-top: 1px solid rgba(34,77,89,0.06);
          margin: 0 24px;
          padding-left: 40px;
          padding-top: 16px;
          padding-bottom: 20px;
        }
      `}</style>

      <section className="faq-section" ref={sectionRef}>
        <div className="faq-glow-tr" />
        <div className="faq-glow-bl" />

        <div className="faq-inner">
          {/* Header */}
          <div
            className="faq-header-block"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease, transform 0.8s ease',
            }}
          >
            <span className="faq-label">Help Center</span>
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <p className="faq-subtitle">
              Everything you need to know about Athenura — placements, onboarding,
              and keeping your data secure.
            </p>
          </div>

          <div className="faq-layout">
            {/* Sidebar */}
            <aside
              className="faq-sidebar"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s',
              }}
            >
              <div className="faq-sidebar-card">
                <h4>Still have questions?</h4>
                <p>Our team is here and happy to help.</p>
                <a href="mailto:support@athenura.com" className="faq-support-link">
                  Contact Support
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
              <a href="/faq" className="faq-explore-link">
                <h4>Explore All FAQs</h4>
                <p>Read detailed guides &amp; docs</p>
              </a>
            </aside>

            {/* Accordion list */}
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <FAQItem
                  key={i}
                  faq={faq}
                  index={i}
                  isActive={activeIndex === i}
                  onToggle={() => toggle(i)}
                  visible={visible}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQ;