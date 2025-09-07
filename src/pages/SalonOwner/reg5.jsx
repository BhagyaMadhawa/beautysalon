import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const stepLabels = ["01", "02", "03", "04", "05", "06"];
const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const defaultHours = { from: "09:00 AM", to: "05:00 PM" };

export default function OperatingHoursStep() {
  const navigate = useNavigate();
  const location = useLocation();
  const salonId = location.state?.salonId || null;
  const userId = location.state?.userId || null;

  const [hours, setHours] = useState(
    days.map((day, i) => ({
      day_of_week: day,
      is_opened: i < 5,
      start_time: defaultHours.from,
      end_time: defaultHours.to,
    }))
  );

  const handleToggle = idx => {
    setHours(prev => prev.map((d, i) => (i === idx ? { ...d, is_opened: !d.is_opened } : d)));
  };
  const handleTimeChange = (idx, field, value) => {
    setHours(prev => prev.map((d, i) => (i === idx ? { ...d, [field]: value } : d)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!salonId) {
      alert("Salon ID missing. Please complete previous steps.");
      return;
    }
    try {
      const payload = { salon_id: salonId, hours };
      const res = await fetch(`https://beautysalon-qq6r.vercel.app/api/salons/${salonId}/hours`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save operating hours.");
        return;
      }
      navigate("/regsal6", { state: { salonId, userId } });
    } catch {
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
      <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold text-center text-black mb-8">
        Select your Operating hours
      </h1>

      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-8 w-full max-w-xs sm:max-w-md md:max-w-lg">
        {stepLabels.map((label, idx) => (
          <React.Fragment key={label}>
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-full border-2 text-base font-semibold
                ${idx < 4 ? "bg-rose-taupe text-white border-rose-taupe"
                  : idx === 4 ? "border-2 border-puce bg-white text-puce"
                  : "bg-white text-gray-400 border-gray-200"}`}
            >
              {idx < 4 ? <Check className="w-5 h-5" /> : label}
            </div>
            {idx < stepLabels.length - 1 && (
              <div className={`h-1 rounded ${idx < 3 ? "bg-rose-taupe" : "bg-gray-200"} w-8 sm:w-10`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-full sm:max-w-[90%] md:max-w-[75%] bg-white p-2 sm:p-4 md:p-8 mb-8"
      >
        <div className="mb-2">
          <span className="font-semibold text-lg text-gray-900">Operating hours</span>
          <div className="text-xs text-gray-600">Select the operating hours of your salon</div>
        </div>
        <div className="divide-y">
          {hours.map((row, idx) => (
            <div key={row.day_of_week} className="flex flex-col sm:flex-row items-center gap-y-4 sm:gap-x-20 py-4 sm:py-6">
              <span className="w-full sm:w-20 text-sm font-medium text-gray-700 mr-2">
                {row.day_of_week}
              </span>

              <label className="relative inline-flex items-center cursor-pointer mr-2">
                <input
                  type="checkbox"
                  checked={row.is_opened}
                  onChange={() => handleToggle(idx)}
                  className="sr-only peer"
                  aria-label={`Toggle ${row.day_of_week}`}
                />
                <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-puce1-500 transition-colors duration-200"></div>
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white border border-gray-400 rounded-full shadow transition-transform duration-200 peer-checked:translate-x-4"></div>
              </label>

              <span className={`text-xs mr-3 ${row.is_opened ? "text-puce" : "text-gray-500"}`}>
                {row.is_opened ? "Opened" : "Closed"}
              </span>

              <div className="w-full sm:w-auto flex-1 flex flex-col sm:flex-row items-center gap-2">
                <span className="text-xs text-gray-700 mr-1">From</span>
                <input
                  type="text"
                  value={row.start_time}
                  disabled={!row.is_opened}
                  onChange={e => handleTimeChange(idx, "start_time", e.target.value)}
                  className={`w-full sm:w-60 px-2 py-1 border rounded focus:outline-none text-sm
                    ${row.is_opened ? "border-gray-200 bg-white" : "border-gray-300 bg-gray-50 text-gray-700"}`}
                  placeholder="09:00 AM"
                />
                <span className="text-xs text-gray-700 mx-1">To</span>
                <input
                  type="text"
                  value={row.end_time}
                  disabled={!row.is_opened}
                  onChange={e => handleTimeChange(idx, "end_time", e.target.value)}
                  className={`w-full sm:w-60 px-2 py-1 border rounded focus:outline-none text-sm
                    ${row.is_opened ? "border-gray-300 bg-white" : "border-gray-100 bg-gray-50 text-gray-400"}`}
                  placeholder="05:00 PM"
                />
              </div>
            </div>
          ))}
        </div>

        {/* footer buttons for this form */}
        <div className="w-full max-w-full sm:max-w-2xl flex flex-col sm:flex-row gap-3 justify-center mt-2">
          <button
            type="button"
            className="w-full sm:w-32 border border-gray-300 text-gray-700 bg-white rounded-lg py-2 font-medium hover:bg-gray-50 transition"
            onClick={() => navigate("/regsal4")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-32 bg-puce text-white rounded-lg py-2 font-medium hover:bg-puce1-600 transition"
          >
            Next
          </button>
        </div>
      </form>
    </motion.div>
  );
}
