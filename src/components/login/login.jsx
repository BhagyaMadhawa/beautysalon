import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { FaApple } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Alert from "../Alert";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Flash support (shown when redirected here after registration)
  const location = useLocation();
  const [flash, setFlash] = useState(() => {
    // Prefer navigation state; fall back to sessionStorage (survives reload)
    if (location.state?.flash) return location.state.flash;
    try {
      const saved = sessionStorage.getItem("flash");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  useEffect(() => {
    if (location.state?.flash) {
      sessionStorage.setItem("flash", JSON.stringify(location.state.flash));
    }
  }, [location.state?.flash]);
  const dismissFlash = () => {
    setFlash(null);
    sessionStorage.removeItem("flash");
  };

  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) return setError("Email is required");
    if (!emailRegex.test(email)) return setError("Enter a valid email address");
    if (!password) return setError("Password is required");

    setLoading(true);
    try {
      await authLogin(email, password);
      // AuthContext handles navigation after successful login
    } catch (err) {
      const msg = String(err.message || "");
      if (/awaiting approval/i.test(msg)) setError(msg);
      else if (/invalid/i.test(msg)) setError("Invalid email or password");
      else setError(msg || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-white flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Flash toast pinned at top (no design changes to your layout) */}
      {flash && (
        <div className="w-full flex justify-center pt-4">
          <div className="w-full sm:max-w-md md:max-w-[45%]">
            <Alert
              type={flash.type || "success"}
              title={flash.title || "Success"}
              message={flash.message || ""}
              duration={flash.duration ?? 6000}
              onClose={dismissFlash}
            />
          </div>
        </div>
      )}

      {/* Top-right link */}
      <div className="w-full flex justify-end p-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/regprofe2" className="text-sm text-puce hover:underline">
            Looking for work? <span className="underline">Join as a service provider</span>
          </Link>
        </motion.div>
      </div>

      {/* Centered login form */}
      <div className="flex flex-1 flex-col items-center px-4">
        <motion.div
          className="w-full sm:max-w-md md:max-w-[45%]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="text-center mb-2 text-black font-medium">Welcome Back!</div>
          <h1 className="text-2xl sm:text-3xl text-black font-bold mb-6 text-center">
            Login to your account
          </h1>

          {/* Socials (placeholder) */}
          <div className="flex gap-2 mb-4">
            <motion.button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-2xl py-2 font-medium hover:border-puce text-black transition"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaApple className="w-5 h-5" />
              Continue with Apple
            </motion.button>
            <motion.button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-2xl py-2 font-medium hover:border-puce text-black transition"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </motion.button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter email address..."
                  className="w-full border border-gray-200 rounded-lg py-2 pl-10 pr-3 text-sm focus:outline-none focus:border-puce transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Type here..."
                  className="w-full border border-gray-200 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:border-puce transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Stay login + forgot */}
            <div className="flex items-center justify-between mb-5">
              <label className="flex items-center gap-1 text-xs text-puce font-medium">
                <input
                  type="checkbox"
                  className="accent-puce rounded"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Stay login
              </label>
              <Link to="/forgot-password" className="text-xs text-puce hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Error */}
            {error && <div className="mb-3 text-center text-red-500 text-sm">{error}</div>}

            {/* Submit */}
            <motion.button
              className="w-full bg-puce hover:bg-puce1-600 text-white font-semibold py-2 rounded-lg transition mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          {/* Sign up link */}
          <div className="text-center text-sm text-gray-700">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-puce underline hover:text-puce1-600">
              Sign up
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
