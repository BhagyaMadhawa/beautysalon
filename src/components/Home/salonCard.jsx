import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { getFullImageUrl, getFallbackProfileImage } from '../../lib/imageUtils';

const SalonCard = ({ 
  salon,
  onFavoriteToggle 
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    onFavoriteToggle?.(salon.id, !isFavorite);
  };

  return (
    <motion.div 
      className="salon-card w-full max-w-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {/* Image container with heart button */}
      <div className="relative w-full h-60 overflow-hidden">
          <img 
          src={getFullImageUrl(salon.profile_image_url)}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* Favorite button */}
        <motion.button
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white bg-opacity-80 flex items-center justify-center shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFavoriteClick}
        >
          <Heart 
            size={18} 
            className={`transition-colors ${isFavorite ? 'fill-rosy-brown text-rosy-brown' : 'text-gray-600'}`} 
          />
        </motion.button>
      </div>
      
      {/* Salon info */}
      <div className="p-4">
        {/* Salon name */}
        <h3 className="font-semibold text-black text-lg mb-1">{salon.name}</h3>
        
        {/* Location */}
        <p className="text-ash-grey text-sm mb-2">{salon.location}</p>
        
        {/* Rating and reviews */}
        <div className="flex items-center">
          <div className="rating-stars flex items-center">
            <Star size={16} className="fill-rosy-brown text-rosy-brown" />
            <span className="ml-1 text-rose-taupe font-medium">{salon.average_rating.toFixed(1)}</span>
          </div>
          <span className="mx-1 text-ash-grey">•</span>
          <span className="text-ash-grey text-sm">{salon.total_reviews} Reviews</span>
        </div>
      </div>
    </motion.div>
  );
};

// Grid of salon cards that fetches random salons from backend
const BrowseTalentByCategory = () => {
  const navigate = useNavigate();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRandomSalons();
  }, []);

  const fetchRandomSalons = async () => {
    try {
      setLoading(true);
      const data = await api(`/api/salons/random?limit=${8}`);
      setSalons(data.salons || []);
      setError(null);
      console.log(data);
    } catch (err) {
      console.error('Error fetching random salons:', err);
      //console.log(data);
      setError('Failed to load salons');
      // Fallback to mock data if API fails
      setSalons([
        {
          id: 1,
          name: "Athens Salon - Orchard",
          profile_image_url: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80",
          location: "Central, Orchard, River Valley",
          average_rating: 4.6,
          total_reviews: 127
        },
        {
          id: 2,
          name: "Athens Salon - Orchard",
          profile_image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80",
          location: "Central, Orchard, River Valley",
          average_rating: 4.6,
          total_reviews: 127
        },
        {
          id: 3,
          name: "Athens Salon - Orchard",
          profile_image_url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80",
          location: "Central, Orchard, River Valley",
          average_rating: 4.6,
          total_reviews: 127
        },
        {
          id: 4,
          name: "Athens Salon - Orchard",
          profile_image_url: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80",
          location: "Central, Orchard, River Valley",
          average_rating: 4.6,
          total_reviews: 127
        },
        {
          id: 5,
          name: "Athens Salon - Orchard",
          profile_image_url: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80",
          location: "Central, Orchard, River Valley",
          average_rating: 4.6,
          total_reviews: 127
        },
        {
          id: 6,
          name: "Athens Salon - Orchard",
          profile_image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80",
          location: "Central, Orchard, River Valley",
          average_rating: 4.6,
          total_reviews: 127
        },
        {
          id: 7,
          name: "Athens Salon - Orchard",
          profile_image_url: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80",
          location: "Central, Orchard, River Valley",
          average_rating: 4.6,
          total_reviews: 127
        },
        {
          id: 8,
          name: "Athens Salon - Orchard",
          profile_image_url: "https://images.unsplash.com/photo-1580501170888-80668882ca0c?auto=format&fit=crop&q=80",
          location: "Central, Orchard, River Valley",
          average_rating: 4.6,
          total_reviews: 127
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = (salonId, isFavorite) => {
    console.log(`Salon ${salonId} favorite status: ${isFavorite}`);
    // Here you would typically make an API call to update favorite status
  };

  if (loading) {
    return (
      <div className="w-full max-w-[95%] mx-auto px-6 pt-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Browse Salons</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="animate-pulse">
                <div className="w-full h-60 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error && salons.length === 0) {
    return (
      <div className="w-full max-w-[95%] mx-auto px-6 pt-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Browse Salons</h1>
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchRandomSalons}
          className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[95%] mx-auto px-6 pt-20">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Browse Salons</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {salons.map((salon, index) => (
          <motion.div 
            key={salon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            onClick={() => navigate(`/salon/${salon.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <SalonCard 
              salon={salon}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BrowseTalentByCategory;
