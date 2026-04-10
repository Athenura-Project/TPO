import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  ChartLine,
  Lock,
  Shield,
  ShieldCheck,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  // const [role, setRole] = useState("intern");
  const [registration, setRegistration] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {

  }
  return (
    <div className="flex justify-center">
      <div className="hidden lg:block md:w-1/2 lg:w-3/5 h-screen top-0 relative">
        <img
          src="https://res.cloudinary.com/drq2a0262/image/upload/q_auto/f_auto/v1775484772/login-image_liqmh5.webp"
          alt="login-image"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-700/60 h-full w-full flex flex-col justify-center px-10 gap-3">
          <h1 className="text-5xl font-bold text-white">
            TPO Generation and Management
          </h1>
          <p className="text-slate-100">
            Streamline your Training & Placement Opportunity pipeline with
            role-based dashboards and automated workflows.
          </p>
          <div className="flex flex-col gap-5 mt-10">
            <div className="flex items-center gap-3">
              <div className="text-white bg-amber-500 p-2.5 rounded-lg">
                <ChartLine />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">
                  Real Time Analytics
                </h4>
                <p className="text-slate-100 text-sm">
                  Live dashboards with conversion rates & intern rankings
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-white bg-green-500 p-2.5 rounded-lg">
                <Users />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">
                  Role-based Access
                </h4>
                <p className="text-slate-100 text-sm">
                  Separate intern & admin dashboards with JWT auth
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-white bg-purple-600 p-2.5 rounded-lg">
                <Shield />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">
                  Enterprise Security
                </h4>
                <p className="text-slate-100 text-sm">
                  bcrypt hashing, Helmet.js & rate limiting built-in
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-white bg-pink-500 p-2.5 rounded-lg">
                <Calendar />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">
                  Smart Automation
                </h4>
                <p className="text-slate-100 text-sm">
                  node-cron follow-up reminders & bulk CSV/XLSX import
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {!registration && (
        <div className="px-5 lg:px-20 flex flex-col justify-center h-screen gap-3 max-w-125 lg:max-w-150">
          <div className="flex justify-between items-center">
            <img
              src="/Logo.png"
              alt="Athenura Logo"
              className="h-12 w-auto object-contain"
            />
            <button
              onClick={() => navigate("/")}
              className="cursor-pointer flex gap-2 border border-gray-400 px-3 py-2 rounded-lg hover:-translate-y-1 hover:scale-102 hover:border-gray-600 active:scale-95 duration-200 transition-transform group"
            >
              <ArrowLeft className="group-hover:-translate-x-2 duration-200 transition-transform" />{" "}
              Back to Home
            </button>
          </div>
          <h1 className="text-3xl font-bold">Access Your Placement Journey</h1>
          <p className="font-serif text-slate-600 text-sm">
            Sign in to track your internships, training progress, and upcoming
            opportunities — all in one place.
          </p>

          <form>
            {/* admin or intern button */}
            {/* <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRole("intern")}
                className={`group flex flex-col items-center justify-center cursor-pointer gap-1.5 py-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium
      ${
        role === "intern"
          ? "bg-blue-50 border-blue-500 text-blue-600"
          : "bg-transparent border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500"
      } hover:-translate-y-1 hover:scale-102 duration-200 transition-transform active:scale-95`}
              >
                <User
                  size={22}
                  strokeWidth={1.8}
                  className="group-hover:rotate-5 group-hover:scale-105 group-hover:-tranlate-y-0.5 duration-200 transition-transform"
                />
                Intern
              </button>

              <button
                onClick={() => setRole("admin")}
                className={`group flex flex-col items-center justify-center cursor-pointer gap-1.5 py-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium
      ${
        role === "admin"
          ? "bg-blue-50 border-blue-500 text-blue-600"
          : "bg-transparent border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500"
      } hover:-translate-y-1 hover:scale-102 duration-200 transition-transform active:scale-95`}
              >
                <ShieldCheck
                  size={22}
                  strokeWidth={1.8}
                  className="group-hover:rotate-5 group-hover:scale-105 group-hover:-tranlate-y-0.5 duration-200 transition-transform"
                />
                Admin
              </button>
            </div> */}

            <div className="flex flex-col gap-10 mt-2">
              {/* Email */}
              <div className="relative pt-5">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder=" "
                  className="peer border-b border-blue-600 w-full pb-1 focus:outline-none
                 autofill:shadow-[inset_0_0_0px_1000px_transparent] autofill:[-webkit-text-fill-color:inherit]"
                  required
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 top-5 text-gray-400 tracking-wider transition-all duration-300 pointer-events-none
                 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600
                 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-blue-600"
                >
                  Email
                </label>
              </div>

              {/* Password */}
              <div className="relative pt-5">
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder=" "
                  className="peer border-b border-blue-600 w-full pb-1 focus:outline-none
                 autofill:shadow-[inset_0_0_0px_1000px_transparent] autofill:[-webkit-text-fill-color:inherit]"
                  required
                />
                <label
                  htmlFor="password"
                  className="absolute left-0 top-5 text-gray-400 tracking-wider transition-all duration-300 pointer-events-none
                 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600
                 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-blue-600"
                >
                  Password
                </label>
              </div>

              {/* admin-secret key
              <div
                className={`relative pt-5 transition-all duration-300 ease-in-out
  ${
    role === "admin"
      ? "opacity-100 translate-y-0 pointer-events-auto"
      : "opacity-0 -translate-y-2 pointer-events-none h-0 overflow-hidden"
  }`}
              >
                <input
                  id="admin-secret"
                  type="text"
                  name="admin-secret"
                  placeholder=" "
                  className="peer border-b border-blue-600 w-full pb-1 focus:outline-none
                 autofill:shadow-[inset_0_0_0px_1000px_transparent] autofill:[-webkit-text-fill-color:inherit]"
                  required
                />
                <label
                  htmlFor="admin-secret"
                  className="absolute left-0 top-5 text-gray-400 tracking-wider transition-all duration-300 pointer-events-none
                 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600
                 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-blue-600"
                >
                  Admin Secret
                </label>
              </div> */}
            </div>
             <button onClick={handleSubmit} className="bg-teal-500 py-2.5 cursor-pointer mt-5 w-full text-white font-medium rounded-lg flex gap-2 justify-center hover:-translate-y-1 hover:shadow:xl hover:scale-102 active:scale-95 transition-transform duration-200 mb-2"><Lock />Sign In Securely</button>
          </form>
          <p className="text-center">
            <span
              className="text-sm inline-block cursor-pointer text-blue-600 hover:-translate-y-1 duration-200 transition-transform"
              onClick={() => setRegistration(!registration)}
            >
              Need an admin account? Sign up
            </span>
          </p>
        </div>
      )}

      {registration && (
        <div className="px-5 lg:px-20 flex flex-col justify-center h-screen gap-3 max-w-125 lg:max-w-150">
          <div className="flex justify-between items-center">
            <img
              src="/Logo.png"
              alt="Athenura Logo"
              className="h-12 w-auto object-contain"
            />
            <button
              onClick={() => navigate("/")}
              className="cursor-pointer flex gap-2 border border-gray-400 px-3 py-2 rounded-lg hover:-translate-y-1 hover:scale-102 hover:border-gray-600 active:scale-95 duration-200 transition-transform group"
            >
              <ArrowLeft className="group-hover:-translate-x-2 duration-200 transition-transform" />{" "}
              Back to Home
            </button>
          </div>
          <h1 className="text-3xl font-bold">Create Admin Account</h1>
          <p className="font-serif text-slate-600 text-sm">
            Register as an administrator to manage interns, track progress, and
            oversee platform activities securely.
          </p>

          <form>

            <div className="flex flex-col gap-5 mt-2">
              {/* username */}
              <div className="relative pt-5">
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder=" "
                  className="peer border-b border-blue-600 w-full pb-1 focus:outline-none
                 autofill:shadow-[inset_0_0_0px_1000px_transparent] autofill:[-webkit-text-fill-color:inherit]"
                  required
                />
                <label
                  htmlFor="username"
                  className="absolute left-0 top-5 text-gray-400 tracking-wider transition-all duration-300 pointer-events-none
                 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600
                 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-blue-600"
                >
                  Username
                </label>
              </div>
              {/* Email */}
              <div className="relative pt-5">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder=" "
                  className="peer border-b border-blue-600 w-full pb-1 focus:outline-none
                 autofill:shadow-[inset_0_0_0px_1000px_transparent] autofill:[-webkit-text-fill-color:inherit]"
                  required
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 top-5 text-gray-400 tracking-wider transition-all duration-300 pointer-events-none
                 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600
                 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-blue-600"
                >
                  Email
                </label>
              </div>

              {/* Password */}
              <div className="relative pt-5">
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder=" "
                  className="peer border-b border-blue-600 w-full pb-1 focus:outline-none
                 autofill:shadow-[inset_0_0_0px_1000px_transparent] autofill:[-webkit-text-fill-color:inherit]"
                  required
                />
                <label
                  htmlFor="password"
                  className="absolute left-0 top-5 text-gray-400 tracking-wider transition-all duration-300 pointer-events-none
                 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600
                 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-blue-600"
                >
                  Password
                </label>
              </div>

              {/* admin-secret key */}
              <div
                className={`relative pt-5 transition-all duration-300 ease-in-out`}
              >
                <input
                  id="admin-secret"
                  type="text"
                  name="admin-secret"
                  placeholder=" "
                  className="peer border-b border-blue-600 w-full pb-1 focus:outline-none
                 autofill:shadow-[inset_0_0_0px_1000px_transparent] autofill:[-webkit-text-fill-color:inherit]"
                  required
                />
                <label
                  htmlFor="admin-secret"
                  className="absolute left-0 top-5 text-gray-400 tracking-wider transition-all duration-300 pointer-events-none
                 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-600
                 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-blue-600"
                >
                  Admin Secret Key
                </label>
              </div>
            </div>
            <button onClick={handleSubmit} className="bg-teal-500 py-2.5 cursor-pointer mt-5 w-full text-white font-medium rounded-lg flex gap-2 justify-center hover:-translate-y-1 hover:shadow:xl hover:scale-102 active:scale-95 transition-transform duration-200"><UserPlus />Create Admin Account</button>
          </form>
          <p className="text-center">
            <span
              className="text-sm inline-block cursor-pointer text-blue-600 hover:-translate-y-1 duration-200 transition-transform"
              onClick={() => setRegistration(!registration)}
            >
              Already have an account? Sign in
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default UserLogin;
