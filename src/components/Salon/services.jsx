import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { api } from '../../lib/api';

const ServicesSection = ({ salonId }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await api(`/api/salons/${salonId}/services`);
        setServices(data.services || data);
        setError(null);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [salonId]);

  if (loading) {
    return (
      <div className="bg-white w-full mx-auto px-4 sm:px-6 py-6 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">Services</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white w-full mx-auto px-4 sm:px-6 py-6 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">Services</h2>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full mx-auto px-4 sm:px-6 py-6 mb-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">Services</h2>
      {services.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No services available at this salon yet.</p>
          <p className="text-gray-400 text-sm mt-2">Services will be added soon.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map(service => (
            <div
              key={service.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 border-b border-ash-grey1-200 hover:bg-gray-100 transition-colors"
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-rose-100 rounded-lg flex items-center justify-center">
                <img
                  src={service.image_url || "https://cdn-icons-png.flaticon.com/512/2922/2922510.png"}
                  alt={service.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                  onError={(e) => {
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/2922/2922510.png";
                  }}
                />
              </div>
              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 mb-1">
                  <span className="font-semibold text-gray-900 text-lg sm:text-xl">{service.name}</span>
                  <span className="text-gray-400 font-bold text-lg">·</span>
                  <span className="flex items-center text-gray-500 text-sm sm:text-base font-medium gap-2">
                    <Clock className="w-5 h-5" />
                    {service.duration}
                  </span>
                </div>
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {service.description}
                </div>
              </div>
              {/* Price */}
              <div className="flex flex-col items-end min-w-[90px]">
                <span className="font-bold text-gray-900 text-lg sm:text-xl">
                  USD {service.price || '0.00'}
                </span>
                {service.discounted_price && service.discounted_price !== service.price && (
                  <span className="text-gray-400 text-sm sm:text-base line-through">
                    USD {service.price || '0.00'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesSection;
