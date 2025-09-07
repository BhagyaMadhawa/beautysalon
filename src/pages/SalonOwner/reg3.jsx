import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Check, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const initialAlbums = [
  { name: "Classic lash extensions", images: [] },
];

const stepLabels = ["01", "02", "03", "04", "05", "06"];

export default function PortfolioStep() {
  const [albums, setAlbums] = useState(initialAlbums);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const salonId = location.state?.salonId || null;
  const userId = location.state?.userId || null;

  const handleAlbumNameChange = (i, value) => {
    setAlbums(prev => prev.map((a, idx) => (idx === i ? { ...a, name: value } : a)));
  };
  const handleAddAlbum = () => setAlbums(prev => [...prev, { name: "", images: [] }]);

  const handleUploadImages = (i, files) => {
    const fileArray = Array.from(files);
    setAlbums(prev => {
      const next = [...prev];
      next[i].images = [...next[i].images, ...fileArray];
      return next;
    });
  };

  // Function to generate preview URL from File object
  const getImagePreviewUrl = useCallback((file) => {
    if (typeof file === 'string') {
      // If it's already a URL string (for backward compatibility)
      return file;
    }
    return URL.createObjectURL(file);
  }, []);

  // Function to remove an image from an album
  const handleRemoveImage = (albumIndex, imageIndex) => {
    setAlbums(prev => {
      const next = [...prev];
      const imageToRemove = next[albumIndex].images[imageIndex];
      
      // Revoke the object URL if it's a File object
      if (imageToRemove instanceof File) {
        URL.revokeObjectURL(getImagePreviewUrl(imageToRemove));
      }
      
      next[albumIndex].images = next[albumIndex].images.filter((_, idx) => idx !== imageIndex);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!salonId) {
      alert("Salon ID missing. Please complete previous steps.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload all images first
      const uploadedAlbums = [];
      
      for (const album of albums) {
        const uploadedImages = [];
        
        for (const image of album.images) {
          if (typeof image === 'string') {
            // Already uploaded image (URL string)
            uploadedImages.push(image);
          } else {
            // File object needs to be uploaded
            const formData = new FormData();
            formData.append("profile_image", image);
            
            const res = await fetch("https://beautysalon-qq6r.vercel.app/api/salons/upload/profile-image", {
              method: "POST",
              body: formData,
            });
            
            if (res.ok) {
              const data = await res.json();
              uploadedImages.push(data.imageUrl);
            } else {
              console.error("Failed to upload image:", image.name);
              // Continue with other images even if one fails
            }
          }
        }
        
        uploadedAlbums.push({
          album_name: album.name,
          images: uploadedImages
        });
      }

      // Send the payload with uploaded image URLs
      const payload = { albums: uploadedAlbums };
      
      const res = await fetch(`/api/salons/${salonId}/portfolios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save portfolio.");
        return;
      }
      
      navigate("/regsal4", { state: { salonId, userId } });
    } catch (error) {
      console.error("Error submitting portfolio:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
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
        Add your portfolio
      </h1>

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

      <form
        className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-[70%] space-y-8 mb-6"
        onSubmit={handleSubmit}
      >
        {albums.map((album, i) => (
          <div key={i} className="bg-white p-2 sm:p-4 md:p-6">
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Album Name</label>
              <input
                type="text"
                value={album.name}
                onChange={e => handleAlbumNameChange(i, e.target.value)}
                className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                placeholder="Album name"
              />
            </div>
            <div className="border-2 border-dashed border-puce rounded-xl bg-puce/10 p-4 sm:p-6 flex flex-col items-center justify-center text-center mb-4 transition hover:bg-puce/20">
              <Upload className="w-8 h-8 mx-auto text-puce mb-2" />
              <span className="font-semibold text-puce">Upload images</span>
              <span className="text-xs text-gray-500 mb-2">
                Drag &amp; Drop or click below to upload images
              </span>
              <input
                type="file" multiple accept="image/*" className="hidden" id={`upload-input-${i}`}
                onChange={e => handleUploadImages(i, e.target.files)}
              />
              <label
                htmlFor={`upload-input-${i}`}
                className="text-puce underline font-medium text-sm cursor-pointer hover:text-puce1-600 transition"
              >
                Upload images
              </label>
            </div>
            {album.images.length > 0 && (
              <div className="flex overflow-x-auto gap-3 py-2">
                {album.images.map((img, idx) => (
                  <div key={`${i}-${idx}-${img instanceof File ? img.name + img.size : img}`} className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 bg-white group">
                    <img 
                      src={getImagePreviewUrl(img)} 
                      alt={`Portfolio ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i, idx)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      aria-label="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-3xl flex justify-start mb-8">
          <button
            type="button"
            className="bg-puce/10 text-puce border border-puce rounded-lg px-4 py-2 font-medium text-sm hover:bg-puce/20 transition"
            onClick={handleAddAlbum}
          >
            + Add another album
          </button>
        </div>

        <div className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-3xl flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button
            type="button"
            className="w-full sm:w-32 border border-gray-300 text-gray-700 bg-white rounded-lg py-2 font-medium hover:bg-gray-50 transition"
            onClick={() => navigate("/regsal2")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-32 bg-puce text-white rounded-lg py-2 font-medium transition ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-puce1-600'
            }`}
          >
            {isSubmitting ? 'Uploading...' : 'Next'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
