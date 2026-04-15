import React, { useState } from "react";
import {
  ArrowLeft, Calendar, ChartLine, Lock,
  Shield, UserPlus, Users, Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE = "http://localhost:5000/auth";

const FloatingInput = ({ id, type = "text", label, value, onChange, autoComplete, maxLength, inputMode, required = true }) => (
  <div className="relative pt-5">
    <input
      id={id} type={type} placeholder=" "
      value={value} onChange={onChange}
      autoComplete={autoComplete}
      maxLength={maxLength}
      inputMode={inputMode}
      className="peer border-b-2 border-gray-200 w-full pb-2 focus:outline-none focus:border-[#0d9488] transition-colors duration-300 bg-transparent text-sm text-[#384022] autofill:shadow-[inset_0_0_0px_1000px_transparent] autofill:[-webkit-text-fill-color:inherit]"
      required={required}
    />
    <label htmlFor={id} className="absolute left-0 top-5 text-gray-400 text-sm tracking-wide transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#0d9488] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#0d9488]">
      {label}
    </label>
  </div>
);

const FeatureItem = ({ Icon, title, desc, color }) => (
  <div className="flex items-center gap-4">
    <div className={`${color} p-2.5 rounded-xl text-white shrink-0`}>
      <Icon size={18} />
    </div>
    <div>
      <h4 className="text-white font-semibold text-sm">{title}</h4>
      <p className="text-white/60 text-xs mt-0.5 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-sm mb-4">
    {message}
  </div>
);

const SubmitButton = ({ loading, label, loadingLabel, icon: Icon }) => (
  <button
    type="submit"
    disabled={loading}
    className="bg-[#224D59] py-3 cursor-pointer w-full text-white font-semibold text-sm rounded-xl flex gap-2 items-center justify-center
      hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(34,77,89,0.3)] hover:bg-[#1A3A43]
      active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
  >
    {loading ? loadingLabel : <><Icon size={15} strokeWidth={2} />{label}</>}
  </button>
);

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registration, setRegistration] = useState(false);
  const navigate = useNavigate();

  const clearError = (setter) => (e) => {
    setError("");
    setter(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        navigate(data.user.role === "admin" ? "/admin/dashboard" : "/intern/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Cannot connect to server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/register-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, adminSecret }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch {
      setError("Server error while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/verify-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Verification failed");
      }
    } catch {
      setError("Server error during registration");
    } finally {
      setLoading(false);
    }
  };

  const switchToRegister = () => { setRegistration(true); setError(""); setOtpSent(false); };
  const switchToLogin = () => { setRegistration(false); setError(""); setOtpSent(false); };

  return (
    <div className="flex justify-center min-h-screen">
      <div className="hidden lg:block lg:w-3/5 h-screen sticky top-0">
        <img
          src="https://res.cloudinary.com/drq2a0262/image/upload/q_auto/f_auto/v1775484772/login-image_liqmh5.webp"
          alt="login-image"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#224D59]/80 flex flex-col justify-center px-12 gap-4">
          <div className="mb-4">
            <img src="/Logo.png" alt="Athenura Logo" className="h-10 w-auto object-contain brightness-0 invert mb-6" />
            <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
              TPO Generation<br />and Management
            </h1>
            <p className="text-white/70 mt-3 text-sm leading-relaxed max-w-sm">
              Streamline your Training & Placement Opportunity pipeline with role-based dashboards and automated workflows.
            </p>
          </div>
          <div className="flex flex-col gap-5 mt-4">
            <FeatureItem Icon={ChartLine} title="Real Time Analytics" desc="Live dashboards with conversion rates & intern rankings." color="bg-amber-500" />
            <FeatureItem Icon={Users} title="Role-based Access" desc="Separate intern & admin dashboards with JWT auth." color="bg-[#0d9488]" />
            <FeatureItem Icon={Shield} title="Enterprise Security" desc="bcrypt hashing, Helmet.js & rate limiting built-in." color="bg-purple-600" />
            <FeatureItem Icon={Calendar} title="Smart Automation" desc="node-cron follow-up reminders & bulk CSV/XLSX import." color="bg-pink-500" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 min-h-screen">
        <div className="max-w-sm w-full mx-auto">
          <div className="flex justify-between items-center mb-8">
            <img src="/Logo.png" alt="Athenura Logo" className="h-10 w-auto object-contain" />
            <button
              onClick={() => navigate("/")}
              className="cursor-pointer flex items-center gap-2 border border-gray-200 px-3.5 py-2 rounded-xl text-sm text-gray-500 hover:border-[#224D59] hover:text-[#224D59] hover:-translate-y-0.5 active:scale-95 duration-200 transition-all group"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-1 duration-200 transition-transform" />
              Back
            </button>
          </div>

          {!registration ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-[#224D59] tracking-tight mb-2">
                  Access Your Placement Journey
                </h1>
                <p className="text-[#384022]/60 text-sm leading-relaxed">
                  Sign in to track your internships, training progress, and upcoming opportunities.
                </p>
              </div>

              {error && <ErrorMessage message={error} />}

              <form onSubmit={handleLogin} className="flex flex-col gap-6">
                <FloatingInput id="email" type="email" label="Email address" value={email} onChange={clearError(setEmail)} autoComplete="email" />
                <FloatingInput id="password" type="password" label="Password" value={password} onChange={clearError(setPassword)} autoComplete="current-password" />
                <div className="flex justify-end -mt-2">
                  <span className="text-xs text-[#0d9488] cursor-pointer hover:underline underline-offset-4">
                    Forgot password?
                  </span>
                </div>
                <SubmitButton loading={loading} label="Sign In Securely" loadingLabel="Verifying..." icon={Lock} />
              </form>

              <p className="text-center mt-6 text-sm text-[#384022]/60">
                Need an admin account?{" "}
                <button onClick={switchToRegister} className="text-[#0d9488] cursor-pointer font-medium hover:underline underline-offset-4">
                  Sign up
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-[#224D59] tracking-tight mb-2">
                  {otpSent ? "Verify Your Email" : "Create Admin Account"}
                </h1>
                <p className="text-[#384022]/60 text-sm leading-relaxed">
                  {otpSent
                    ? `Enter the 6-digit code sent to ${email}`
                    : "Register as an administrator to manage interns and oversee platform activities."}
                </p>
              </div>

              {error && <ErrorMessage message={error} />}

              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="flex flex-col gap-6">
                  <FloatingInput id="name" label="Full Name" value={name} onChange={clearError(setName)} />
                  <FloatingInput id="reg-email" type="email" label="Work Email" value={email} onChange={clearError(setEmail)} />
                  <FloatingInput id="reg-password" type="password" label="Create Password" value={password} onChange={clearError(setPassword)} />
                  <FloatingInput id="admin-secret" label="Admin Secret Key" value={adminSecret} onChange={clearError(setAdminSecret)} />
                  <SubmitButton loading={loading} label="Get Verification Code" loadingLabel="Sending OTP..." icon={Mail} />
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="flex flex-col gap-6">
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#e1f5ee] border border-[#0d9488]/20 rounded-xl">
                    <Mail size={15} strokeWidth={1.8} className="text-[#0d9488] shrink-0" />
                    <p className="text-sm text-[#085041]">
                      Code sent to <span className="font-semibold">{email}</span>
                    </p>
                  </div>
                  <FloatingInput id="otp" label="6-Digit OTP" value={otp} onChange={clearError(setOtp)} maxLength={6} inputMode="numeric" />
                  <SubmitButton loading={loading} label="Verify & Create Account" loadingLabel="Finalizing..." icon={UserPlus} />
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtp(""); setError(""); }}
                    className="text-center text-sm text-[#0d9488] hover:underline underline-offset-4 cursor-pointer"
                  >
                    Edit details
                  </button>
                </form>
              )}

              <p className="text-center mt-6 text-sm text-[#384022]/60">
                Already have an account?{" "}
                <button onClick={switchToLogin} className="text-[#0d9488] cursor-pointer font-medium hover:underline underline-offset-4">
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserLogin;