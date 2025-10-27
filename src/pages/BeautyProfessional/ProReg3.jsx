// src/pages/BeautyProfessional/ProReg3.jsx
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Check, X } from "lucide-react";
import { api } from "../../lib/api";

const stepLabels = ["01", "02", "03", "04"];
const durations = ["30 min", "45 min", "60 min", "90 min"];

const initialServices = [
  { image: null, serviceName: "", duration: "30 min", price: "", discountedPrice: "", description: "" },
  { image: null, serviceName: "", duration: "30 min", price: "", discountedPrice: "", description: "" }
];

function ListServices() {
  const [services, setServices] = useState(initialServices);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { salon_id, userId } = location.state || {};

  const handleFieldChange = (i, field, value) =>
    setServices(prev => prev.map((svc, idx) => (idx === i ? { ...svc, [field]: value } : svc)));

  const handleImageChange = (i, file) =>
    setServices(prev => prev.map((svc, idx) => (idx === i ? { ...svc, image: file } : svc)));

  const handleAddService = () =>
    setServices(prev => ([...prev, { image: null, serviceName: "", duration: "30 min", price: "", discountedPrice: "", description: "" }]));

  // Helper function to upload service image
  const uploadServiceImage = async (file) => {
    const formData = new FormData();
    formData.append("profile_image", file); // Reuse the same endpoint as reg1.jsx
    const res = await fetch("https://beautysalon-qq6r.vercel.app/api/salons/upload/profile-image", { method: "POST", body: formData });
    if (!res.ok) throw new Error((await res.json()).error || "Failed to upload service image.");
    const data = await res.json();
    return data.imageUrl;
  };

  const onNext = async () => {
    setError(null);
    if (!userId) return setError("Missing user id. Please complete step 1 again.");

    // Filter out blank services (consider a service filled if serviceName is not empty)
    const filledServices = services.filter(s => s.serviceName?.trim());

    if (filledServices.length === 0) {
      setError("Please fill at least one service.");
      return;
    }

    try {
      setLoading(true);

      // Upload images first and get URLs
      const servicesWithUrls = await Promise.all(
        filledServices.map(async (svc) => {
          let imageUrl = null;
          if (svc.image) {
            imageUrl = await uploadServiceImage(svc.image);
          }
          return {
            serviceName: svc.serviceName,
            durationLabel: svc.duration,
            price: svc.price,
            discountedPrice: svc.discountedPrice,
            description: svc.description,
            image_url: imageUrl,
          };
        })
      );

      // Prepare form data with URLs
      const formData = new FormData();
      formData.append("userId", userId);
      servicesWithUrls.forEach((service, index) => {
        formData.append(`services[${index}][serviceName]`, service.serviceName);
        formData.append(`services[${index}][durationLabel]`, service.durationLabel);
        formData.append(`services[${index}][price]`, service.price);
        formData.append(`services[${index}][discountedPrice]`, service.discountedPrice);
        formData.append(`services[${index}][description]`, service.description);
        if (service.image_url) {
          formData.append(`services[${index}][image_url]`, service.image_url);
        }
      });

      const res = await fetch("https://beautysalon-qq6r.vercel.app/api/pro/services", {
        method: "POST",
        credentials: 'include',
        body: formData, // Changed to FormData
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save step 3");
        return;
      }
      navigate("/regprofe5", { state: { salon_id, userId } });
    } catch (err) {
      setError(err.message || "Failed to save step 3");
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
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-black mb-8">
        List Your Services
      </h1>

      {/* Stepper */}
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-8 w-full max-w-xs sm:max-w-md md:max-w-lg">
        {stepLabels.map((label, idx) => (
          <React.Fragment key={label}>
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-full border-2 text-base font-semibold
                ${idx < 2 ? "bg-rose-taupe text-white border-rose-taupe"
                  : idx === 2 ? "border-2 border-puce bg-white text-puce"
                  : "bg-white text-gray-400 border-gray-200"}`}
            >
              {idx < 2 ? <Check className="w-5 h-5" /> : label}
            </div>
            {idx < stepLabels.length - 1 && (
              <div className={`h-1 rounded ${idx === 0 ? "bg-rose-taupe" : "bg-gray-200"} w-8 sm:w-10`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form */}
      <form
        className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-[70%] space-y-8 mb-6"
        onSubmit={(e) => { e.preventDefault(); onNext(); }}
      >
        {services.map((service, idx) => (
          <div key={idx} className="bg-white p-2 sm:p-4 md:p-6">
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
              <input
                type="text"
                value={service.serviceName}
                onChange={(e) => handleFieldChange(idx, 'serviceName', e.target.value)}
                className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                placeholder="Service name"
              />
            </div>

            {/* Image Upload */}
            <label
              htmlFor={`service-image-${idx}`}
              className="relative border-2 border-dashed rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center text-center mb-4 transition cursor-pointer border-puce bg-puce/10 hover:bg-puce/20"
              aria-label={`Upload image for service ${service.serviceName || idx + 1}`}
            >
              {service.image ? (
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 bg-white group mb-2">
                  <img
                    src={URL.createObjectURL(service.image)}
                    alt="Service"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleImageChange(idx, null);
                    }}
                    aria-label="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 mx-auto text-puce mb-2" />
                  <span className="font-semibold text-puce">Upload image</span>
                  <span className="text-xs text-gray-500 mb-2">
                    Drag &amp; drop file here, or click to select
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 pointer-events-none"
                id={`service-image-${idx}`}
                onChange={(e) => handleImageChange(idx, e.target.files?.[0] || null)}
              />
              <span className="text-puce underline font-medium text-sm hover:text-puce1-600 transition">
                Choose image
              </span>
            </label>

            {/* Duration and Price Row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <select
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                  value={service.duration}
                  onChange={(e) => handleFieldChange(idx, 'duration', e.target.value)}
                >
                  {durations.map((dur) => (
                    <option key={dur} value={dur}>
                      {dur}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                  placeholder="0.00"
                  value={service.price}
                  onChange={(e) => handleFieldChange(idx, 'price', e.target.value)}
                />
              </div>
            </div>

            {/* Discounted Price and Description Row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price ($) (Optional)</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                  placeholder="0.00"
                  value={service.discountedPrice}
                  onChange={(e) => handleFieldChange(idx, 'discountedPrice', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition min-h-[80px]"
                  placeholder="Describe the service..."
                  value={service.description}
                  onChange={(e) => handleFieldChange(idx, 'description', e.target.value)}
                />
              </div>
            </div>

            {/* Remove Service */}
            {services.length > 1 && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                  onClick={() => setServices(prev => prev.filter((_, i) => i !== idx))}
                >
                  Remove Service
                </button>
              </div>
            )}
          </div>
        ))}

        <div className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-3xl flex justify-start mb-8">
          <button
            type="button"
            className="bg-puce/10 text-puce border border-puce rounded-lg px-4 py-2 font-medium text-sm hover:bg-puce/20 transition"
            onClick={handleAddService}
          >
            + Add another service
          </button>
        </div>

        {error && <div className="text-center text-red-500 text-sm mb-2">{error}</div>}

        <div className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-3xl flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button
            type="button"
            className="w-full sm:w-32 border border-gray-300 text-gray-700 bg-white rounded-lg py-2 font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-32 bg-puce text-white rounded-lg py-2 font-medium transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-puce1-600"
            }`}
          >
            {loading ? "Saving..." : "Next"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

const ProfReg3 = () => (
  <div className="max-w-[98%] mx-auto mb-8 px-2 sm:px-4 justify-center ">
    <ListServices />
  </div>
);

export default ProfReg3;
