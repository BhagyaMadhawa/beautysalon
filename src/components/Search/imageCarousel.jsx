import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, ChevronLeft, ChevronRight, MapPin, Calendar, Globe } from 'lucide-react';

const ImageCarousel = ({ images, alt, onFavorite, isFavorited, service }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className="relative w-full h-52 sm:h-64 md:h-72 lg:h-80 xl:h-96 overflow-hidden rounded-t-xl group"
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
          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(service.id);
            }}
            className="absolute right-2 top-[8%] w-10 h-10 bg-white rounded-md shadow hover:bg-rosy-brown transition-colors duration-200 flex items-center justify-center"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            tabIndex={0}
          >
            <Heart
              className={`w-6 h-6 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-black'}`}
              aria-hidden="true"
            />
          </button>

          {/* Previous Image Button */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 min-w-[40px] min-h-[40px] shadow-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Previous image"
            tabIndex={0}
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>

          {/* Next Image Button */}
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 min-w-[40px] min-h-[40px] shadow-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Next image"
            tabIndex={0}
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>

          {/* Image Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImage(index);
                }}
                className={`w-3 h-3 rounded-full border border-white transition-all duration-200 ${
                  index === currentImage ? 'bg-white' : 'bg-white/60'
                }`}
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
