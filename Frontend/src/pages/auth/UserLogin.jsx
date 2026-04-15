import React, { useState } from "react";
import {
  ArrowLeft, Calendar, ChartLine, Lock,
  Shield, UserPlus, Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    setError("");
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
        body: JSON.stringify({
          email: email.value,
          password: password.value
      }),
      });


      const data = await res.json();
      alert(data.message);

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

        body: JSON.stringify({ 
          name: name.value,
          email: email.value,
          password:password.value,
          adminSecret:adminSecret.value, 
          otp:otp.value }),
      });


      const data = await res.json();
      alert(data.message);

      
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

  const FloatingInput = ({ id, type = "text", label, value, onChange, autoComplete, maxLength, inputMode, required = true }) => (
    <div className="relative pt-5">
      <input
        id={id} type={type} placeholder=" "
        value={value} onChange={onChange}
        autoComplete={autoComplete}
        maxLength={maxLength}
        inputMode={inputMode}
        className="peer border-b border-blue-600 w-full pb-1 focus:outline-none bg-transparent autofill:bg-transparent"
        required={required}
      />
      <label htmlFor={id} className="absolute left-0 top-5 text-gray-400 tracking-wider transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-blue-600">
        {label}
      </label>
    </div>
  );

  return (
    <div className="flex justify-center min-h-screen bg-white">
      {/* ── Left Panel (Visible on Large Screens) ── */}
      <div className="hidden lg:block lg:w-3/5 relative">
        <img
          src="https://res.cloudinary.com/drq2a0262/image/upload/q_auto/f_auto/v1775484772/login-image_liqmh5.webp"
          alt="login-image"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-700/60 flex flex-col justify-center px-12 gap-4">
          <h1 className="text-5xl font-bold text-white">TPO Generation & Management</h1>
          <p className="text-blue-50 max-w-md">Streamline your placement pipeline with role-based dashboards.</p>
          <div className="space-y-6 mt-8">
             <FeatureItem Icon={ChartLine} title="Real Time Analytics" desc="Live dashboards with conversion rates." color="bg-amber-500" />
             <FeatureItem Icon={Users} title="Role-based Access" desc="JWT secured intern & admin portals." color="bg-green-500" />
             <FeatureItem Icon={Shield} title="Enterprise Security" desc="bcrypt & Rate limiting included." color="bg-purple-600" />
          </div>
        </div>
      </div>

      {/* ── Form Container ── */}
      <div className="w-full lg:w-2/5 px-6 lg:px-16 flex flex-col justify-center py-12">
        <div className="max-w-md mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <img src="/Logo.png" alt="Logo" className="h-10" />
            <button onClick={() => navigate("/")} className="text-sm flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
              <ArrowLeft size={16} /> Back to Home
            </button>
          </div>

          {!registration ? (
            /* LOGIN VIEW */
            <>
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-gray-500 mb-6">Sign in to track your progress.</p>
              {error && <ErrorMessage message={error} />}
              <form onSubmit={handleSubmit} className="space-y-8">
                <FloatingInput id="email" type="email" label="Email Address" value={email} onChange={handleInputChange(setEmail)} autoComplete="email" />
                <FloatingInput id="password" type="password" label="Password" value={password} onChange={handleInputChange(setPassword)} autoComplete="current-password" />
                <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-all disabled:opacity-50">
                  {loading ? "Verifying..." : "Sign In Securely"}
                </button>
              </form>
              <p className="mt-8 text-center text-sm text-gray-600">
                Need admin access?{" "}
                <button onClick={() => { setRegistration(true); setError(""); }} className="text-blue-600 font-medium hover:underline">Register here</button>
              </p>
            </>
          ) : (
            /* REGISTRATION VIEW */
            <>
              <h1 className="text-3xl font-bold mb-2">Admin Registration</h1>
              {error && <ErrorMessage message={error} />}
              
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-6">
                  <FloatingInput id="name" label="Full Name" value={name} onChange={handleInputChange(setName)} />
                  <FloatingInput id="reg-email" type="email" label="Work Email" value={email} onChange={handleInputChange(setEmail)} />
                  <FloatingInput id="reg-password" type="password" label="Create Password" value={password} onChange={handleInputChange(setPassword)} />
                  <FloatingInput id="admin-secret" label="Admin Secret Key" value={adminSecret} onChange={handleInputChange(setAdminSecret)} />
                  <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-all disabled:opacity-50">
                    {loading ? "Sending OTP..." : "Get Verification Code"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="p-3 bg-teal-50 text-teal-700 text-sm rounded-md border border-teal-100">
                    OTP sent to <b>{email}</b>
                  </div>
                  <FloatingInput id="otp" label="6-Digit OTP" value={otp} onChange={handleInputChange(setOtp)} maxLength={6} inputMode="numeric" />
                  <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-all disabled:opacity-50">
                    {loading ? "Finalizing..." : "Verify & Create Account"}
                  </button>
                  <button type="button" onClick={() => setOtpSent(false)} className="w-full text-center text-sm text-blue-600">Edit details</button>
                </form>
              )}
              <p className="mt-8 text-center text-sm text-gray-600">
                Already registered?{" "}
                <button onClick={() => { setRegistration(false); setError(""); }} className="text-blue-600 font-medium hover:underline">Sign In</button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const FeatureItem = ({ Icon, title, desc, color }) => (
  <div className="flex items-center gap-4 text-white">
    <div className={`${color} p-2.5 rounded-lg`}>
      <Icon size={20} />
    </div>
    <div><h4 className="font-bold">{title}</h4><p className="text-blue-100 text-sm">{desc}</p></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm mb-4 animate-pulse">
    {message}
  </div>
);

export default UserLogin;