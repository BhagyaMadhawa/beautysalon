// src/pages/BeautyProfessional/ProReg5.jsx
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Menu } from "lucide-react";
import Alert from "../../components/Alert";

const stepLabels = ["01", "02", "03", "04"];
const initialFAQ = { question: "", answer: "" };

function AddFAQStep() {
  const [faqs, setFaqs] = useState([{ ...initialFAQ }, { ...initialFAQ }]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { salon_id, userId } = location.state || {};

  const handleFAQChange = (idx, field, value) =>
    setFaqs(prev => prev.map((f, i) => (i === idx ? { ...f, [field]: value } : f)));
  const handleAddFAQ = () => setFaqs(prev => [...prev, { ...initialFAQ }]);
  const handleRemoveFAQ = (idx) =>
    setFaqs(prev => prev.filter((_, i) => i !== idx));

  const onContinue = async () => {
    setError(null);
    if (!userId) return setError("Missing user id. Please complete step 1 again.");

    const payload = {
      userId,
      faqs: faqs
        .map(f => ({ question: f.question?.trim(), answer: f.answer?.trim() }))
        .filter(f => f.question && f.answer),
    };

    try {
      setLoading(true);
      const res = await fetch("https://beautysalon-qq6r.vercel.app/api/pro/faqs", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Could not submit FAQs");
        return;
      }

      // Optional in-page success (brief)
      setShowSuccessAlert(true);

      // Prepare cross-route flash for /login and redirect immediately
      const flash = {
        type: "success",
        title: "Registration Complete!",
        message:
          "Your profile has been successfully submitted for review. You will be able to log in once it is approved.",
        duration: 6000,
      };
      sessionStorage.setItem("flash", JSON.stringify(flash));
      navigate("/login", { state: { flash } });
    } catch (err) {
      setError(err?.message || "Could not submit FAQs");
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
      {/* Success Alert (shows briefly before redirect; safe to keep) */}
      {showSuccessAlert && (
        <div className="w-full max-w-md mb-4">
          <Alert
            type="success"
            title="Registration Complete!"
            message="Your profile has been successfully submitted for review. You will be able to log in once it is approved."
            duration={2000}
            onClose={() => setShowSuccessAlert(false)}
          />
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold text-center text-black mb-8">
        Add Frequently Asked Question
      </h1>

      {/* Stepper – unchanged */}
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-8 w-full max-w-xs sm:max-w-md md:max-w-lg">
        {stepLabels.map((label, idx) => (
          <React.Fragment key={label}>
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-full border-2 text-base font-semibold
                ${idx < 3
                  ? "bg-rose-taupe text-white border-rose-taupe"
                  : idx === 3
                  ? "border-2 border-puce bg-white text-puce"
                  : "bg-white text-gray-400 border-gray-200"}`}
            >
              {idx < 3 ? <Check className="w-5 h-5" /> : label}
            </div>
            {idx < stepLabels.length - 1 && (
              <div className={`h-1 rounded ${idx < 2 ? "bg-rose-taupe" : "bg-gray-200"} w-8 sm:w-10`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form body – unchanged visuals */}
      <form className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-3xl mb-6" onSubmit={(e)=>e.preventDefault()}>
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Frequently Asked Question</h2>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="bg-white p-4 sm:p-6 "
            >
              <div className="flex items-start gap-3 mb-4">
                <Menu className="w-5 h-5 text-gray-400 mt-1 cursor-move" />
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={e => handleFAQChange(idx, "question", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-puce  transition"
                      placeholder="Type here..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer
                    </label>
                    <textarea
                      value={faq.answer}
                      onChange={e => handleFAQChange(idx, "answer", e.target.value)}
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-puce  transition resize-none"
                      placeholder="Type here..."
                    />
                  </div>
                </div>
                {faqs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFAQ(idx)}
                    className="text-puce hover:text-red-700 text-sm font-medium transition"
                  >
                    Remove
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-3xl flex justify-start mb-8">
          <button
            type="button"
            className="bg-puce text-white border border-puce1-600 rounded-lg px-4 py-2 font-medium text-sm hover:bg-puce1-600 transition flex items-center gap-2"
            onClick={handleAddFAQ}
          >
            + Add another
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
          <motion.button
            type="button"
            className="w-full sm:w-32 bg-puce text-white rounded-lg py-2 font-medium hover:bg-puce1-600 transition disabled:opacity-60"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            onClick={onContinue}
          >
            {loading ? "Submitting..." : "Continue"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

const ProfReg5 = () => (
  <div className="max-w-[98%] mx-auto mb-8 px-2 sm:px-4 justify-center ">
    <AddFAQStep />
  </div>
);

export default ProfReg5;
