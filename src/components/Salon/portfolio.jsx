import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';
import { getFullImageUrl, getFallbackProfileImage } from '../../lib/imageUtils';

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
      // Fallback to mock data structure
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

  // Get all unique album names for tabs
  const tabs = portfolios.map(portfolio => portfolio.album_name);
  
  // Get all images from all portfolios for display
  const allImages = portfolios.flatMap(portfolio => 
    portfolio.images?.map(img => ({ ...img, album: portfolio.album_name })) || []
  );

  // Filter images by active tab
  const filteredImages = activeTab < tabs.length 
    ? allImages.filter(img => img.album === tabs[activeTab])
    : allImages;

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
              onClick={() => {
                setActiveTab(idx);
                setVisibleCount(6);
              }}
              className={`pb-2 font-medium whitespace-nowrap transition-colors ${
                activeTab === idx
                  ? 'border-b-2 border-puce text-puce'
                  : 'text-gray-500 hover:text-puce'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <AnimatePresence initial={false}>
          {filteredImages.slice(0, visibleCount).map((img, idx) => (
            <motion.div
              key={getFullImageUrl(img.image_url)}
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
                onError={(e) => {
                  e.target.src = '/src/assets/portfolio/p1.png'; // Fallback image
                }}
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
              className="bg-puce hover:bg-puce1-600 text-white font-medium px-5 py-2 rounded-lg transition-colors text-sm flex items-center"
              onClick={() => setVisibleCount((c) => Math.min(c + 6, filteredImages.length))}
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
