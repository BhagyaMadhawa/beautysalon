import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Check, X, Loader } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const stepLabels = ["01", "02", "03", "04", "05", "06"];
const durations = ["30 min", "45 min", "60 min", "90 min"];

const initialServices = [
  { image: null, serviceName: "", duration: "30 min", price: "", discountedPrice: "", description: "", uploading: false, error: null },
  { image: null, serviceName: "", duration: "30 min", price: "", discountedPrice: "", description: "", uploading: false, error: null },
];

export default function ListServices() {
  const [services, setServices] = useState(initialServices);
  const navigate = useNavigate();
  const location = useLocation();
  const salonId = location.state?.salonId || null;
  const userId = location.state?.userId || null;

  const handleFieldChange = (i, field, value) => {
    setServices(prev => prev.map((svc, idx) => (idx === i ? { ...svc, [field]: value } : svc)));
  };
  // Function to generate preview URL from File object
  const getImagePreviewUrl = useCallback((file) => {
    if (typeof file === 'string') {
      // If it's already a URL string (for backward compatibility)
      return file;
    }
    return URL.createObjectURL(file);
  }, []);

  const handleImageChange = async (i, file) => {
    if (!file) return;
    setServices((prev) =>
      prev.map((svc, idx) =>
        idx === i ? { ...svc, image: file, uploading: true, error: null } : svc
      )
    );
    try {
      const imageUrl = await uploadServiceImage(file);
      setServices((prev) =>
        prev.map((svc, idx) =>
          idx === i ? { ...svc, image: imageUrl, uploading: false, error: null } : svc
        )
      );
    } catch (error) {
      setServices((prev) =>
        prev.map((svc, idx) =>
          idx === i ? { ...svc, uploading: false, error: error.message } : svc
        )
      );
    }
  };

  const handleAddService = () => {
    setServices((prev) => [
      ...prev,
      {
        image: null,
        serviceName: "",
        duration: "30 min",
        price: "",
        discountedPrice: "",
        description: "",
        uploading: false,
        error: null,
      },
    ]);
  };

  // Helper function to upload service image
  const uploadServiceImage = async (file) => {
    const formData = new FormData();
    formData.append("profile_image", file); // Reuse the same endpoint as reg1.jsx
    const res = await fetch("https://beautysalon-qq6r.vercel.app/api/salons/upload/profile-image", { method: "POST", body: formData });
    if (!res.ok) throw new Error((await res.json()).error || "Failed to upload service image.");
    const data = await res.json();
    return data.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!salonId) {
      alert("Salon ID missing. Please complete previous steps.");
      return;
    }

    // Filter out blank services (consider a service filled if serviceName is not empty)
    const filledServices = services.filter(svc => svc.serviceName.trim() !== "");

    if (filledServices.length === 0) {
      alert("Please fill at least one service.");
      return;
    }

    // Check for any uploading or error states
    const hasUploading = filledServices.some(svc => svc.uploading);
    const hasErrors = filledServices.some(svc => svc.error);

    if (hasUploading) {
      alert("Please wait for all image uploads to complete.");
      return;
    }

    if (hasErrors) {
      alert("Please resolve image upload errors before submitting.");
      return;
    }

    try {
      // Prepare form data with URLs (images already uploaded)
      const formData = new FormData();
      formData.append("salon_id", salonId);
      filledServices.forEach((service, index) => {
        formData.append(`services[${index}][name]`, service.serviceName);
        formData.append(`services[${index}][duration]`, service.duration);
        formData.append(`services[${index}][price]`, service.price);
        formData.append(`services[${index}][discounted_price]`, service.discountedPrice || "");
        formData.append(`services[${index}][description]`, service.description || "");
        if (service.image && typeof service.image === 'string') {
          formData.append(`services[${index}][image_url]`, service.image);
        }
      });
      const res = await fetch(`https://beautysalon-qq6r.vercel.app/api/salons/${salonId}/services`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save services.");
        return;
      }
      // Log the FormData contents for debugging
      const formDataObj = {};
      for (let [key, value] of formData.entries()) {
        formDataObj[key] = value;
      }
      console.log("Request data being sent to backend:", formDataObj);

      // Fetch the saved services from backend and log them
      try {
        const getRes = await fetch(`https://beautysalon-qq6r.vercel.app/api/salons/${salonId}/services`);
        const servicesData = await getRes.json();
        if (getRes.ok) {
          console.log("Saved services from backend:", servicesData.services);
        } else {
          console.error("Failed to fetch saved services:", servicesData.error);
        }
      } catch (error) {
        console.error("Error fetching saved services:", error);
      }

      navigate("/regsal5", { state: { salonId, userId } });
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
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-black mb-8">
        List your services
      </h1>

      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-8 w-full max-w-xs sm:max-w-md md:max-w-lg">
        {stepLabels.map((label, idx) => (
          <React.Fragment key={label}>
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-full border-2 text-base font-semibold
                ${idx < 3 ? "bg-rose-taupe text-white border-rose-taupe"
                  : idx === 3 ? "border-2 border-puce bg-white text-puce"
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

      <form
        className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-4xl space-y-8 mb-6"
        onSubmit={handleSubmit}
      >
        <span className="block text-xl font-medium mb-2 text-black">Add Services</span>
        {services.map((service, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-4 bg-white rounded-lg">
            <div className="md:w-1/3">
              <label className="block w-full h-full cursor-pointer">
                <div className="border-2 border-dashed border-puce rounded-xl bg-puce/10 p-6 flex flex-col items-center justify-center text-center min-h-[180px] hover:bg-puce/20 transition">
                  {service.uploading ? (
                    <div className="flex flex-col items-center">
                      <Loader className="w-8 h-8 animate-spin text-puce mb-2" />
                      <span className="text-sm text-gray-500">Uploading...</span>
                    </div>
                  ) : service.error ? (
                    <div className="flex flex-col items-center">
                      <X className="w-8 h-8 text-red-500 mb-2" />
                      <span className="text-sm text-red-500 mb-2">{service.error}</span>
                      <button
                        type="button"
                        onClick={() => handleImageChange(i, service.image)}
                        className="text-puce underline font-medium text-sm hover:text-puce1-600 transition"
                      >
                        Retry
                      </button>
                    </div>
                  ) : service.image ? (
                    <div className="relative w-24 h-24 object-cover rounded-lg mb-2">
                      <img src={getImagePreviewUrl(service.image)} alt={`Service ${i + 1}`} className="w-full h-full object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => handleImageChange(i, null)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        aria-label="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto text-puce mb-2" />
                      <span className="font-semibold text-puce">Upload image</span>
                      <span className="text-xs text-gray-500 mb-2">Drag &amp; Drop or click below to upload image</span>
                    </>
                  )}
                  <span className="text-puce underline font-medium text-sm hover:text-puce1-600 transition">
                    Upload image
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleImageChange(i, e.target.files[0])} />
                </div>
              </label>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1 text-gray-700">Service Name</label>
                  <input
                    type="text"
                    value={service.serviceName}
                    onChange={e => handleFieldChange(i, "serviceName", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                    placeholder="Service Name"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1 text-gray-700">Duration</label>
                  <select
                    value={service.duration}
                    onChange={e => handleFieldChange(i, "duration", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                  >
                    {durations.map((d) => (<option key={d}>{d}</option>))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1 text-gray-700">Price of service</label>
                  <input
                    type="text"
                    value={service.price}
                    onChange={e => handleFieldChange(i, "price", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                    placeholder="USD 24.16"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1 text-gray-700">Discounted price</label>
                  <input
                    type="text"
                    value={service.discountedPrice}
                    onChange={e => handleFieldChange(i, "discountedPrice", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                    placeholder="USD 24.16"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700">Service description</label>
                <input
                  type="text"
                  value={service.description}
                  onChange={e => handleFieldChange(i, "description", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                  placeholder="Enter Service description here..."
                />
              </div>
            </div>
          </div>
        ))}
        <div className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-4xl flex justify-start mb-8">
          <button
            type="button"
            className="bg-puce/10 text-puce border border-puce rounded-lg px-4 py-2 font-medium text-sm hover:bg-puce/20 transition"
            onClick={handleAddService}
          >
            + Add another
          </button>
        </div>

        <div className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-4xl flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button
            type="button"
            className="w-full sm:w-32 border border-gray-300 text-gray-700 bg-white rounded-lg py-2 font-medium hover:bg-gray-50 transition"
            onClick={() => navigate("/regsal3")}
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            className="w-full sm:w-32 bg-puce text-white rounded-lg py-2 font-medium hover:bg-puce1-600 transition"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Next
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
