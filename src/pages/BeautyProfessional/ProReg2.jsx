import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Check, X } from "lucide-react";
import { api } from "../../lib/api";

const stepLabels = ["01","02","03","04","05"];
const initialAlbums = [{ album_name: "", images: [] }];

function PortfolioStep() {
  const navigate = useNavigate();
  const location = useLocation();
  const { salon_id, userId } = location.state || {};
  const [albums, setAlbums] = useState(initialAlbums);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAlbumNameChange = (i, value) =>
    setAlbums(prev => prev.map((a, idx) => (idx===i ? { ...a, album_name: value } : a)));
  const handleAddAlbum = () => setAlbums(prev => [...prev, { album_name: "", images: [] }]);

  // Function to generate preview URL from File object
  const getImagePreviewUrl = useCallback((file) => {
    if (typeof file === 'string') {
      // If it's already a URL string (for backward compatibility)
      return file;
    }
    return URL.createObjectURL(file);
  }, []);

  const handleUploadImages = (i, files) => {
    const fileArray = Array.from(files);
    setAlbums(prev => {
      const next = [...prev];
      next[i].images = [...next[i].images, ...fileArray];
      return next;
    });
  };

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

  const onNext = async () => {
    setError(null);
    if (!salon_id) return setError("Missing salon id. Please complete Step 1 again.");

    try {
      setLoading(true);

      // Upload all images first
      const uploadedAlbums = [];

      for (const album of albums) {
        if (!album.album_name?.trim()) continue;

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
          album_name: album.album_name.trim(),
          images: uploadedImages
        });
      }

      // Send the payload with uploaded image URLs
      const payload = {
        salon_id,
        albums: uploadedAlbums
      };

      const res = await fetch("https://beautysalon-qq6r.vercel.app/api/pro/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save portfolio");
        return;
      }

      navigate("/regprofe3", { state: { salon_id, userId } });
    } catch (err) {
      setError(err.message || "Failed to save portfolio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="w-full min-h-screen bg-white flex flex-col items-center px-2 py-8" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-black mb-8">Add your portfolio</h1>

      {/* Stepper */}
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-8 w-full max-w-md">
        {stepLabels.map((label, idx) => (
          <React.Fragment key={label}>
            <div className={`flex items-center justify-center w-9 h-9 rounded-full border-2 text-base font-semibold
                ${idx===0 ? "bg-rose-taupe text-white border-rose-taupe" : idx===1 ? "border-2 border-puce bg-white text-puce" : "bg-white text-gray-400 border-gray-200"}`}>
              {idx===0 ? <Check className="w-5 h-5"/> : label}
            </div>
            {idx < stepLabels.length-1 && <div className={`h-1 rounded ${idx===0?"bg-rose-taupe":"bg-gray-200"} w-8 sm:w-10`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Albums */}
      <div className="w-full max-w-[90vw] md:max-w-[70%] space-y-8 mb-6">
        {albums.map((album, i) => (
          <div key={i} className="bg-white p-2 sm:p-4 md:p-6">
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Album Name</label>
              <input className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm"
                value={album.album_name} onChange={e=>handleAlbumNameChange(i, e.target.value)} placeholder="Album name" />
            </div>

            <div className="border-2 border-dashed border-puce rounded-xl bg-puce/10 p-4 sm:p-6 flex flex-col items-center text-center mb-4">
              <Upload className="w-8 h-8 mx-auto text-puce mb-2" />
              <span className="font-semibold text-puce">Upload images</span>
              <span className="text-xs text-gray-500 mb-2">Drag &amp; Drop or click below to upload images</span>
              <label htmlFor={`upload-input-${i}`} className="text-puce underline font-medium text-sm hover:text-puce1-600 transition cursor-pointer">
                Upload images
                <input id={`upload-input-${i}`} type="file" multiple accept="image/*" className="hidden"
                  onChange={(e)=>handleUploadImages(i, Array.from(e.target.files||[]))} />
              </label>
            </div>

            {Array.isArray(album.images) && album.images.length>0 && (
              <div className="flex overflow-x-auto gap-3 py-2">
                {album.images.map((img, idx) => (
                  <div key={`${idx}-${img instanceof File ? img.name + img.size : img}`} className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border bg-white group flex-shrink-0">
                    <img src={getImagePreviewUrl(img)} alt={`Portfolio ${idx + 1}`} className="w-full h-full object-cover"/>
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
      </div>

      {/* Error */}
      {error && <div className="text-center text-red-500 text-sm mb-3">{error}</div>}

      {/* Footer Buttons */}
      <div className="w-full max-w-3xl flex flex-col sm:flex-row gap-3 justify-center mt-2">
        <button type="button" className="w-full sm:w-32 border border-gray-300 rounded-lg py-2">Cancel</button>
        <motion.button type="button" className="w-full sm:w-32 bg-puce text-white rounded-lg py-2 disabled:opacity-60"
          whileHover={{scale:1.03}} whileTap={{scale:0.97}} disabled={loading} onClick={onNext}>
          {loading ? "Saving..." : "Next"}
        </motion.button>
      </div>
    </motion.div>
  );
}

const ProReg2 = () => (
  <div className="max-w-[98%] mx-auto mb-8 px-2 sm:px-4 justify-center ">
    <PortfolioStep />
  </div>
);

export default ProReg2;
