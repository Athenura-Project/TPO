import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  X,
  Lock,
  UserPlus,
  Mail,
  KeyRound,
  RotateCcw,
  Eye,
  EyeOff,
  ArrowLeft,
  User,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const BASE = `${API_BASE_URL}/auth`;

const FloatingInput = ({
  id,
  type = "text",
  label,
  value,
  onChange,
  autoComplete,
  maxLength,
  inputMode,
  required = true,
}) => (
  <div className="relative pt-5">
    <input
      id={id}
      type={type}
      placeholder=" "
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      maxLength={maxLength}
      inputMode={inputMode}
      className="peer border-b-2 border-gray-200 w-full pb-2 focus:outline-none focus:border-[#0d9488] transition-colors duration-300 bg-transparent text-sm text-[#384022] autofill:shadow-[inset_0_0_0px_1000px_transparent] autofill:[-webkit-text-fill-color:inherit]"
      required={required}
    />
    <label
      htmlFor={id}
      className="absolute left-0 top-5 text-gray-400 text-sm tracking-wide transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#0d9488] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#0d9488]"
    >
      {label}
    </label>
  </div>
);

const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  autoComplete = "current-password",
  required = true,
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative pt-5">
      <input
        id={id}
        type={show ? "text" : "password"}
        placeholder=" "
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        className="peer border-b-2 border-gray-200 w-full pb-2 pr-8 focus:outline-none focus:border-[#0d9488] transition-colors duration-300 bg-transparent text-sm text-[#384022] autofill:shadow-[inset_0_0_0px_1000px_transparent] autofill:[-webkit-text-fill-color:inherit]"
      />
      <label
        htmlFor={id}
        className="absolute left-0 top-5 text-gray-400 text-sm tracking-wide transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#0d9488] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#0d9488]"
      >
        {label}
      </label>
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        tabIndex={-1}
        className="absolute right-0 bottom-2.5 text-gray-400 hover:text-[#0d9488] transition-colors duration-200 focus:outline-none cursor-pointer"
      >
        {show ? (
          <EyeOff size={15} strokeWidth={1.8} />
        ) : (
          <Eye size={15} strokeWidth={1.8} />
        )}
      </button>
    </div>
  );
};

const ErrorMessage = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-sm mb-4">
    {message}
  </div>
);

const SuccessMessage = ({ message }) => (
  <div className="bg-[#e1f5ee] border border-[#0d9488]/20 text-[#085041] px-4 py-2.5 rounded-xl text-sm mb-4 flex items-center gap-2">
    <span className="text-[#0d9488]">✓</span> {message}
  </div>
);

const SubmitButton = ({ loading, label, loadingLabel, icon: Icon }) => (
  <button
    type="submit"
    disabled={loading}
    className="bg-[#224D59] py-3 cursor-pointer w-full text-white font-semibold text-sm rounded-xl flex gap-2 items-center justify-center hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(34,77,89,0.3)] hover:bg-[#1A3A43] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
  >
    {loading ? (
      loadingLabel
    ) : (
      <>
        <Icon size={15} strokeWidth={2} />
        {label}
      </>
    )}
  </button>
);

const StepDots = ({ current }) => (
  <div className="flex items-center gap-2 mb-6">
    {[1, 2].map((s) => (
      <div
        key={s}
        className={`h-1.5 rounded-full transition-all duration-300 ${current >= s ? "bg-[#0d9488] w-6" : "bg-gray-200 w-3"}`}
      />
    ))}
    <span className="text-xs text-gray-400 ml-1">Step {current} of 2</span>
  </div>
);

const UserLogin = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("login");
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirm, setFpConfirm] = useState("");
  const [fpOtpSent, setFpOtpSent] = useState(false);
  const navigate = useNavigate();

  const clearError = (setter) => (e) => {
    setError("");
    setter(e.target.value);
  };

  const switchView = useCallback((v) => {
    setView(v);
    setError("");
    setSuccess("");
    setOtpSent(false);
    setFpOtpSent(false);
    setFpOtp("");
    setFpNewPassword("");
    setFpConfirm("");
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      switchView("login");
      setEmail("");
      setPassword("");
    }, 300);
  }, [onClose, switchView]);




  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, handleClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();


    
    if (loading) return; 


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
        handleClose();
        navigate(
          data.user.role === "admin" ? "/admin/dashboard" : "/intern/dashboard"
        );
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Cannot connect to server.");
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
        handleClose();
        navigate("/admin/dashboard", { replace: true });
      } else {
        setError(data.message || "Verification failed");
      }
    } catch {
      setError("Server error during registration");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSendOTP = async (e) => {
    e?.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setFpOtpSent(true);
        setSuccess(`OTP sent to ${fpEmail}`);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (fpNewPassword !== fpConfirm) {
      setError("Passwords do not match");
      return;
    }
    if (fpNewPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fpEmail,
          otp: fpOtp,
          newPassword: fpNewPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Password reset! Redirecting to login…");
        setTimeout(() => switchView("login"), 2000);
      } else {
        setError(data.message || "Reset failed. Check your OTP.");
      }
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const titles = {
    login: {
      h: "Welcome Back",
      p: "Sign in to track your internships and upcoming opportunities.",
    },
    register: {
      h: otpSent ? "Verify Your Email" : "Create Admin Account",
      p: otpSent
        ? `Enter the 6-digit code sent to ${email}`
        : "Register as an administrator to manage interns and oversee platform activities.",
    },
    forgot: {
      h: fpOtpSent ? "Reset Your Password" : "Forgot Password?",
      p: fpOtpSent
        ? "Enter the OTP and choose a new password."
        : "Enter your registered email and we'll send you a reset code.",
    },
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-30 p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative flex flex-col max-h-[75vh] overflow-y-auto"
        style={{ animation: "modalIn 0.25s cubic-bezier(0.22,1,0.36,1)" }}
      >
        <style>{`@keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>

        <div className="flex items-center justify-between px-7 pt-6 pb-2 shrink-0">
          <img
            src="/Logo.png"
            alt="Athenura"
            className="h-8 w-auto object-contain"
          />
          <div className="flex items-center gap-2">
            {view !== "login" && (
              <button
                onClick={() => switchView("login")}
                className="flex items-center gap-1 text-xs text-[#384022]/50 hover:text-[#224D59] transition-colors duration-200 cursor-pointer mr-1"
              >
                <ArrowLeft size={13} /> Login
              </button>
            )}
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#224D59] hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            >
              <X size={17} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="px-7 pt-4 pb-7">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-[#224D59] tracking-tight mb-1">
              {titles[view].h}
            </h2>
            <p className="text-[#384022]/60 text-xs leading-relaxed">
              {titles[view].p}
            </p>
          </div>

          {view === "forgot" && <StepDots current={fpOtpSent ? 2 : 1} />}
          {error && <ErrorMessage message={error} />}
          {success && <SuccessMessage message={success} />}

          {view === "login" && (
            <>
              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <FloatingInput
                  id="m-email"
                  type="email"
                  label="Email address"
                  value={email}
                  onChange={clearError(setEmail)}
                  autoComplete="email"
                />
                <PasswordInput
                  id="m-password"
                  label="Password"
                  value={password}
                  onChange={clearError(setPassword)}
                  autoComplete="current-password"
                />
                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    onClick={() => switchView("forgot")}
                    className="text-xs text-[#0d9488] hover:underline underline-offset-4 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <SubmitButton
                  loading={loading}
                  label="Sign In Securely"
                  loadingLabel="Verifying..."
                  icon={Lock}
                />
              </form>
              <p className="text-center mt-5 text-xs text-[#384022]/60">
                Need an admin account?{" "}
                <button
                  onClick={() => switchView("register")}
                  className="text-[#0d9488] font-medium hover:underline underline-offset-4 cursor-pointer"
                >
                  Sign up
                </button>
              </p>
            </>
          )}

          {view === "register" && (
            <>
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="flex flex-col gap-5">
                  <FloatingInput
                    id="m-name"
                    label="Full Name"
                    value={name}
                    onChange={clearError(setName)}
                  />
                  <FloatingInput
                    id="m-reg-email"
                    type="email"
                    label="Email"
                    value={email}
                    onChange={clearError(setEmail)}
                  />
                  <PasswordInput
                    id="m-reg-password"
                    label="Create Password"
                    value={password}
                    onChange={clearError(setPassword)}
                    autoComplete="new-password"
                  />
                  <FloatingInput
                    id="m-admin-secret"
                    label="Admin Secret Key"
                    value={adminSecret}
                    onChange={clearError(setAdminSecret)}
                  />
                  <SubmitButton
                    loading={loading}
                    label="Get Verification Code"
                    loadingLabel="Sending OTP..."
                    icon={Mail}
                  />
                </form>
              ) : (
                <form
                  onSubmit={handleVerifyOTP}
                  className="flex flex-col gap-5"
                >
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#e1f5ee] border border-[#0d9488]/20 rounded-xl">
                    <Mail
                      size={14}
                      strokeWidth={1.8}
                      className="text-[#0d9488] shrink-0"
                    />
                    <p className="text-xs text-[#085041]">
                      Code sent to{" "}
                      <span className="font-semibold">{email}</span>
                    </p>
                  </div>
                  <FloatingInput
                    id="m-otp"
                    label="6-Digit OTP"
                    value={otp}
                    onChange={clearError(setOtp)}
                    maxLength={6}
                    inputMode="numeric"
                  />
                  <SubmitButton
                    loading={loading}
                    label="Verify & Create Account"
                    loadingLabel="Finalizing..."
                    icon={UserPlus}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                      setError("");
                    }}
                    className="text-center text-xs text-[#0d9488] hover:underline underline-offset-4 cursor-pointer"
                  >
                    Edit details
                  </button>
                </form>
              )}
              <p className="text-center mt-5 text-xs text-[#384022]/60">
                Already registered?{" "}
                <button
                  onClick={() => switchView("login")}
                  className="text-[#0d9488] font-medium hover:underline underline-offset-4 cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </>
          )}

          {view === "forgot" && (
            <>
              {!fpOtpSent ? (
                <form
                  onSubmit={handleForgotSendOTP}
                  className="flex flex-col gap-5"
                >
                  <FloatingInput
                    id="m-fp-email"
                    type="email"
                    label="Registered Email"
                    value={fpEmail}
                    onChange={(e) => {
                      setError("");
                      setFpEmail(e.target.value);
                    }}
                    autoComplete="email"
                  />
                  <SubmitButton
                    loading={loading}
                    label="Send Reset Code"
                    loadingLabel="Sending OTP..."
                    icon={Mail}
                  />
                </form>
              ) : (
                <form
                  onSubmit={handleResetPassword}
                  className="flex flex-col gap-5"
                >
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#e1f5ee] border border-[#0d9488]/20 rounded-xl">
                    <Mail
                      size={14}
                      strokeWidth={1.8}
                      className="text-[#0d9488] shrink-0"
                    />
                    <p className="text-xs text-[#085041]">
                      Code sent to{" "}
                      <span className="font-semibold">{fpEmail}</span>
                    </p>
                  </div>
                  <FloatingInput
                    id="m-fp-otp"
                    label="6-Digit OTP"
                    value={fpOtp}
                    onChange={(e) => {
                      setError("");
                      setFpOtp(e.target.value);
                    }}
                    maxLength={6}
                    inputMode="numeric"
                  />
                  <PasswordInput
                    id="m-fp-newpass"
                    label="New Password"
                    value={fpNewPassword}
                    onChange={(e) => {
                      setError("");
                      setFpNewPassword(e.target.value);
                    }}
                    autoComplete="new-password"
                  />
                  <PasswordInput
                    id="m-fp-confirm"
                    label="Confirm New Password"
                    value={fpConfirm}
                    onChange={(e) => {
                      setError("");
                      setFpConfirm(e.target.value);
                    }}
                    autoComplete="new-password"
                  />
                  <SubmitButton
                    loading={loading}
                    label="Reset Password"
                    loadingLabel="Resetting..."
                    icon={KeyRound}
                  />
                  <div className="flex justify-between text-xs text-[#384022]/50">
                    <button
                      type="button"
                      onClick={() => {
                        setFpOtpSent(false);
                        setFpOtp("");
                        setError("");
                        setSuccess("");
                      }}
                      className="flex items-center gap-1 hover:text-[#0d9488] transition-colors cursor-pointer"
                    >
                      <RotateCcw size={11} /> Change email
                    </button>
                    <button
                      type="button"
                      onClick={handleForgotSendOTP}
                      className="hover:text-[#0d9488] transition-colors cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  </div>
                </form>
              )}
              <p className="text-center mt-5 text-xs text-[#384022]/60">
                Remembered it?{" "}
                <button
                  onClick={() => switchView("login")}
                  className="text-[#0d9488] font-medium hover:underline underline-offset-4 cursor-pointer"
                >
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
