import { motion } from 'framer-motion';
import ImageCarousel from './imageCarousel';
import { Star, MapPin, Globe } from 'lucide-react';

const ServiceCard = ({ service, onFavorite, isFavorited }) => {
  // Normalize fields so this works for both salons and services
  const {
    id,
    name,
    images = [],
    experience,
    languages = [],
    location,
    specialties = [],
    rating = 0,
    reviews = 0,
    price,
  } = service || {};

  const hasLanguages = Array.isArray(languages) && languages.length > 0;
  const hasSpecialties = Array.isArray(specialties) && specialties.length > 0;
  const hasExperience = typeof experience === 'string' && experience.trim().length > 0;
  const hasPrice = typeof price !== 'undefined' && price !== null && price !== '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer"
    >
      <ImageCarousel images={images} alt={name} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{name}</h3>
            {hasExperience && (
              <p className="text-sm text-gray-600">{experience}</p>
            )}
          </div>
        </div>

        {hasLanguages && (
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              Languages: {languages.join(', ')}
            </span>
          </div>
        )}

        {location && (
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{location}</span>
          </div>
        )}

        {hasSpecialties && (
          <div className="flex flex-wrap gap-1 mb-3">
            {specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
              >
                {specialty}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900">
              {Number(rating).toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">({reviews})</span>
          </div>

          {hasPrice && (
            <div className="text-right">
              <span className="text-lg font-semibold text-gray-900">
                ${price}
              </span>
              <span className="text-sm text-gray-500">/session</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
