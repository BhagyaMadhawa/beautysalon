// src/pages/BeautyProfessional/ProReg3.jsx
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Check } from "lucide-react";
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

  const onNext = async () => {
    setError(null);
    if (!salon_id) return setError("Missing salon id. Please complete step 1 again.");

    const payload = {
      salon_id,
      services: services
        .filter(s => s.serviceName?.trim())
        .map(s => ({
          serviceName: s.serviceName,
          durationLabel: s.duration,           // "60 min" etc.
          price: s.price,
          discountedPrice: s.discountedPrice,
          description: s.description
        }))
    };

    try {
      setLoading(true);
      const res = await fetch("https://beautysalon-qq6r.vercel.app/api/pro/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    <motion.div className="w-full min-h-screen bg-white flex flex-col items-center px-2 py-8"
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* ... your existing UI ... */}

      {error && <div className="text-center text-red-500 text-sm mb-2">{error}</div>}

      <div className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-4xl flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <button type="button" className="w-full sm:w-32 border border-gray-300 text-gray-700 bg-white rounded-lg py-2 font-medium hover:bg-gray-50 transition">
          Cancel
        </button>
        <motion.button
          type="button" className="w-full sm:w-32 bg-puce text-white rounded-lg py-2 font-medium hover:bg-puce1-600 transition disabled:opacity-60"
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          disabled={loading} onClick={onNext}
        >
          {loading ? "Saving..." : "Next"}
        </motion.button>
      </div>
    </motion.div>
  );
}

const ProfReg3 = () => (
  <div className="max-w-[98%] mx-auto mb-8 px-2 sm:px-4 justify-center ">
    <ListServices />
  </div>
);

export default ProfReg3;
