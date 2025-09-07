import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaApple } from "react-icons/fa";
import { Eye, EyeOff, Mail, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

export default function SignupSalonOwner() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profile, setProfile] = useState(null); // File for upload
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword || !country || !city || !postcode || !fullAddress) {
      setError("Please fill out all fields.");
      return false;
    }
    if (!emailRegex.test(email)) {
      setError("Enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    setError(null);
    return true;
  };

  // Optional helper: upload profile image (only if your backend allows unauthenticated upload)
  const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append("profile_image", file);
    const res = await fetch("https://beautysalon-qq6r.vercel.app/api/salons/upload/profile-image", { method: "POST", body: formData });
    if (!res.ok) throw new Error((await res.json()).error || "Failed to upload profile image.");
    const data = await res.json();
    return data.imageUrl; // server returns { imageUrl }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      let profile_image_url = null;

      // Upload profile image first (optional)
      if (profile) {
        try {
          profile_image_url = await uploadProfileImage(profile);
        } catch (upErr) {
          setError(upErr.message);
          setLoading(false);
          return;
        }
      }

      // Create Owner User (no token)
      const response = await api("/api/salons/owneuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          password,
          country: country.trim(),
          city: city.trim(),
          postcode: postcode.trim(),
          full_address: fullAddress.trim(),
          profile_image_url, // may be null
          // backend can default login_type='email', requesting_role='owner'
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Signup failed");
      } else {
        const userId = data.user_id;
        localStorage.setItem("owner_user_id", String(userId));
        navigate("/regsal2", { state: { userId } });
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfile(file); // keep file (we compute preview URL below)
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, type: "spring" },
    }),
  };

  return (
    <motion.div
      className="min-h-screen bg-white flex flex-col items-center px-2"
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
    >
      <div className="w-full flex justify-end p-4">
        <motion.a href="#" className="text-sm text-puce hover:underline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Looking for work? <span className="underline">Join as a service provider</span>
        </motion.a>
      </div>

      <motion.h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black text-center mt-10 mb-6" variants={fadeInUp} custom={1}>
        Register Owner Account
      </motion.h1>

      <motion.div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto mb-4" variants={fadeInUp} custom={2}>
        <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-full py-2 font-medium hover:border-puce text-black transition">
          <FaApple className="w-5 h-5" />
          Continue with Apple
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-full py-2 font-medium hover:border-puce text-black transition">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
      </motion.div>

      <motion.div className="flex items-center gap-3 w-full max-w-md mx-auto mb-4" variants={fadeInUp} custom={3}>
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-xs text-gray-400">OR</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </motion.div>

      {/* Profile upload (preview only) */}
      <motion.label
        htmlFor="profile-upload"
        className="block w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full border-2 border-dashed border-puce flex flex-col items-center justify-center text-center cursor-pointer mb-6 relative bg-white transition hover:bg-puce/10"
        variants={fadeInUp}
        custom={4}
      >
        {profile ? (
          <img src={URL.createObjectURL(profile)} alt="Profile" className="w-full h-full object-cover rounded-full" />
        ) : (
          <>
            <Upload className="w-6 h-6 mx-auto text-puce mb-2" />
            <span className="font-semibold text-md text-puce">Add Profile</span>
            <span className="text-xs text-gray-500">Drag &amp; Drop or click here<br />to upload image</span>
          </>
        )}
        <input id="profile-upload" type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleProfileChange} />
      </motion.label>

      {/* Signup Form with validation */}
      <motion.form className="w-full max-w-2xl mx-auto space-y-4" variants={fadeInUp} custom={5} onSubmit={handleSubmit}>
        {/* Name and Email */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col text-gray-900 text-sm">
            <label className="mb-1">First Name</label>
            <input type="text" placeholder="Type here..." className="border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition" value={firstName} onChange={(e) => setFirstName(e.target.value)} aria-label="First Name" />
          </div>
          <div className="flex-1 flex flex-col text-gray-900 text-sm">
            <label className="mb-1">Last Name</label>
            <input type="text" placeholder="Type here..." className="border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition" value={lastName} onChange={(e) => setLastName(e.target.value)} aria-label="Last Name" />
          </div>
          <div className="flex-1 flex flex-col text-gray-900 text-sm">
            <label className="mb-1">E-mail</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" placeholder="Enter email address..." className="w-full border border-gray-200 rounded-lg py-2 pl-10 pr-3 text-sm focus:outline-none focus:border-puce transition" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" />
            </div>
          </div>
        </div>

        {/* Passwords */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col text-gray-900 text-sm">
            <label className="mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="Type here..." className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition" value={password} onChange={(e) => setPassword(e.target.value)} aria-label="Password" />
              <button type="button" tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? (<EyeOff className="w-4 h-4" />) : (<Eye className="w-4 h-4" />)}
              </button>
            </div>
          </div>
          <div className="flex-1 flex flex-col text-gray-900 text-sm">
            <label className="mb-1">Confirm Password</label>
            <div className="relative">
              <input type={showConfirm ? "text" : "password"} placeholder="Type here..." className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} aria-label="Confirm Password" />
              <button type="button" tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowConfirm((v) => !v)}>
                {showConfirm ? (<EyeOff className="w-4 h-4" />) : (<Eye className="w-4 h-4" />)}
              </button>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div>
          <div className="font-semibold text-gray-900 mb-1">Address</div>
          <div className="text-xs text-gray-500 mb-2">Enter your location to find service providers near you</div>
          <div className="flex flex-col md:flex-row gap-4 mb-2">
            <div className="flex-1 flex flex-col text-gray-900 text-sm">
              <label className="mb-1">Country</label>
              <select className="border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition" value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="">Select here...</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="jp">Japan</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col text-gray-900 text-sm">
              <label className="mb-1">City / District</label>
              <input type="text" placeholder="Select here..." className="border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition" aria-label="City/District" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="flex-1 flex flex-col text-gray-900 text-sm">
              <label className="mb-1">Post Code</label>
              <input type="text" placeholder="Type here..." className="border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition" aria-label="Postcode" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col text-gray-900 text-sm">
            <label className="mb-1">Full Address</label>
            <input type="text" placeholder="Type here..." className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition" aria-label="Full Address" value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} />
          </div>
        </div>

        <motion.button className="w-full bg-puce hover:bg-puce1-600 text-white font-semibold py-3 rounded-lg transition mt-4" type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} disabled={loading}>
          {loading ? "Signing up..." : "Create my account"}
        </motion.button>

        {error && <div className="text-center text-red-500 text-sm mt-2">{error}</div>}

        <div className="text-center text-sm text-gray-700 mt-3">
          Already have an account?{" "}
          <a href="#" className="text-puce underline hover:text-puce1-600">Log in</a>
        </div>
      </motion.form>
    </motion.div>
  );
}
