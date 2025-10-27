import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import '../App.css';

import SalonCard from '../components/Salon/profileCard';
import StyledTextBlock from '../components/Salon/about';
import PortfolioGallery from '../components/Salon/portfolio';
import ServicesSection from '../components/Salon/services';
import RatingsReviews from '../components/Salon/ratings';
import ReviewsSection from '../components/Salon/review';
import FAQ from '../components/Salon/faq';
import ProfileInfo from '../components/Salon/info';
import ReviewPopup from '../components/Salon/writeReview';

const Salon = () => {
  const [refreshReviews, setRefreshReviews] = useState(0);
  const { salonId } = useParams(); // Get salonId from route parameters
  const location = useLocation();
  const salonData = location.state?.salon; // Get salon data from navigation state

  const handleReviewSubmitted = () => {
    // Increment refresh counter to trigger reviews refresh
    setRefreshReviews(prev => prev + 1);
  };

  return (
    <>
      <hr className="mb-8 border-t border-gray-300 w-[97%] mx-auto" />
      <div className="max-w-[98%] mx-auto mb-8 px-2 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Profile Card + Info */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <SalonCard salonId={salonId} salonData={salonData} />
            <ProfileInfo salonId={salonId} />
          </div>
          {/* Right Column: Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <StyledTextBlock salonId={salonId}/>
            <PortfolioGallery salonId={salonId} />
            <ServicesSection salonId={salonId} />
            <RatingsReviews salonId={salonId} onReviewSubmitted={handleReviewSubmitted} />
            <ReviewsSection salonId={salonId} key={refreshReviews} />
            <FAQ salonId={salonId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Salon;
