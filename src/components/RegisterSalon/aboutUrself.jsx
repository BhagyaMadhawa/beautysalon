import React, { useState } from "react";
import { motion,AnimatePresence } from "framer-motion";
import { FaApple } from "react-icons/fa";
import { Eye, EyeOff, Mail, Upload } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const socialOptions = [
  { label: "Facebook", icon: <FaFacebookF className="text-blue-600" />, value: "facebook", placeholder: "https://www.facebook.com/" },
  { label: "Instagram", icon: <FaInstagram className="text-pink-500" />, value: "instagram", placeholder: "https://www.instagram.com/" },
  { label: "Tiktok", icon: <FaTiktok className="text-black" />, value: "tiktok", placeholder: "https://www.tiktok.com/" },
];
const stepLabels = ["01", "02", "03", "04", "05"];

export default function SignupPage2() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profile, setProfile] = useState(null);

  const [socialLinks, setSocialLinks] = useState([
      { platform: "facebook", url: "https://www.facebook.com/" },
      { platform: "instagram", url: "https://www.instagram.com/" },
      { platform: "tiktok", url: "https://www.instagram.com/" },
    ]);
  
  const handleSocialChange = (idx, field, value) => {
    setSocialLinks((prev) =>
      prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l))
    );
  };
  
  const handleAddSocial = () => {
    setSocialLinks((prev) => [
      ...prev,
      { platform: "facebook", url: "" },
    ]);
  };
  
  const handleRemoveSocial = (idx) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== idx));
  };

  // New state for certifications
  const [certifications, setCertifications] = useState([
    { certificate: "", issuedDate: "", certificationId: "", certificationUrl: "" }
  ]);

  // Function to add another certification entity
  const handleAddCertification = () => {
    setCertifications((prev) => [
      ...prev,
      { certificate: "", issuedDate: "", certificationId: "", certificationUrl: "" }
    ]);
  };

  // Function to handle changes in certification inputs
  const handleCertificationChange = (index, field, value) => {
    setCertifications((prev) =>
      prev.map((cert, i) =>
        i === index ? { ...cert, [field]: value } : cert
      )
    );
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, type: "spring" },
    }),
  };

  // Simple drag & drop handler (no upload logic)
  const handleProfileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfile(URL.createObjectURL(file));
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
      <div className="w-full flex justify-end p-4">
        <motion.a
          href="#"
          className="text-sm text-puce hover:underline"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Looking for work? <span className="underline">Join as a service provider</span>
        </motion.a>
      </div>
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-black text-center mt-10 mb-6"
        variants={fadeInUp}
        custom={1}
      >
        Tell us about yourself 
      </motion.h1>

       {/* Stepper */}
            <motion.div className="flex flex-wrap justify-center items-center gap-4 mb-8">
              {stepLabels.map((label, idx) => (
                <React.Fragment key={label}>
                  <motion.div
                    className={`flex items-center justify-center w-9 h-9 rounded-full border-2 text-base font-semibold
                      ${idx === 0
                        ? "bg-puce text-white border-puce"
                        : "bg-white text-gray-400 border-gray-200"}
                    `}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.05 * idx }}
                  >
                    {label}
                  </motion.div>
                  {idx < stepLabels.length - 1 && (
                    <div className="w-10 h-1 rounded bg-gray-200" />
                  )}
                </React.Fragment>
              ))}
            </motion.div>

     
      {/* Profile upload */}
      <motion.label
        htmlFor="profile-upload"
        className="block w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full border-2 border-dashed border-puce flex flex-col items-center justify-center text-center cursor-pointer mb-6 relative bg-white transition hover:bg-puce/10"
        variants={fadeInUp}
        custom={4}
      >
        {profile ? (
          <img
            src={profile}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
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

      {/* Form */}
      <motion.form
              className="w-full max-w-full sm:max-w-2xl md:max-w-4xl bg-white p-4 sm:p-8 space-y-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Salon Name, Email, Phone */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col text-gray-900 text-sm">
                  <label className="mb-1">Salon Name</label>
                  <input
                    className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                    placeholder="Type here..."
                    aria-label="Salon Name"
                  />
                </div>
                <div className="flex-1 flex flex-col text-gray-900 text-sm">
                  <label className="mb-1">Email</label>
                  <input
                    className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                    placeholder="Enter email address..."
                    aria-label="Email"
                    type="email"
                  />
                </div>
                <div className="flex-1 flex flex-col text-gray-900 text-sm">
                  <label className="mb-1">Phone</label>
                  <input
                    className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                    placeholder="Enter phone number..."
                    aria-label="Phone"
                    type="tel"
                  />
                </div>
              </div>
      
              {/* Description */}
              <div className="flex-1 flex flex-col text-gray-900 text-sm">
                <label className="mb-1">Description</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition min-h-[80px]"
                  placeholder="Enter salon description here..."
                  aria-label="Salon Description"
                />
              </div>
      
              {/* Address */}
              <div>
                <div className="font-semibold text-gray-900 mb-2">Address</div>
                <div className="flex flex-col sm:flex-row gap-4 mb-2">
                  <div className="flex-1 flex flex-col text-gray-900 text-sm">
                    <label className="mb-1">Country</label>
                    <select className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition">
                      <option value="">Select here...</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Japan</option>
                    </select>
                  </div>
                  <div className="flex-1 flex flex-col text-gray-900 text-sm">
                    <label className="mb-1">City / District</label>
                    <select className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition">
                      <option value="">Select here...</option>
                      <option>New York</option>
                      <option>London</option>
                      <option>Tokyo</option>
                    </select>
                  </div>
                  <div className="flex-1 flex flex-col text-gray-900 text-sm">
                    <label className="mb-1">Postcode</label>
                    <input
                      className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                      placeholder="Type here..."
                      aria-label="Postcode"
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col text-gray-900 text-sm">
                  <label className="mb-1">Full Address</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition mb-2"
                    placeholder="Type here..."
                    aria-label="Full Address"
                  />
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 bg-puce text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-puce1-600 transition mb-2"
                >
                  + Add another
                </button>
              </div>
      
              {/* Social Media Links */}
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
                        className="border border-gray-300 rounded-lg py-2 px-2 text-sm focus:outline-none focus:border-puce transition w-full md:w-auto"
                        value={link.platform}
                        onChange={e =>
                          handleSocialChange(idx, "platform", e.target.value)
                        }
                      >
                        {socialOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <div className="w-8 flex justify-center items-center">
                        {socialOptions.find(opt => opt.value === link.platform)?.icon}
                      </div>
                      <input
                        className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition w-full md:w-auto"
                        placeholder={
                          socialOptions.find(opt => opt.value === link.platform)
                            ?.placeholder
                        }
                        value={link.url}
                        onChange={e =>
                          handleSocialChange(idx, "url", e.target.value)
                        }
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
                          className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition mb-2"
                          placeholder="Type here..."
                          aria-label="Issued Date"
                          value={cert.issuedDate}
                          onChange={(e) => handleCertificationChange(idx, "issuedDate", e.target.value)}
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div className="flex flex-col sm:flex-row gap-4 mb-2 ">
                  <div className="flex-1 flex  flex-col text-gray-900 text-sm">
                    <label className="mb-1">Certification ID (Optional)</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition mb-2"
                      placeholder="Type here..."
                      aria-label="Certification ID"
                      value={certifications.length > 0 ? certifications[certifications.length - 1].certificationId : ""}
                      onChange={(e) => handleCertificationChange(certifications.length - 1, "certificationId", e.target.value)}
                    />
                  </div>
                  <div className="flex-1 flex flex-col text-gray-900 text-sm">
                    <label className="mb-1">Certification URL (Optional)</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition mb-2"
                      placeholder="Type here..."
                      aria-label="Certification URL"
                      value={certifications.length > 0 ? certifications[certifications.length - 1].certificationUrl : ""}
                      onChange={(e) => handleCertificationChange(certifications.length - 1, "certificationUrl", e.target.value)}
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
      
              {/* Footer Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <button
                  type="button"
                  className="w-full sm:w-32 border border-gray-300 text-gray-700 bg-white rounded-lg py-2 font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  className="w-full sm:w-32 bg-puce text-white rounded-lg py-2 font-medium hover:bg-puce1-600 transition"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                navigate("/regprofe2");
                     }}
                >
                  Next
                </motion.button>
              </div>
            </motion.form>
    </motion.div>
     
  );
}
