import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageCarousel = ({ images, alt = "Carousel Image", className = "" }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index, e) => {
    e.stopPropagation();
    setCurrentImage(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`relative w-full h-40 sm:h-48 bg-gray-200 rounded-t-xl flex items-center justify-center ${className}`}>
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-40 sm:h-64 md:h-80 overflow-hidden rounded-t-xl group ${className}`}
      tabIndex={0}
      aria-label="Image carousel"
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentImage}
          src={images[currentImage]}
          alt={`${alt} - Image ${currentImage + 1}`}
          className="w-full h-full object-cover object-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop';
          }}
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          {/* Navigation Buttons */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 min-w-[40px] min-h-[40px] shadow-md transition-opacity duration-200 z-10
              opacity-100 md:opacity-0 md:group-hover:opacity-100"
            aria-label="Previous image"
            tabIndex={0}
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 min-w-[40px] min-h-[40px] shadow-md transition-opacity duration-200 z-10
              opacity-100 md:opacity-0 md:group-hover:opacity-100"
            aria-label="Next image"
            tabIndex={0}
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => goToImage(index, e)}
                className={`w-3 h-3 rounded-full border border-white transition-all duration-200
                  ${index === currentImage ? 'bg-white' : 'bg-white/60'}`}
                aria-label={`Go to image ${index + 1}`}
                tabIndex={0}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
