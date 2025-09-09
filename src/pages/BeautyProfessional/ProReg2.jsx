import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Check } from "lucide-react";
import { api } from "../../lib/api";
import { getSalonId } from "../../lib/proRegistration";

const stepLabels = ["01","02","03","04","05"];
const initialAlbums = [{ album_name: "", images: [] }];

function PortfolioStep() {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState(initialAlbums);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAlbumNameChange = (i, value) =>
    setAlbums(prev => prev.map((a, idx) => (idx===i ? { ...a, album_name: value } : a)));
  const handleAddAlbum = () => setAlbums(prev => [...prev, { album_name: "", images: [] }]);
  const handleUploadImages = (_i, _files) => { /* TODO: push uploaded URLs to albums[i].images */ };

  const onNext = async () => {
    setError(null);
    const salon_id = getSalonId();
    if (!salon_id) return setError("Missing salon id. Please complete Step 2 again.");

    const payload = {
      salon_id,
      albums: albums.filter(a => a.album_name?.trim()).map(a => ({ album_name: a.album_name.trim(), images: a.images || [] }))
    };

    try {
      setLoading(true);
      await fetch("https://beautysalon-qq6r.vercel.app/api/pro/portfolio", { method:"POST", body: payload });
      navigate("/regprofe3");
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
              <label className="text-puce underline font-medium text-sm hover:text-puce1-600 transition cursor-pointer">
                Upload images
                <input type="file" multiple accept="image/*" className="hidden"
                  onChange={(e)=>handleUploadImages(i, Array.from(e.target.files||[]))} />
              </label>
            </div>

            {Array.isArray(album.images) && album.images.length>0 && (
              <div className="flex overflow-x-auto gap-3 py-2">
                {album.images.map((img, idx) => (
                  <div key={idx} className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border bg-white">
                    <img src={img} alt="" className="w-full h-full object-cover"/>
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
