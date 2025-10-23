import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

const socialOptions = [
  { label: "Facebook", icon: <FaFacebookF className="text-blue-600" />, value: "facebook", placeholder: "https://www.facebook.com/" },
  { label: "Instagram", icon: <FaInstagram className="text-pink-500" />, value: "instagram", placeholder: "https://www.instagram.com/" },
  { label: "Tiktok", icon: <FaTiktok className="text-black" />, value: "tiktok", placeholder: "https://www.tiktok.com/" },
];

const stepLabels = ["01", "02", "03", "04", "05"];

export default function SalonDetailsTab({ userId, salonId }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [salonData, setSalonData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    type: ""
  });
  const [addresses, setAddresses] = useState([
    {
      country: "",
      city: "",
      postcode: "",
      full_address: ""
    }
  ]);
  const [socialLinks, setSocialLinks] = useState([
    { platform: "facebook", url: "" },
    { platform: "instagram", url: "" },
    { platform: "tiktok", url: "" },
  ]);

  // Fetch existing data on component mount
  useEffect(() => {
    fetchSalonData();
  }, [salonId]);

  const fetchSalonData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch salon basic info
      const salonResponse = await fetch(`https://beautysalon-qq6r.vercel.app/api/salons/${salonId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (salonResponse.ok) {
        const salonResult = await salonResponse.json();
        setSalonData({
          name: salonResult.salon.name || "",
          email: salonResult.salon.email || "",
          phone: salonResult.salon.phone || "",
          description: salonResult.salon.description || "",
          type: salonResult.salon.type || ""
        });
      }

      // Fetch addresses
      const addressesResponse = await fetch(`https://beautysalon-qq6r.vercel.app/api/salons/${salonId}/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (addressesResponse.ok) {
        const addressesResult = await addressesResponse.json();
        if (addressesResult.addresses && addressesResult.addresses.length > 0) {
          setAddresses(addressesResult.addresses.map(addr => ({
            id: addr.id,
            country: addr.country || "",
            city: addr.city || "",
            postcode: addr.postcode || "",
            full_address: addr.full_address || ""
          })));
        }
      }

      // Fetch social links
      const socialResponse = await fetch(`https://beautysalon-qq6r.vercel.app/api/salons/${salonId}/social-links`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (socialResponse.ok) {
        const socialResult = await socialResponse.json();
        if (socialResult.socialLinks && socialResult.socialLinks.length > 0) {
          setSocialLinks(socialResult.socialLinks.map(link => ({
            id: link.id,
            platform: link.platform || "facebook",
            url: link.url || ""
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching salon data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalonDataChange = (field, value) => {
    setSalonData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (index, field, value) => {
    setAddresses(prev => prev.map((addr, i) =>
      i === index ? { ...addr, [field]: value } : addr
    ));
  };

  const handleAddAddress = () => {
    setAddresses(prev => [...prev, {
      country: "",
      city: "",
      postcode: "",
      full_address: ""
    }]);
  };

  const handleRemoveAddress = (index) => {
    if (addresses.length > 1) {
      setAddresses(prev => prev.filter((_, i) => i !== index));
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');

      // Update salon basic info (exclude type as it's read-only)
      const { type, ...updateData } = salonData;
      const salonResponse = await fetch(`https://beautysalon-qq6r.vercel.app/api/salons/${salonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!salonResponse.ok) {
        throw new Error('Failed to update salon information');
      }

      // Update addresses
      for (const address of addresses) {
        if (address.id) {
          // Update existing address
          await fetch(`https://beautysalon-qq6r.vercel.app/api/salons/${salonId}/addresses/${address.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              country: address.country,
              city: address.city,
              postcode: address.postcode,
              full_address: address.full_address
            })
          });
        }
      }

      // Update social links
      for (const link of socialLinks) {
        if (link.id && link.url.trim()) {
          // Update existing social link
          await fetch(`https://beautysalon-qq6r.vercel.app/api/salons/${salonId}/social-links/${link.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              platform: link.platform,
              url: link.url
            })
          });
        }
      }

      alert('Salon details updated successfully!');
      fetchSalonData(); // Refresh data
    } catch (error) {
      console.error('Error updating salon details:', error);
      alert('Failed to update salon details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white flex items-center justify-center py-16">
        <div className="text-lg">Loading salon details...</div>
      </div>
    );
  }

  return (
    <motion.div
    className="w-full bg-white flex flex-col items-center px-2 py-8"
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
        Edit Salon Details
      </motion.h1>


      {/* Form */}
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
              value={salonData.name}
              onChange={(e) => handleSalonDataChange('name', e.target.value)}
            />
          </div>
          <div className="flex-1 flex flex-col text-gray-900 text-sm">
            <label className="mb-1">Email</label>
            <input
              className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
              placeholder="Enter email address..."
              aria-label="Email"
              type="email"
              value={salonData.email}
              onChange={(e) => handleSalonDataChange('email', e.target.value)}
            />
          </div>
          <div className="flex-1 flex flex-col text-gray-900 text-sm">
            <label className="mb-1">Phone</label>
            <input
              className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
              placeholder="Enter phone number..."
              aria-label="Phone"
              type="tel"
              value={salonData.phone}
              onChange={(e) => handleSalonDataChange('phone', e.target.value)}
            />
          </div>
        </div>

        {/* Type (Read-only display) */}
        <div className="flex-1 flex flex-col text-gray-900 text-sm">
          <label className="mb-1">Type</label>
          <div className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm bg-gray-100">
            {salonData.type === 'salon_owner' ? 'Salon Owner' : salonData.type === 'beauty_professional' ? 'Beauty Professional' : 'Unknown'}
          </div>
        </div>

        {/* Description */}
        <div className="flex-1 flex flex-col text-gray-900 text-sm">
          <label className="mb-1">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition min-h-[80px]"
            placeholder="Enter salon description here..."
            aria-label="Salon Description"
            value={salonData.description}
            onChange={(e) => handleSalonDataChange('description', e.target.value)}
          />
        </div>

        {/* Address */}
        <div>
          <div className="font-semibold text-gray-900 mb-2">Address</div>
          {addresses.map((address, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex flex-col sm:flex-row gap-4 mb-2">
                <div className="flex-1 flex flex-col text-gray-900 text-sm">
                  <label className="mb-1">Country</label>
                  <input
                    className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                    placeholder="Type here..."
                    aria-label="Country"
                    value={address.country}
                    onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                  />
                </div>
                <div className="flex-1 flex flex-col text-gray-900 text-sm">
                  <label className="mb-1">City / District</label>
                  <input
                    className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                    placeholder="Type here..."
                    aria-label="City"
                    value={address.city}
                    onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                  />
                </div>
                <div className="flex-1 flex flex-col text-gray-900 text-sm">
                  <label className="mb-1">Postcode</label>
                  <input
                    className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                    placeholder="Type here..."
                    aria-label="Postcode"
                    value={address.postcode}
                    onChange={(e) => handleAddressChange(index, 'postcode', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col text-gray-900 text-sm">
                <label className="mb-1">Full Address</label>
                <input
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition mb-2"
                  placeholder="Type here..."
                  aria-label="Full Address"
                  value={address.full_address}
                  onChange={(e) => handleAddressChange(index, 'full_address', e.target.value)}
                />
              </div>
              {addresses.length > 1 && (
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 text-sm"
                  onClick={() => handleRemoveAddress(index)}
                >
                  Remove this address
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="flex items-center gap-2 bg-puce text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-puce/90 transition mb-2"
            onClick={handleAddAddress}
          >
            + Add another address
          </button>
        </div>

        {/* Social Media Links */}
        <div>
          <div className="font-semibold text-gray-900 mb-2">Social Media Links</div>
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
            className="flex items-center gap-2 bg-puce text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-puce/90 transition"
            onClick={handleAddSocial}
          >
            + Add another social link
          </button>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button
            type="button"
            className="w-full sm:w-32 border border-gray-300 text-gray-700 bg-white rounded-lg py-2 font-medium hover:bg-gray-50 transition"
            onClick={() => window.location.reload()}
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            className="w-full sm:w-32 bg-puce text-white rounded-lg py-2 font-medium hover:bg-puce/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: saving ? 1 : 1.03 }}
            whileTap={{ scale: saving ? 1 : 0.97 }}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}