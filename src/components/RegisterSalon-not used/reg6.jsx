import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const stepLabels = ["01", "02", "03", "04", "05", "06"];

const initialFAQ = {
  question: "",
  answer: ""
};

export default function AddFAQStep() {
  const [faqs, setFaqs] = useState([
    { ...initialFAQ },
    { ...initialFAQ }
  ]);
  const navigate = useNavigate();
  const location = useLocation();

  // Get salonId and userId from navigation state
  const salonId = location.state?.salonId || null;
  const userId = location.state?.userId || null;

  const handleFAQChange = (idx, field, value) => {
    setFaqs(prev =>
      prev.map((faq, i) =>
        i === idx ? { ...faq, [field]: value } : faq
      )
    );
  };

  const handleAddFAQ = () => {
    setFaqs(prev => [...prev, { ...initialFAQ }]);
  };

  const handleRemoveFAQ = (idx) => {
    if (faqs.length > 1) {
      setFaqs(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!salonId) {
      alert("Salon ID missing. Please complete previous steps.");
      return;
    }

    try {
      const response = await fetch(`https://beautysalon-qq6r.vercel.app/api/salons/${salonId}/faqs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faqs }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Failed to save FAQs.");
        return;
      }

      // On success, navigate to next step or finish registration
      navigate("/registrationComplete", { state: { salonId, userId } });
    } catch (err) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <motion.div
      className="w-full min-h-screen bg-white flex flex-col items-center px-2 py-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-black mb-8">
        Add Frequently Asked Question
      </h1>
      
      {/* Stepper */}
       <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-8 w-full max-w-xs sm:max-w-md md:max-w-lg">
                   {stepLabels.map((label, idx) => (
                     <React.Fragment key={label}>
                       <div
                         className={`flex items-center justify-center w-9 h-9 rounded-full border-2 text-base font-semibold
                           ${idx <5
                             ? "bg-rose-taupe text-white border-rose-taupe"
                             : idx === 5
                             ? "border-2 border-puce bg-white text-puce"
                             : "bg-white text-gray-400 border-gray-200"}
                         `}
                       >
                         {idx < 5  ? <Check className="w-5 h-5" /> : label}
                       </div>
                       {idx < stepLabels.length - 1 && (
                         <div
                           className={`h-1 rounded
                             ${idx <4 ? "bg-rose-taupe" : "bg-gray-200"}
                             w-8 sm:w-10`}
                         />
                       )}
                     </React.Fragment>
                   ))}
                 </div>
      

      {/* FAQ Section */}
      <form onSubmit={handleSubmit} className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-3xl mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Frequently Asked Question
        </h2>
        
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

        {/* Add Another Button */}
        <div className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-3xl flex justify-start mb-8">
          <button
            type="button"
            className="bg-puce text-white border border-puce1-600 rounded-lg px-4 py-2 font-medium text-sm hover:bg-puce1-600 transition flex items-center gap-2"
            onClick={handleAddFAQ}
          >
            + Add another
          </button>
        </div>

        {/* Footer Buttons */}
        <div className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-3xl flex flex-col sm:flex-row gap-3 justify-center mt-6">
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
          >
            Continue
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
