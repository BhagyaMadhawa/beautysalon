import { motion } from "framer-motion";
import { Moon, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const features = [
  "Aliquam morbi tempus nulla massa",
  "Incididunt ut labore et dolore",
  "Duis aute irure dolor in reprehenderit",
  "Cupidatat non proident",
  "Quis nostrud exercitation ullamco laboris",
  "Exercitation ullamco laboris",
  "Vehicula quisque sollicitudin rutrum",
  "Molestie vivamus etiam purus",
];

export default function MonthlyPricingCard() {
  const [expanded, setExpanded] = useState(false);
  const initialFeatureCount = 5;
   const navigate = useNavigate();

  const featuresToShow = expanded ? features : features.slice(0, initialFeatureCount);

  return (
   <motion.div
  className="w-full mx-auto my-16 rounded-2xl border border-gray-500 bg-white shadow-sm p-6 flex flex-col"
  style={{ height: "550px", transformOrigin: 'center' }}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 1 }}
  onTap={() => navigate('/register21')}
  
  transition={{
    hover: { duration: 0.4, ease: "easeInOut" },
    tap: { duration: 0.2, ease: "easeInOut" }
  }}
>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-sm text-gray-500">Monthly</div>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-black">$99</span>
            <span className="text-base text-gray-400 font-medium">/monthly</span>
          </div>
        </div>
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <Moon className="w-8 h-8 text-gray-600" />
        </div>
      </div>
      <div className="text-gray-900 text-sm mb-4">
        Duis aute irure dolor in reprehenderit
      </div>
      <hr className="my-3 border-t border-gray-200" />
      {/* Features */}
      <div className="flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-5 mb-6">
          {featuresToShow.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-puce mt-1" />
              <span className="text-gray-700 text-sm">{f}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* See More/Less Button */}
      {features.length > initialFeatureCount && (
        <button
          className="text-puce font-semibold text-sm mb-4 hover:underline self-start"
          onClick={() => setExpanded(!expanded)}
          type="button"
        >
          {expanded ? "See Less" : "See More"}
        </button>
      )}
      {/* Button */}
      <button
        className="w-full py-2 rounded-lg font-medium text-base border border-gray-500 bg-white text-gray-900 hover:bg-gray-50 transition"
        type="button"
      >
        Start for free
      </button>
    </motion.div>
  );
}
