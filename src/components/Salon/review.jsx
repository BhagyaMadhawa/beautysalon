import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { api } from '../../lib/api';
import { getFullImageUrl } from '../../lib/imageUtils';

const ReviewsSection = ({ salonId, onReviewSubmitted }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filterRating, setFilterRating] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchReviews();
  }, [page, filterRating, sortBy, salonId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '3',
        ...(filterRating && { rating: filterRating }),
        sortBy
      });

      const response = await api(`/api/salons/${salonId}/reviews?${params}`);
      setReviews(response.reviews || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalCount(response.pagination?.totalCount || 0);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Fallback to mock data if API fails
      setReviews(getMockReviews());
      setTotalPages(8);
      setTotalCount(24);
    } finally {
      setLoading(false);
    }
  };

  const getMockReviews = () => {
    return Array(3).fill({
      id: 1,
      first_name: "Lusamine",
      last_name: "Waltor",
      profile_image_url: "https://randomuser.me/api/portraits/women/68.jpg",
      created_at: "2023-07-14T00:00:00.000Z",
      rating: 4.0,
      review_text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      images: [
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=80&q=80",
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=80&q=80",
      ],
    });
  };

  const handleFilterChange = (rating) => {
    setFilterRating(rating === filterRating ? '' : rating);
    setPage(1);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="bg-white w-full mx-auto px-4 flex-shrink sm:px-6 py-1 mb-2">
        <div className="space-y-8">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="pb-6 border-b border-gray-200 last:border-b-0">
              <div className="animate-pulse">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-11 h-11 rounded-full bg-gray-200"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="flex gap-2 mb-2">
                  <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
                  <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
                  <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full mx-auto px-4 flex-shrink sm:px-6 py-1 mb-2">
      {/* Filters and Sorting */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={filterRating}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review.id} className="pb-6 border-b border-gray-200 last:border-b-0">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-1">
              <img
                src={review.profile_image_url ? getFullImageUrl(review.profile_image_url) : "https://randomuser.me/api/portraits/women/68.jpg"}
                alt={`${review.first_name} ${review.last_name}`}
                className="w-11 h-11 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-gray-900 text-sm sm:text-base">
                  {review.first_name} {review.last_name}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(review.rating) ? 'text-yellow-600 fill-yellow-600' : 'text-gray-300'}`}
                  fill={i < Math.floor(review.rating) ? 'currentColor' : 'none'}
                />
              ))}
              <span className="ml-2 font-semibold text-gray-800 text-base">{review.rating}</span>
            </div>
            {/* Review Text */}
            <div className="text-gray-700 text-sm sm:text-base mb-3">
              {review.review_text}
            </div>
            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {review.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`review-img-${i + 1}`}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {totalCount > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-6">
          <span className="text-xs sm:text-sm text-gray-500">
            Showing {((page - 1) * 3) + 1}-{Math.min(page * 3, totalCount)} of {totalCount} reviews
          </span>
          <div className="flex items-center gap-1">
            <button
              className={`px-3 py-1 rounded-md text-sm ${page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
               Prev
            </button>
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 1, totalPages - 2)) + i;
              if (p <= totalPages) {
                return (
                  <button
                    key={p}
                    className={`px-3 py-1 rounded-md text-sm font-semibold ${
                      page === p
                        ? 'bg-puce text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                );
              }
              return null;
            })}
            <button
              className={`px-3 py-1 rounded-md text-sm ${page === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Next 
            </button>
          </div>
        </div>
      )}
      
      {reviews.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No reviews yet. Be the first to review this salon!
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
