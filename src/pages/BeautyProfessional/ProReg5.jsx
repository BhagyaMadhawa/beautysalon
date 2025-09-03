// src/pages/BeautyProfessional/ProReg5.jsx
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Menu } from "lucide-react";
import { api } from "../../lib/api";
import { getSalonId, clearSalonId } from "../../lib/proRegistration";
import Alert from "../../components/Alert";

const stepLabels = ["01", "02", "03", "04"];
const initialFAQ = { question: "", answer: "" };

function AddFAQStep() {
  const [faqs, setFaqs] = useState([{ ...initialFAQ }, { ...initialFAQ }]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();

  const handleFAQChange = (idx, field, value) =>
    setFaqs(prev => prev.map((f, i) => (i === idx ? { ...f, [field]: value } : f)));
  const handleAddFAQ = () => setFaqs(prev => [...prev, { ...initialFAQ }]);
  const handleRemoveFAQ = (idx) => setFaqs(prev => prev.filter((_, i) => i !== idx));

  const onContinue = async () => {
    setError(null);
    const salon_id = getSalonId();
    if (!salon_id) return setError("Missing salon id. Please complete step 1 again.");

    const payload = {
      salon_id,
      faqs: faqs.filter(f => f.question?.trim())
    };

    try {
      setLoading(true);
      await api("/api/pro/faqs", { method: "POST", body: payload });
      clearSalonId();

      // Show success alert
      setShowSuccessAlert(true);

      // Navigate to dashboard after a short delay to show the alert
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message || "Could not submit FAQs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="w-full min-h-screen bg-white flex flex-col items-center px-2 py-8"
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="w-full max-w-md mb-4">
          <Alert
            type="success"
            title="Registration Complete!"
            message="Your beauty professional profile has been successfully submitted for approval. You will be redirected to your dashboard shortly."
            duration={2000}
            onClose={() => setShowSuccessAlert(false)}
          />
        </div>
      )}

      {/* ... your existing UI ... */}

      {error && <div className="text-center text-red-500 text-sm mb-2">{error}</div>}

      <div className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-3xl flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <button type="button" className="w-full sm:w-32 border border-gray-300 text-gray-700 bg-white rounded-lg py-2 font-medium hover:bg-gray-50 transition">
          Cancel
        </button>
        <motion.button
          type="button"
          className="w-full sm:w-32 bg-puce text-white rounded-lg py-2 font-medium hover:bg-puce1-600 transition disabled:opacity-60"
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          disabled={loading} onClick={onContinue}
        >
          {loading ? "Submitting..." : "Continue"}
        </motion.button>
      </div>
    </motion.div>
  );
}

const ProfReg5 = () => (
  <div className="max-w-[98%] mx-auto mb-8 px-2 sm:px-4 justify-center ">
    <AddFAQStep />
  </div>
);

export default ProfReg5;
