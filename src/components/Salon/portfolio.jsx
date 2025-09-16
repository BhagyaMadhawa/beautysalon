import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';
import { getFullImageUrl } from '../../lib/imageUtils';
import { Upload } from 'lucide-react';

const imageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const PortfolioGallery = ({ salonId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // drag-n-drop related
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPortfolios();
  }, [salonId]);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const data = await api(`/api/salons/${salonId}/portfolios`);
      setPortfolios(data.portfolios || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching portfolios:', err);
      setError('Failed to load portfolio. Please try again later.');
      // Fallback mock
      setPortfolios([
        {
          id: 1,
          album_name: 'Classic lash extensions',
          images: [
            { image_url: '/src/assets/portfolio/p1.png' },
            { image_url: '/src/assets/portfolio/p2.png' },
            { image_url: '/src/assets/portfolio/p3.png' },
            { image_url: '/src/assets/portfolio/p4.png' },
            { image_url: '/src/assets/portfolio/p5.png' },
            { image_url: '/src/assets/portfolio/p6.png' }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Tabs
  const tabs = portfolios.map(p => p.album_name);

  // All images flattened
  const allImages = portfolios.flatMap(p =>
    p.images?.map(img => ({ ...img, album: p.album_name })) || []
  );

  // Filter by tab
  const filteredImages =
    activeTab < tabs.length
      ? allImages.filter(img => img.album === tabs[activeTab])
      : allImages;

  // --- Drag & Drop helpers ---
  const extractImageFiles = (fileListLike) => {
    const arr = Array.from(fileListLike || []);
    return arr.filter(f => f && typeof f.type === 'string' && f.type.startsWith('image/'));
  };

  const handleUploadToActiveAlbum = async (files) => {
    if (!tabs.length) return; // no album to target
    const targetAlbum = tabs[activeTab];
    const imageFiles = extractImageFiles(files);
    if (!imageFiles.length) return;

    setUploading(true);
    const uploadedUrls = [];

    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append('profile_image', file);

      try {
        // Reuse the same endpoint you used in your other component
        const res = await fetch(
          'https://beautysalon-qq6r.vercel.app/api/salons/upload/profile-image',
          { method: 'POST', body: formData }
        );
        if (!res.ok) {
          console.warn('One image failed to upload.');
          continue;
        }
        const data = await res.json();
        if (data?.imageUrl) uploadedUrls.push(data.imageUrl);
      } catch (e) {
        console.warn('Upload error:', e);
      }
    }

    if (uploadedUrls.length) {
      // Optimistically update local state
      setPortfolios(prev => {
        const next = prev.map(p => {
          if (p.album_name !== targetAlbum) return p;
          const existing = Array.isArray(p.images) ? p.images : [];
          return {
            ...p,
            images: [
              ...existing,
              ...uploadedUrls.map(u => ({ image_url: u }))
            ]
          };
        });
        return next;
      });

      // OPTIONAL: Persist to your backend if you have an endpoint to append.
      // Example (adjust to your API):
      // await api(`/api/salons/${salonId}/portfolios/append`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ album_name: targetAlbum, images: uploadedUrls })
      // });
    }

    setUploading(false);
  };

  const onDragEnter = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(true);
  }, []);
  const onDragOver = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    if (!dragActive) setDragActive(true);
  }, [dragActive]);
  const onDragLeave = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
  }, []);
  const onDrop = useCallback(async (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    const dt = e.dataTransfer;
    const files = dt?.files?.length ? dt.files : [];
    await handleUploadToActiveAlbum(files);
  }, [activeTab, tabs]);

  if (loading) {
    return (
      <motion.div
        className="bg-white w-full mx-auto px-4 sm:px-6 py-1 mb-2"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-bold text-black text-2xl sm:text-3xl mb-4">Portfolio</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="aspect-[4/3] bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white w-full mx-auto px-4 sm:px-6 py-1 mb-2"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="font-bold text-black text-2xl sm:text-3xl mb-4">Portfolio</h2>

      {/* Tabs */}
      {tabs.length > 0 && (
        <div className="flex space-x-4 border-b border-gray-200 mb-4 overflow-x-auto scrollbar-hide">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(idx); setVisibleCount(6); }}
              className={`pb-2 font-medium whitespace-nowrap transition-colors ${
                activeTab === idx
                  ? 'border-b-2 border-puce text-puce'
                  : 'text-gray-500 hover:text-puce'
              }`}
              aria-pressed={activeTab === idx}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Drop Zone (targets current tab) */}
      {tabs.length > 0 && (
        <div
          className={`mb-4 rounded-xl border-2 border-dashed p-4 sm:p-6 text-center transition 
            ${dragActive ? 'border-puce bg-puce/20' : 'border-puce bg-puce/10 hover:bg-puce/20'}
            ${uploading ? 'opacity-75 cursor-progress' : ''}
          `}
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              document.getElementById('portfolio-upload-input')?.click();
            }
          }}
          aria-label={`Upload images to album ${tabs[activeTab]}`}
        >
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-8 h-8 mb-2 text-puce" />
            <p className="font-semibold text-puce">
              {uploading ? 'Uploading...' : `Add images to “${tabs[activeTab]}”`}
            </p>
            <p className="text-xs text-gray-500 mb-2">
              Drag &amp; drop images here, or click below to select
            </p>
            <input
              id="portfolio-upload-input"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const files = e.target.files;
                // Reset the input so the same file can be selected twice in a row
                e.target.value = '';
                await handleUploadToActiveAlbum(files);
              }}
            />
            <label
              htmlFor="portfolio-upload-input"
              className="text-puce underline font-medium text-sm cursor-pointer hover:text-puce1-600"
            >
              Choose images
            </label>
          </div>
        </div>
      )}

      {/* Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <AnimatePresence initial={false}>
          {filteredImages.slice(0, visibleCount).map((img, idx) => (
            <motion.div
              key={getFullImageUrl(img.image_url) + idx}
              className="aspect-[4/3] overflow-hidden rounded-xl"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              transition={{ duration: 0.35, delay: idx * 0.05 }}
            >
              <img
                src={getFullImageUrl(img.image_url)}
                alt={`Portfolio ${idx + 1}`}
                className="w-full h-full object-cover rounded-xl"
                loading="lazy"
                onError={(e) => { e.currentTarget.src = '/src/assets/portfolio/p1.png'; }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom Section */}
      {filteredImages.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-2">
          <span className="text-sm text-gray-500">
            Showing {String(Math.min(visibleCount, filteredImages.length)).padStart(2, '0')} of {filteredImages.length} Images
          </span>
          {visibleCount < filteredImages.length && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.04 }}
              className="bg-puce hover:bg-puce1-600 text-white font-medium px-5 py-2 rounded-lg transition-colors text-sm flex items-center disabled:opacity-60"
              onClick={() => setVisibleCount((c) => Math.min(c + 6, filteredImages.length))}
              disabled={uploading}
            >
              Show More <span className="ml-1">&#9660;</span>
            </motion.button>
          )}
        </div>
      )}

      <hr className="my-4 border-t-2 border-gray-300 w-full mx-auto" />
    </motion.div>
  );
};

export default PortfolioGallery;
