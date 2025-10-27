// src/pages/BeautyProfessional/ProReg1.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Check } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../../lib/api";

const socialOptions = [
  { label: "Facebook", icon: <FaFacebookF className="text-blue-600" />, value: "facebook", placeholder: "https://www.facebook.com/" },
  { label: "Instagram", icon: <FaInstagram className="text-pink-500" />, value: "instagram", placeholder: "https://www.instagram.com/" },
  { label: "Tiktok", icon: <FaTiktok className="text-black" />, value: "tiktok", placeholder: "https://www.tiktok.com/" },
];

// Stepper (01 already done, 02 current)
const stepLabels = ["01", "02", "03", "04", "05"];

export default function ProReg1() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId || null;

  // Profile image file for upload
  const [profile, setProfile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  // Professional public profile fields
  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [languages, setLanguages] = useState([]); // e.g., ["English","Korean"]
  const [description, setDescription] = useState("");

  // Public contact & address
  const [publicEmail, setPublicEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  // Socials & certs
  const [socialLinks, setSocialLinks] = useState([
    { platform: "facebook", url: "https://www.facebook.com/" },
    { platform: "instagram", url: "https://www.instagram.com/" },
    { platform: "tiktok", url: "https://www.tiktok.com/" },
  ]);

  const [certifications, setCertifications] = useState([
    { certificate: "", issuedDate: "", certificationId: "", certificationUrl: "" },
  ]);

  // UX
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- handlers ---
  const handleProfileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile(file);
      const previewUrl = URL.createObjectURL(file);
      setProfilePreview(previewUrl);
    }
  };

  const handleSocialChange = (idx, field, value) =>
    setSocialLinks((prev) => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));

  const handleAddSocial = () =>
    setSocialLinks((prev) => [...prev, { platform: "facebook", url: "" }]);

  const handleRemoveSocial = (idx) =>
    setSocialLinks((prev) => prev.filter((_, i) => i !== idx));

  const handleAddCertification = () =>
    setCertifications((prev) => [
      ...prev,
      { certificate: "", issuedDate: "", certificationId: "", certificationUrl: "" },
    ]);

  const handleCertificationChange = (index, field, value) =>
    setCertifications((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );

  // simple chip toggle for languages
  const toggleLanguage = (lang) =>
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );

  // Optional helper: upload profile image (only if your backend allows unauthenticated upload)
  const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append("profile_image", file);
    const res = await fetch("https://beautysalon-qq6r.vercel.app/api/salons/upload/profile-image", { method: "POST", body: formData });
    if (!res.ok) throw new Error((await res.json()).error || "Failed to upload profile image.");
    const data = await res.json();
    return data.imageUrl; // server returns { imageUrl }
  };

  // Submit to backend (auth required; cookie is set in Step 1)
  const onNext = async (e) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) return setError("Full name is required");

    try {
      setLoading(true);

      let profileImageUrl = null;

      // Upload profile image first if selected
      if (profile) {
        try {
          profileImageUrl = await uploadProfileImage(profile);
        } catch (err) {
          setError(err.message);
          setLoading(false);
          return;
        }
      }

      // Now send profile data with uploaded image URL
      const payload = {
        userId: userId, // Add userId to payload

        // maps to salons.* fields
        name: fullName.trim(),
        email: publicEmail.trim() || null,
        phone: phone.trim() || null,
        description: description.trim() || null,

        // extra (safe to ignore server-side if not stored)
        title: title.trim() || null,
        experience: experience.trim() || null,
        languages,
        profile_image_url: profileImageUrl,

        address: {
          country: country || null,
          city: city || null,
          postcode: postcode || null,
          full_address: fullAddress || null,
        },
        socialLinks: socialLinks
          .map((s) => ({ platform: s.platform, url: (s.url || "").trim() }))
          .filter((s) => s.url.length > 0),
        certifications: certifications
          .map((c) => ({
            certificate: (c.certificate || "").trim(),
            issuedDate: c.issuedDate || null,
            certificationId: (c.certificationId || "").trim() || null,
            certificationUrl: (c.certificationUrl || "").trim() || null,
          }))
          .filter((c) => c.certificate.length > 0),
      };

      const res = await fetch("https://beautysalon-qq6r.vercel.app/api/pro/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save details");
        setLoading(false);
        return;
      }
      if (data.salon_id) {
        navigate("/regprofe2", { state: { salon_id: data.salon_id, userId } });
      }
    } catch (err) {
      setError(err.message || "Failed to save details");
    } finally {
      setLoading(false);
    }
  };

  // anim
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
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
      }}
    >
      {/* Stepper: 01 done, 02 current */}
      <div className="w-full flex justify-center mt-6 mb-4">
        <div className="flex items-center gap-3">
          {stepLabels.map((label, idx) => (
            <React.Fragment key={label}>
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-full border-2 text-base font-semibold ${
                  idx === 0
                    ? "bg-rose-taupe text-white border-rose-taupe" // done
                    : idx === 1
                    ? "border-2 border-puce bg-white text-puce" // current
                    : "bg-white text-gray-400 border-gray-200" // pending
                }`}
              >
                {idx === 0 ? <Check className="w-5 h-5" /> : label}
              </div>
              {idx < stepLabels.length - 1 && (
                <div className={`h-1 rounded ${idx === 0 ? "bg-rose-taupe" : "bg-gray-200"} w-10`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-black text-center mb-6"
        variants={fadeInUp}
        custom={1}
      >
        Tell us about yourself
      </motion.h1>

      {/* Profile upload (preview only) */}
      <motion.label
        htmlFor="profile-upload"
        className="block w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full border-2 border-dashed border-puce flex flex-col items-center justify-center text-center cursor-pointer mb-6 relative bg-white transition hover:bg-puce/10"
        variants={fadeInUp}
        custom={2}
      >
        {profilePreview ? (
          <img src={profilePreview} alt="Profile" className="w-full h-full object-cover rounded-full" />
        ) : (
          <>
            <Upload className="w-6 h-6 mx-auto text-puce mb-2" />
            <span className="font-semibold text-md text-puce">Add Profile</span>
            <span className="text-xs text-gray-500">
              Drag &amp; Drop or click here<br />to upload image
            </span>
          </>
        )}
        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleProfileChange}
        />
      </motion.label>

      {/* FORM */}
      <motion.form
        className="w-full max-w-full sm:max-w-2xl md:max-w-4xl bg-white p-4 sm:p-8 space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={onNext}
      >
        {/* Full name, title, experience */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="mb-1 block">Full Name</label>
            <input
              className="border border-gray-300 rounded-lg py-2 px-3 text-sm w-full"
              placeholder="Type here..."
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block">Title</label>
            <input
              className="border border-gray-300 rounded-lg py-2 px-3 text-sm w-full"
              placeholder="Hair Stylist"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block">Experience</label>
            <input
              className="border border-gray-300 rounded-lg py-2 px-3 text-sm w-full"
              placeholder="e.g. 3 years"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>
        </div>

        {/* Languages (simple chip toggle) */}
        <div>
          <label className="mb-1 block">Languages</label>
          <div className="flex flex-wrap gap-2">
            {["English", "Korean", "Japanese", "Spanish"].map((lang) => {
              const active = languages.includes(lang);
              return (
                <button
                  type="button"
                  key={lang}
                  className={`px-3 py-1 rounded-full border text-sm ${
                    active ? "bg-puce text-white border-puce" : "bg-white text-gray-700 border-gray-300"
                  }`}
                  onClick={() => toggleLanguage(lang)}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="mb-1 block">Tell us about you</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm min-h-[80px]"
            placeholder="Enter a brief description here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Address */}
        <div>
          <div className="font-semibold text-gray-900 mb-2">Address</div>
          <div className="flex flex-col sm:flex-row gap-4 mb-2">
            <div className="flex-1">
              <label className="mb-1 block">Country</label>
              <select
                className="border border-gray-300 rounded-lg py-2 px-3 text-sm w-full"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Select here...</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="JP">Japan</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1 block">City/District</label>
              <input
                className="border border-gray-300 rounded-lg py-2 px-3 text-sm w-full"
                placeholder="Type here..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block">Postcode</label>
              <input
                className="border border-gray-300 rounded-lg py-2 px-3 text-sm w-full"
                placeholder="Type here..."
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block">Full Address</label>
            <input
              className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm"
              placeholder="Type here..."
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
            />
          </div>
        </div>

        {/* Socials */}
        <div>
          <div className="font-semibold text-gray-900 mb-2">Add Social Media Links</div>
          <AnimatePresence>
            {socialLinks.map((link, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col md:flex-row items-center gap-2 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <select
                  className="border border-gray-300 rounded-lg py-2 px-2 text-sm w-full md:w-auto"
                  value={link.platform}
                  onChange={(e) => handleSocialChange(idx, "platform", e.target.value)}
                >
                  {socialOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="w-8 flex justify-center items-center">
                  {socialOptions.find((opt) => opt.value === link.platform)?.icon}
                </div>
                <input
                  className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm w-full md:w-auto"
                  placeholder={socialOptions.find((opt) => opt.value === link.platform)?.placeholder}
                  value={link.url}
                  onChange={(e) => handleSocialChange(idx, "url", e.target.value)}
                />
                <button
                  type="button"
                  className="text-gray-400 hover:text-red-500 transition"
                  onClick={() => handleRemoveSocial(idx)}
                  aria-label="Remove"
                >
                  &times;
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            type="button"
            className="flex items-center gap-2 bg-puce text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-puce1-600 transition"
            onClick={handleAddSocial}
          >
            + Add another
          </button>
        </div>

        {/* Certifications */}
        <div>
          <div className="font-semibold text-gray-900 mb-2">Add Certifications</div>
          <AnimatePresence>
            {certifications.map((cert, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col sm:flex-row gap-4 mb-2 grid grid-cols-6 sm:gap-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex-1 flex lg:col-span-4 flex-col text-gray-900 text-sm">
                  <label className="mb-1">Certificate</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition mb-2"
                    placeholder="Type here..."
                    aria-label="Certificate"
                    value={cert.certificate}
                    onChange={(e) => handleCertificationChange(idx, "certificate", e.target.value)}
                  />
                </div>
                <div className="flex-1 flex flex-col text-gray-900 text-sm">
                  <label className="mb-1">Issued Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition mb-2"
                    aria-label="Issued Date"
                    value={cert.issuedDate}
                    onChange={(e) => handleCertificationChange(idx, "issuedDate", e.target.value)}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row gap-4 mb-2">
            <div className="flex-1 flex flex-col text-gray-900 text-sm">
              <label className="mb-1">Certification ID (Optional)</label>
              <input
                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm"
                placeholder="Type here..."
                value={certifications.at(-1)?.certificationId || ""}
                onChange={(e) =>
                  handleCertificationChange(
                    certifications.length - 1,
                    "certificationId",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="flex-1 flex flex-col text-gray-900 text-sm">
              <label className="mb-1">Certification URL (Optional)</label>
              <input
                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm"
                placeholder="https://..."
                value={certifications.at(-1)?.certificationUrl || ""}
                onChange={(e) =>
                  handleCertificationChange(
                    certifications.length - 1,
                    "certificationUrl",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 bg-puce text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-puce1-600 transition mb-2"
            onClick={handleAddCertification}
          >
            + Add another
          </button>
        </div>

        {/* Error */}
        {error && <div className="text-center text-red-500 text-sm">{error}</div>}

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button
            type="button"
            className="w-full sm:w-32 border border-gray-300 text-gray-700 bg-white rounded-lg py-2 font-medium hover:bg-gray-50 transition"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            className="w-full sm:w-32 bg-puce text-white rounded-lg py-2 font-medium hover:bg-puce1-600 transition disabled:opacity-60"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
          >
            {loading ? "Saving..." : "Next"}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}
