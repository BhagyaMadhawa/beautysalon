import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { Upload, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const socialOptions = [
  { label: "Facebook", icon: <FaFacebookF className="text-blue-600" />, value: "facebook", placeholder: "https://www.facebook.com/" },
  { label: "Instagram", icon: <FaInstagram className="text-pink-500" />, value: "instagram", placeholder: "https://www.instagram.com/" },
  { label: "Tiktok", icon: <FaTiktok className="text-black" />, value: "tiktok", placeholder: "https://www.tiktok.com/" },
];

const stepLabels = ["01", "02", "03", "04", "05", "06"];

export default function RegisterSalonForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId || null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [addresses, setAddresses] = useState([
    { country: "", city: "", postcode: "", full_address: "" }
  ]);
  const [socialLinks, setSocialLinks] = useState([
    { platform: "facebook", url: "" },
    { platform: "instagram", url: "" },
    { platform: "tiktok", url: "" },
  ]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddressChange = (index, field, value) => {
    setAddresses(prev => {
      const next = [...prev];
      next[index][field] = value;
      return next;
    });
  };
  const handleAddAddress = () => setAddresses(prev => [...prev, { country: "", city: "", postcode: "", full_address: "" }]);
  const handleRemoveAddress = (index) => setAddresses(prev => prev.filter((_, i) => i !== index));

  const handleSocialChange = (idx, field, value) => {
    setSocialLinks(prev => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));
  };
  const handleAddSocial = () => setSocialLinks(prev => [...prev, { platform: "facebook", url: "" }]);
  const handleRemoveSocial = (idx) => setSocialLinks(prev => prev.filter((_, i) => i !== idx));

  const validate = () => {
    if (!name || !email || !phone) {
      setError("Please fill out salon name, email, and phone.");
      return false;
    }
    for (const addr of addresses) {
      if (!addr.country || !addr.city || !addr.postcode || !addr.full_address) {
        setError("Please fill out all address fields.");
        return false;
      }
    }
    // Social URLs are optional; if you want strict, uncomment:
    // for (const link of socialLinks) {
    //   if (!link.url) {
    //     setError("Please fill out all social link URLs or remove empty entries.");
    //     return false;
    //   }
    // }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!userId) {
      setError("User ID missing. Please complete step 1 first.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://beautysalon-qq6r.vercel.app/api/salons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          description: description.trim(),
          addresses,
          social_links: socialLinks.filter(s => s.url?.trim()),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create salon.");
      } else {
        const salonId = data.salon_id;
        navigate("/regsal3", { state: { salonId, userId } });
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full min-h-screen bg-white flex flex-col items-center px-2 py-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full flex justify-end p-4">
        <motion.a
          href="#"
          className="text-sm text-puce hover:underline"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Here to get service? <span className="underline">Join as a client</span>
        </motion.a>
      </div>
      <motion.h1
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-black text-center mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Register your salon
      </motion.h1>

      <motion.div className="flex flex-wrap justify-center items-center gap-4 mb-8">
        {stepLabels.map((label, idx) => (
          <React.Fragment key={label}>
            <motion.div
              className={`flex items-center justify-center w-9 h-9 rounded-full border-2 text-base font-semibold
                ${idx === 0
                  ? "bg-rose-taupe text-white border-rose-taupe"
                  : idx === 1
                  ? "border-2 border-puce bg-white text-puce"
                  : "bg-white text-gray-400 border-gray-200"}
              `}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05 * idx }}
            >
              {idx === 0 ? <Check className="w-5 h-5" /> : label}
            </motion.div>
            {idx < stepLabels.length - 1 && <div className="w-10 h-1 rounded bg-gray-200" />}
          </React.Fragment>
        ))}
      </motion.div>

      <motion.form
        className="w-full max-w-full sm:max-w-2xl md:max-w-4xl bg-white p-4 sm:p-8 space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
      >
        {/* Salon Name, Email, Phone */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex flex-col text-gray-900 text-sm">
            <label className="mb-1">Salon Name</label>
            <input
              className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
              placeholder="Type here..."
              aria-label="Salon Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex-1 flex flex-col text-gray-900 text-sm">
            <label className="mb-1">Email</label>
            <input
              className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
              placeholder="Enter email address..."
              aria-label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex-1 flex flex-col text-gray-900 text-sm">
            <label className="mb-1">Phone</label>
            <input
              className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
              placeholder="Enter phone number..."
              aria-label="Phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Addresses */}
        <div>
          <div className="font-semibold text-gray-900 mb-2">Address</div>
          {addresses.map((addr, idx) => (
            <div key={idx} className="mb-4 border p-3 rounded-lg">
              <div className="flex flex-col sm:flex-row gap-4 mb-2">
                <div className="flex-1 flex flex-col text-gray-900 text-sm">
                  <label className="mb-1">Country</label>
                  <select
                    className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                    value={addr.country}
                    onChange={(e) => handleAddressChange(idx, "country", e.target.value)}
                  >
                    <option value="">Select here...</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="jp">Japan</option>
                  </select>
                </div>
                <div className="flex-1 flex flex-col text-gray-900 text-sm">
                  <label className="mb-1">City / District</label>
                  <input
                    type="text"
                    placeholder="Select here..."
                    className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                    aria-label="City/District"
                    value={addr.city}
                    onChange={(e) => handleAddressChange(idx, "city", e.target.value)}
                  />
                </div>
                <div className="flex-1 flex flex-col text-gray-900 text-sm">
                  <label className="mb-1">Postcode</label>
                  <input
                    type="text"
                    placeholder="Type here..."
                    className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                    aria-label="Postcode"
                    value={addr.postcode}
                    onChange={(e) => handleAddressChange(idx, "postcode", e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col text-gray-900 text-sm">
                <label className="mb-1">Full Address</label>
                <input
                  type="text"
                  placeholder="Type here..."
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                  aria-label="Full Address"
                  value={addr.full_address}
                  onChange={(e) => handleAddressChange(idx, "full_address", e.target.value)}
                />
              </div>
              {addresses.length > 1 && (
                <button
                  type="button"
                  className="mt-2 text-red-500 text-sm hover:underline"
                  onClick={() => handleRemoveAddress(idx)}
                >
                  Remove Address
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="flex items-center gap-2 bg-puce text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-puce1-600 transition mb-2"
            onClick={handleAddAddress}
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
                  onChange={e => handleSocialChange(idx, "platform", e.target.value)}
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
                  placeholder={socialOptions.find(opt => opt.value === link.platform)?.placeholder}
                  value={link.url}
                  onChange={e => handleSocialChange(idx, "url", e.target.value)}
                />
                {socialLinks.length > 1 && (
                  <button
                    type="button"
                    className="text-gray-400 hover:text-red-500 transition"
                    onClick={() => handleRemoveSocial(idx)}
                    aria-label="Remove"
                  >
                    &times;
                  </button>
                )}
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

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button
            type="button"
            className="w-full sm:w-32 border border-gray-300 text-gray-700 bg-white rounded-lg py-2 font-medium hover:bg-gray-50 transition"
            onClick={() => navigate("/regsal1")}
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            className="w-full sm:w-32 bg-puce text-white rounded-lg py-2 font-medium hover:bg-puce1-600 transition"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
          >
            {loading ? "Saving..." : "Next"}
          </motion.button>
        </div>
        {error && <div className="text-center text-red-500 text-sm mt-2">{error}</div>}
      </motion.form>
    </motion.div>
  );
}
