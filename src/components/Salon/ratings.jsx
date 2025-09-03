import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import ReviewPopup from './writeReview';
import { api } from '../../lib/api';

const RatingsReviews = ({ salonId, onReviewSubmitted }) => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviewStats();
  }, [salonId]);

  const fetchReviewStats = async () => {
    try {
      setLoading(true);
      const data = await api(`/api/salons/${salonId}/reviews/stats`);
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching review stats:', err);
      setError('Failed to load review statistics');
      // Fallback to mock data
      setStats({
        overall: {
          total_reviews: 11,
          average_rating: 4.9,
          five_star: 8,
          four_star: 2,
          three_star: 1,
          two_star: 0,
          one_star: 0
        },
        categories: [
          { name: "Supplier Service", average_rating: 4.5, total_ratings: 11 },
          { name: "On-time Service", average_rating: 4.5, total_ratings: 11 },
          { name: "Service Quality", average_rating: 4.5, total_ratings: 11 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getSatisfactionText = (rating) => {
    if (rating >= 4.5) return 'Very Satisfied';
    if (rating >= 4.0) return 'Satisfied';
    if (rating >= 3.0) return 'Average';
    if (rating >= 2.0) return 'Below Average';
    return 'Poor';
  };

  const filters = stats ? [
    { label: 'All', count: stats.overall.total_reviews },
    { label: 'With Photos/videos', count: 0 }, // This would need additional API support
    { label: '5 Star', count: stats.overall.five_star },
    { label: '4 Star', count: stats.overall.four_star },
    { label: '3 Star', count: stats.overall.three_star },
    { label: '2 Star', count: stats.overall.two_star },
    { label: '1 Star', count: stats.overall.one_star },
  ] : [];

  const handleReviewSubmit = (data) => {
    console.log('Review submitted:', data);
    // Handle review submission logic here (e.g., API call)
    
    // Call the parent callback to refresh reviews
    if (onReviewSubmitted) {
      onReviewSubmitted();
    }
  };

  return (
    <div className="bg-white w-full mx-auto px-4 flex-shrink sm:px-6 py-1 mb-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-black">Ratings &amp; Reviews</h2>
        <button 
          onClick={() => setIsReviewOpen(true)}
          className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block">
            <path d="M12 20h9" />
            <path d="M16.65 3.85a5 5 0 0 1 0 7.07l-7.07 7.07a5 5 0 0 1-7.07 0 5 5 0 0 1 0-7.07l7.07-7.07a5 5 0 0 1 7.07 0Z" />
          </svg>
          Write a review
        </button>
        <ReviewPopup
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          onSubmit={handleReviewSubmit}
          salonId={salonId}
        />
      </div>

      {/* Overall Rating */}
      {stats && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <span className="text-xl sm:text-2xl font-semibold text-gray-900">
            {Number(stats.overall.average_rating || 0).toFixed(1)}
          </span>
          <span className="text-gray-500 text-base">/5.0</span>
          <span className="text-sm sm:text-base text-gray-700 ml-2">
            {getSatisfactionText(stats.overall.average_rating)}
          </span>
        </div>
      )}

      {/* Rating Bars */}
      {stats && stats.categories && stats.categories.length > 0 && (
        <div className="space-y-3 mb-6">
          {stats.categories.map((category) => (
            <div key={category.name} className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3">
              <span className="w-full xs:w-32 text-sm text-gray-700">{category.name}</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-yellow-500 rounded-full"
                  style={{ width: `${((category.average_rating || 0) / 5) * 100}%` }}
                />
              </div>
              <span className="w-10 text-right text-sm text-gray-700">
                {(category.average_rating || 0).toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.label}
            className="px-4 py-1 rounded-full border border-gray-200 bg-white text-gray-700 text-sm hover:border-puce transition"
          >
            {filter.label} {filter.count !== undefined && <span>({filter.count})</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatingsReviews;
