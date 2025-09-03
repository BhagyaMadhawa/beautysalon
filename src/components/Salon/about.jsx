import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

const StyledTextBlock = ({ salonId }) => {
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSalonDescription();
  }, [salonId]);

  const fetchSalonDescription = async () => {
    try {
      setLoading(true);
      const data = await api(`/api/salons/${salonId}`);
      setSalon(data.salon || {});
      setError(null);
    } catch (err) {
      console.error('Error fetching salon description:', err);
      setError('Failed to load salon description');
      // Fallback to mock data
      setSalon({
        description: "I'm good at vivid colors, point colors, and arrangements ♪ I'm also good at Korean-style small face cuts and styles! I'll teach you easy styling methods and home care, so if you have any questions, please feel free to ask me ^^ Let's find your cuteness together ♪ I can also speak Korean, so feel free to speak to me in Korean!"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full px-4 sm:px-6 py-1 sm:py-1 text-gray-700 border-b border-ash-grey1-200 flex-shrink">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error && !salon) {
    return (
      <div className="mx-auto w-full px-4 sm:px-6 py-1 sm:py-1 text-gray-700 border-b border-ash-grey1-200 flex-shrink">
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
    <div className="mx-auto w-full px-4 sm:px-6 py-1 sm:py-1 text-gray-700 border-b border-ash-grey1-200 flex-shrink">
      <h1 className="font-bold text-black text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-4">
        {salon.description ? "About Us" : "If You Want Korea Style, Leave It To Me!"}
      </h1>
      <p className="text-sm sm:text-base md:text-lg leading-relaxed">
        {salon.description || "I'm good at vivid colors, point colors, and arrangements ♪ I'm also good at Korean-style small face cuts and styles! I'll teach you easy styling methods and home care, so if you have any questions, please feel free to ask me ^^ Let's find your cuteness together ♪ I can also speak Korean, so feel free to speak to me in Korean!"}{' '}
        <a href="/" className="text-puce font-semibold hover:underline">
          Read more
        </a>
      </p>
    </div>
  );
};

export default StyledTextBlock;
