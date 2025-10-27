import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, MapPin, Clock, Star } from 'lucide-react';
import { api } from '../../lib/api';
import { getFullImageUrl, getFallbackProfileImage } from '../../lib/imageUtils';

const SalonCard = ({
  salonId,
  onSendMessage,
  onToggleFavorite,
  salonData // Add salonData prop
}) => {
  const [salon, setSalon] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (salonData) {
      // If salonData is provided from navigation state
      if (salonData.type === 'beauty_professional') {
        // For beauty professionals, fetch additional details as some items might be missing
        fetchBeautyProfessionalDetails(salonData);
      } else {
        // For regular salons, use the data directly without additional fetch
        setSalon(salonData);
        setLoading(false);
      }
    } else {
      // Fallback to original behavior if no salonData provided
      fetchSalonDetails();
    }
  }, [salonId, salonData]);

  const fetchSalonDetails = async () => {
    try {
      setLoading(true);
      // First, fetch salon details to check the type
      const data = await api(`/api/salons/${salonId}`);
      const salonData = data.salon || {};

      // If the salon type is 'beauty_professional', fetch from the beauty professionals endpoint
      if (salonData.type === 'beauty_professional') {
        const proData = await api(`/api/salons/beauty-professionals?searchTerm=${salonData.name}&limit=1`);
        if (proData.beautyProfessionals && proData.beautyProfessionals.length > 0) {
          const proDetails = proData.beautyProfessionals[0];
          setSalon({
            ...salonData,
            experience: proDetails.experience,
            languages: proDetails.languages,
            specialties: proDetails.specialties
          });
        } else {
          setSalon(salonData);
        }
      } else {
        setSalon(salonData);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching salon details:', err);
      setError('Failed to load salon details');
      // Fallback to mock data matching the new API structure
      setSalon({
        id: salonId,
        name: "SOONSIKI Hair Hongdae Romantique Branch",
        email: "contact@soonsiki.com",
        phone: "+1234567890",
        description: "Premium hair salon specializing in modern styles",
        type: "hair_salon",
        profile_image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        is_approved: true,
        average_rating: 4.8,
        total_reviews: 127,
        location: "Shibuya Tokyo, Japan",
        localTime: "12:55 pm local time",
        owner: {
          first_name: "John",
          last_name: "Doe",
          profile_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBeautyProfessionalDetails = async (salonData) => {
    try {
      const proData = await api(`/api/salons/beauty-professionals?searchTerm=${salonData.name}&limit=1`);
      if (proData.beautyProfessionals && proData.beautyProfessionals.length > 0) {
        const proDetails = proData.beautyProfessionals[0];
        setSalon({
          ...salonData,
          experience: proDetails.experience,
          languages: proDetails.languages,
          specialties: proDetails.specialties
        });
      } else {
        setSalon(salonData);
      }
    } catch (err) {
      console.error('Error fetching beauty professional details:', err);
      setSalon(salonData); // Use basic salon data if professional details fail
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
    onToggleFavorite?.(salonId);
  };

  const handleSendMessage = () => {
    onSendMessage?.(salonId);
  };

  if (loading) {
    return (
      <div className="w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden mb-4">
        <div className="animate-pulse">
          <div className="flex justify-center relative pt-4 pb-2 h-[30vh]">
            <div className="relative flex items-center justify-center w-full max-w-xs mx-auto aspect-square">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          <div className="p-4 pt-1">
            <div className="h-6 bg-gray-200 rounded mb-2 w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded mb-6 w-1/3 mx-auto"></div>
            <div className="flex gap-2">
              <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !salon) {
    return (
      <div className="w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden mb-4 p-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      className="w-full mx-auto bg-white rounded-xl shadow-sm hover:shadow-xl transition-all border border-gray-300 duration-300 overflow-hidden mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Available Now Badge */}
      <div className="relative">
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20">
          <span className="bg-pale-dogwood1-600 text-black px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium flex items-center">
            Available Now
          </span>
        </div>

        {/* Stylish Rounded Image Section */}
        <div className="flex justify-center relative pt-4 pb-2 h-[30vh]">
          <div className="relative flex items-center justify-center w-full max-w-xs mx-auto aspect-square">
            {/* Outer border circles */}
            <div className="absolute rounded-full border border-ash-grey1-400 w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48"></div>
            <div className="absolute rounded-full border border-ash-grey1-400 w-32 h-28 sm:w-40 sm:h-36 md:w-44 md:h-40 lg:w-48 lg:h-40 rotate-12"></div>
            {/* Inner border circles */}
            <div className="absolute rounded-full border border-ash-grey1-400 w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 rotate-45"></div>
            <div className="absolute rounded-full border border-ash-grey1-400 w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 -rotate-12"></div>
            {/* Elliptical inner ring */}
            <div className="absolute rounded-full border border-ash-grey1-400 w-28 h-18 sm:w-36 sm:h-24 md:w-40 md:h-28 lg:w-44 lg:h-32 rotate-6"></div>
            {/* Image container */}
            <div className="relative z-10 rounded-full overflow-hidden ring-2 sm:ring-4 ring-white shadow-lg w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40">
              <img
                src={getFullImageUrl(salon.profile_image_url) || "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"}
                alt={salon.name}
                className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-1">
        {/* Salon Name */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 text-center leading-tight">
          {salon.name}
        </h3>

        {/* Location and Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1 sm:gap-2 mb-1">
          {salon.location && (
            <div className="flex gap-1 sm:gap-2 justify-center sm:justify-start">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-600 text-sm truncate">{salon.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1 justify-center sm:justify-start sm:ml-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-gray-700 text-sm font-medium">
              {salon.average_rating}
            </span>
            <span className="text-gray-500 text-sm">
              ({salon.total_reviews || 0} reviews)
            </span>
          </div>
        </div>

        {/* Local Time */}
        {salon.localTime && (
          <div className="flex items-center gap-2 mb-4 sm:mb-6 justify-center">
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-600 text-sm">{salon.localTime}</span>
          </div>
        )}

        <hr className="my-4 border-t-2 border-gray-300 w-[90%] mx-auto" />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={handleSendMessage}
            className="flex-1 bg-puce hover:bg-puce1-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 min-h-[40px]"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Send Message</span>
            <span className="sm:hidden">Message</span>
          </button>

          <button
            onClick={handleFavoriteClick}
            className="flex-1 border border-gray-400 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 min-h-[40px]"
          >
            <Heart
              className={`w-4 h-4 transition-colors duration-200 ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
            <span className="hidden sm:inline">Add to favorite</span>
            <span className="sm:hidden">Favorite</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalonCard;
