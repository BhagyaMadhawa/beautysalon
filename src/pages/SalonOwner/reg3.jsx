import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Check, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const initialAlbums = [{ name: "Classic lash extensions", images: [] }];
const stepLabels = ["01", "02", "03", "04", "05", "06"];

export default function PortfolioStep() {
  const [albums, setAlbums] = useState(initialAlbums);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOverAlbumIdx, setDragOverAlbumIdx] = useState(null); // NEW: per-album drag highlight
  const navigate = useNavigate();
  const location = useLocation();
  const salonId = location.state?.salonId || null;
  const userId = location.state?.userId || null;

  const handleAlbumNameChange = (i, value) => {
    setAlbums(prev => prev.map((a, idx) => (idx === i ? { ...a, name: value } : a)));
  };
  const handleAddAlbum = () => setAlbums(prev => [...prev, { name: "", images: [] }]);

  // Keep only image files
  const extractImageFiles = (fileListLike) => {
    const arr = Array.from(fileListLike || []);
    return arr.filter(f => typeof f?.type === "string" && f.type.startsWith("image/"));
  };

  const handleUploadImages = (i, files) => {
    const fileArray = extractImageFiles(files);
    if (!fileArray.length) return;
    setAlbums(prev => {
      const next = [...prev];
      next[i].images = [...next[i].images, ...fileArray];
      return next;
    });
  };

  // Preview URL for File or pass-through for string URL
  const getImagePreviewUrl = useCallback((file) => {
    if (typeof file === "string") return file;
    return URL.createObjectURL(file);
  }, []);

  const handleRemoveImage = (albumIndex, imageIndex) => {
    setAlbums(prev => {
      const next = [...prev];
      const imageToRemove = next[albumIndex].images[imageIndex];
      if (imageToRemove instanceof File) {
        // Revoke object URL created during preview
        URL.revokeObjectURL(getImagePreviewUrl(imageToRemove));
      }
      next[albumIndex].images = next[albumIndex].images.filter((_, idx) => idx !== imageIndex);
      return next;
    });
  };

  // ---- Drag & Drop handlers (per album) ----
  const onDragEnter = (e, i) => {
    e.preventDefault(); e.stopPropagation();
    setDragOverAlbumIdx(i);
  };
  const onDragOver = (e, i) => {
    e.preventDefault(); e.stopPropagation();
    if (dragOverAlbumIdx !== i) setDragOverAlbumIdx(i);
  };
  const onDragLeave = (e, i) => {
    e.preventDefault(); e.stopPropagation();
    setDragOverAlbumIdx(curr => (curr === i ? null : curr));
  };
  const onDrop = (e, i) => {
    e.preventDefault(); e.stopPropagation();
    setDragOverAlbumIdx(null);
    const files = e.dataTransfer?.files?.length ? e.dataTransfer.files : [];
    handleUploadImages(i, files);
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
          if (typeof image === "string") {
            uploadedImages.push(image);
          } else {
            const formData = new FormData();
            formData.append("profile_image", image);
            const res = await fetch(
              "https://beautysalon-qq6r.vercel.app/api/salons/upload/profile-image",
              { method: "POST", body: formData }
            );
            if (res.ok) {
              const data = await res.json();
              uploadedImages.push(data.imageUrl);
            } else {
              console.error("Failed to upload image:", image.name);
            }
          }
        }
        uploadedAlbums.push({ album_name: album.name, images: uploadedImages });
      }

      const payload = { albums: uploadedAlbums };
      const res = await fetch(
        `https://beautysalon-qq6r.vercel.app/api/salons/${salonId}/portfolios`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
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
        onSubmit={handleSubmit}
      >
        {albums.map((album, i) => {
          const isDragActive = dragOverAlbumIdx === i;
          return (
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

              {/* Drop zone + click to select */}
              <div
                className={`border-2 border-dashed rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center text-center mb-4 transition
                  ${isDragActive ? "border-puce bg-puce/20" : "border-puce bg-puce/10 hover:bg-puce/20"}`}
                role="button"
                tabIndex={0}
                onDragEnter={(e) => onDragEnter(e, i)}
                onDragOver={(e) => onDragOver(e, i)}
                onDragLeave={(e) => onDragLeave(e, i)}
                onDrop={(e) => onDrop(e, i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    document.getElementById(`upload-input-${i}`)?.click();
                  }
                }}
                aria-label={`Upload images to album ${album.name || i + 1}`}
              >
                <Upload className="w-8 h-8 mx-auto text-puce mb-2" />
                <span className="font-semibold text-puce">Upload images</span>
                <span className="text-xs text-gray-500 mb-2">
                  Drag &amp; drop files here, or click below to select
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id={`upload-input-${i}`}
                  onChange={e => {
                    const files = e.target.files;
                    e.target.value = ""; // allow reselecting the same files
                    handleUploadImages(i, files);
                  }}
                />
                <label
                  htmlFor={`upload-input-${i}`}
                  className="text-puce underline font-medium text-sm cursor-pointer hover:text-puce1-600 transition"
                >
                  Choose images
                </label>
              </div>

              {/* Thumbnails */}
              {album.images.length > 0 && (
                <div className="flex overflow-x-auto gap-3 py-2">
                  {album.images.map((img, idx) => (
                    <div
                      key={`${i}-${idx}-${img instanceof File ? img.name + img.size : img}`}
                      className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 bg-white group"
                    >
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
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
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
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-puce1-600"
            }`}
          >
            {isSubmitting ? "Uploading..." : "Next"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
