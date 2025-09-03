import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, ChevronLeft, ChevronRight, MapPin, Calendar, Globe } from 'lucide-react';

// Mock data for demonstration
const mockResults = [
  {
    id: 1,
    name: "Hinata Hyuga",
    experience: "5 Years Experience",
    languages: ["English", "Korean"],
    specialties: ["Japanese Style", "Luxe", "Up"],
    rating: 4.8,
    reviews: 127,
    price: 85,
    images: [
      "https://images.unsplash.com/photo-1594736797933-d0300ba0c580?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=300&h=200&fit=crop"
    ],
    location: "Seoul, Korea"
  },
  {
    id: 2,
    name: "Hinata Hyuga",
    experience: "3 Years Experience", 
    languages: ["English", "Korean"],
    specialties: ["Natural", "Bridal", "Event"],
    rating: 4.9,
    reviews: 89,
    price: 95,
    images: [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=200&fit=crop"
    ],
    location: "Seoul, Korea"
  },
  // Add more mock data...
];

// ImageCarousel Component
const ImageCarousel = ({ images, alt }) => {
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
    <div className="relative w-full h-48 overflow-hidden rounded-t-xl group">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentImage}
          src={images[currentImage]}
          alt={`${alt} - Image ${currentImage + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>
      
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ChevronLeft className="w-4 h-4 text-gray-800" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ChevronRight className="w-4 h-4 text-gray-800" />
          </button>
          
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImage(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentImage ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ServiceCard Component
const ServiceCard = ({ service, onFavorite, isFavorited }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer"
    >
      <ImageCarousel images={service.images} alt={service.name} />
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{service.name}</h3>
            <p className="text-sm text-gray-600">{service.experience}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(service.id);
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <Heart 
              className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            Languages: {service.languages.join(', ')}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{service.location}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {service.specialties.map((specialty, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
            >
              {specialty}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900">{service.rating}</span>
            <span className="text-sm text-gray-500">({service.reviews})</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-semibold text-gray-900">${service.price}</span>
            <span className="text-sm text-gray-500">/session</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// FilterSection Component
const FilterSection = ({ filters, onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([filters.priceMin || 0, filters.priceMax || 200]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value);
    setPriceRange(newRange);
    onFilterChange({
      ...filters,
      priceMin: newRange[0],
      priceMax: newRange[1]
    });
  };

  const services = ['Hair Styling', 'Lashes', 'Semi-Permanent Makeup', 'Hair Removal', 'Nails'];
  const locations = ['Seoul, Korea', 'Busan, Korea', 'Tokyo, Japan', 'Osaka, Japan'];
  const languages = ['English', 'Korean', 'Japanese', 'Chinese', 'Spanish'];
  const ratings = [5, 4, 3, 2, 1];

  return (
    <div className="bg-white rounded-xl shadow-card p-6 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
        <button
          onClick={() => onFilterChange({})}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Services */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Services</h3>
        <div className="space-y-2">
          {services.slice(0, isExpanded ? services.length : 3).map((service) => (
            <label key={service} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.services?.includes(service) || false}
                onChange={(e) => {
                  const newServices = e.target.checked
                    ? [...(filters.services || []), service]
                    : (filters.services || []).filter(s => s !== service);
                  onFilterChange({ ...filters, services: newServices });
                }}
                className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{service}</span>
            </label>
          ))}
          {services.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              {isExpanded ? 'Show Less' : `Show ${services.length - 3} More`}
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="Min"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Location</h3>
        <select
          value={filters.location || ''}
          onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select location</option>
          {locations.map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>

      {/* Languages */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Languages</h3>
        <div className="space-y-2">
          {languages.map((language) => (
            <label key={language} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.languages?.includes(language) || false}
                onChange={(e) => {
                  const newLanguages = e.target.checked
                    ? [...(filters.languages || []), language]
                    : (filters.languages || []).filter(l => l !== language);
                  onFilterChange({ ...filters, languages: newLanguages });
                }}
                className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{language}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Customer Rating</h3>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <label key={rating} className="flex items-center">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === rating}
                onChange={() => onFilterChange({ ...filters, rating })}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <div className="ml-2 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm text-gray-700">& up</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main SearchResults Component
const SearchResults = () => {
  const [filters, setFilters] = useState({});
  const [favorites, setFavorites] = useState(new Set());
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');

  const handleFavorite = (serviceId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(serviceId)) {
      newFavorites.delete(serviceId);
    } else {
      newFavorites.add(serviceId);
    }
    setFavorites(newFavorites);
  };

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },  
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <div className="w-80 flex-shrink-0">
            <FilterSection filters={filters} onFilterChange={setFilters} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Header */}
            <div className="bg-white rounded-xl shadow-card p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Semi-Permanent Makeup</h1>
                  <p className="text-gray-600">3,527 Results for Semi-Permanent Makeup</p>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {mockResults.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onFavorite={handleFavorite}
                    isFavorited={favorites.has(service.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            <div className="flex items-center justify-center mt-12 gap-2">
              <button className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors">
                Previous
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    page === 1
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;