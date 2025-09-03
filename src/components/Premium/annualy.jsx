import { motion } from "framer-motion";
import { Star, Check } from "lucide-react";
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

export default function AnnuallyPricingCard() {
  const [expanded, setExpanded] = useState(false);
  const initialFeatureCount = 5;
   const navigate = useNavigate();

  const featuresToShow = expanded ? features : features.slice(0, initialFeatureCount);

  return (
    <motion.div
      className="w-full mx-auto my-16 rounded-2xl border-2 border-puce bg-puce1-100 shadow-sm p-6 flex flex-col relative"
      style={{ height: "550px", transformOrigin: 'center' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      onClick={() => navigate('/register21')}
      whileTap={{ scale: 0.97 }}
      transition={{
        hover: { duration: 0.4, ease: "easeInOut" },
        tap: { duration: 0.2, ease: "easeInOut" }
      }}
    >
      {/* Popular Choice badge */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
        <span className="bg-puce text-white text-xs px-4 py-1 rounded-full font-semibold shadow-sm tracking-wide">
          POPULAR CHOICE
        </span>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-sm text-gray-500">Annually</div>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-black">$999</span>
            <span className="text-base text-gray-400 font-medium">/Annually</span>
          </div>
        </div>
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
          <Star className="w-8 h-8 text-puce fill-puce" />
        </div>
      </div>
      <div className="text-gray-500 text-sm mb-4">
        Duis aute irure dolor in reprehenderit
      </div>
      <hr className="my-3 border-t border-[#E9B6B6]" />
      {/* Features */}
      <div className="flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-5 mb-6">
          {featuresToShow.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#B88989] mt-1" />
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
        className="w-full py-2 rounded-lg font-medium text-base bg-puce text-white border-2 border-puce shadow-sm cursor-default"
        disabled
        type="button"
      >
        Plan Selected
      </button>
    </motion.div>
  );
}
