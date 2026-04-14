import React, { useState } from "react";
import {
  ArrowLeft, Calendar, ChartLine, Lock,
  Shield, UserPlus, Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ✅ STABLE COMPONENTS: Defined OUTSIDE to prevent focus loss on re-render
const FloatingInput = ({ id, type = "text", label, value, onChange, maxLength, inputMode, autoComplete }) => (
  <div className="relative pt-5">
    <input
      id={id}
      type={type}
      placeholder=" "
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      inputMode={inputMode}
      autoComplete={autoComplete}
      className="peer border-b border-blue-600 w-full pb-1 focus:outline-none bg-transparent autofill:bg-transparent"
      required
    />
    <label
      htmlFor={id}
      className="absolute left-0 top-5 text-gray-400 transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-blue-600"
    >
      {label}
    </label>
  </div>
);

const FeatureItem = ({ Icon, title, desc, color }) => (
  <div className="flex items-center gap-3">
    <div className={`text-white ${color} p-2.5 rounded-lg`}>
      <Icon size={20} />
    </div>
    <div>
      <h4 className="text-white font-bold text-lg">{title}</h4>
      <p className="text-slate-100 text-sm">{desc}</p>
    </div>
  </div>
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

  // Helper to clear error when user types
  const handleInputChange = (setter) => (e) => {
    if (error) setError("");
    setter(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
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
      setError("Server error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, adminSecret, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch {
      setError("Server error during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen">
      {/* ── Left Image Panel ── */}
      <div className="hidden lg:block lg:w-3/5 relative">
        <img
          src="https://res.cloudinary.com/drq2a0262/image/upload/q_auto/f_auto/v1775484772/login-image_liqmh5.webp"
          alt="login-image"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-700/60 flex flex-col justify-center px-10 gap-3">
          <h1 className="text-5xl font-bold text-white">TPO Generation and Management</h1>
          <p className="text-slate-100 max-w-md">Streamline your Training & Placement Opportunity pipeline with role-based dashboards.</p>
          <div className="flex flex-col gap-5 mt-10">
            <FeatureItem Icon={ChartLine} title="Real Time Analytics" desc="Live dashboards with conversion rates." color="bg-amber-500" />
            <FeatureItem Icon={Users} title="Role-based Access" desc="Separate intern & admin dashboards." color="bg-green-500" />
            <FeatureItem Icon={Shield} title="Enterprise Security" desc="bcrypt hashing & rate limiting built-in." color="bg-purple-600" />
            <FeatureItem Icon={Calendar} title="Smart Automation" desc="Node-cron follow-up reminders." color="bg-pink-500" />
          </div>
        </div>
      </div>

      {/* ── FORM CONTAINER ── */}
      <div className="px-5 lg:px-20 flex flex-col justify-center w-full lg:w-2/5 gap-3 max-w-lg lg:max-w-none">
        <div className="flex justify-between items-center mb-4">
          <img src="/Logo.png" alt="Logo" className="h-12 w-auto object-contain" />
          <button onClick={() => navigate("/")} className="text-sm flex items-center gap-2 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>
        </div>

        {error && (
          <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-100 px-4 py-3 rounded-lg animate-in fade-in duration-300">
            {error}
          </div>
        )}

        {!registration ? (
          /* ── LOGIN FORM ── */
          <div className="animate-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-bold">Access Your Journey</h1>
            <p className="text-slate-600 text-sm mb-6">Sign in to track your internships and progress.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <FloatingInput id="email" type="email" label="Email" value={email} onChange={handleInputChange(setEmail)} autoComplete="email" />
              <FloatingInput id="login-password" type="password" label="Password" value={password} onChange={handleInputChange(setPassword)} autoComplete="current-password" />
              <button type="submit" disabled={loading} className="bg-teal-600 py-3 text-white font-bold rounded-lg flex gap-2 justify-center items-center hover:bg-teal-700 active:scale-[0.98] transition-all disabled:opacity-60">
                <Lock size={18} /> {loading ? "Signing in..." : "Sign In Securely"}
              </button>
            </form>
            <button onClick={() => { setRegistration(true); setError(""); }} className="mt-6 w-full text-center text-sm text-blue-600 hover:underline">
              Need an admin account? Sign up
            </button>
          </div>
        ) : (



          
          /* ── REGISTRATION FORM ── */
          <div className="animate-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-bold">Create Admin</h1>
            <p className="text-slate-600 text-sm mb-6">Register to oversee platform activities.</p>

            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="flex flex-col gap-5">
                <FloatingInput id="name" label="Full Name" value={name} onChange={handleInputChange(setName)} />
                <FloatingInput id="reg-email" type="email" label="Email" value={email} onChange={handleInputChange(setEmail)} />
                <FloatingInput id="reg-password" type="password" label="Password" value={password} onChange={handleInputChange(setPassword)} />
                <FloatingInput id="admin-secret" label="Admin Secret Key" value={adminSecret} onChange={handleInputChange(setAdminSecret)} />
                <button type="submit" disabled={loading} className="bg-teal-600 py-3 text-white font-bold rounded-lg transition-all hover:bg-teal-700 disabled:opacity-60">
                  {loading ? "Sending..." : "Send OTP to Email"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="flex flex-col gap-6">
                <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-lg border border-blue-100">
                  OTP sent to <b>{email}</b>
                </div>
                <FloatingInput id="otp" label="Enter 6-Digit OTP" value={otp} onChange={handleInputChange(setOtp)} maxLength={6} inputMode="numeric" />
                <button type="submit" disabled={loading} className="bg-teal-600 py-3 text-white font-bold rounded-lg flex gap-2 justify-center items-center hover:bg-teal-700 transition-all disabled:opacity-60">
                  <UserPlus size={18} /> {loading ? "Verifying..." : "Verify & Create Account"}
                </button>
                <button type="button" onClick={() => setOtpSent(false)} className="text-xs text-gray-500 underline text-center">Change email address</button>
              </form>
            )}
            <button onClick={() => { setRegistration(false); setOtpSent(false); setError(""); }} className="mt-6 w-full text-center text-sm text-blue-600 hover:underline">
              Already have an account? Sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLogin;