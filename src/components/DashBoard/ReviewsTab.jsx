import React from "react";
import ReviewsSection from "../Salon/review";

const ReviewsTab = ({ userId, salonId }) => {
  return (
    <div className="w-full p-6">
      <h2 className="text-xl font-semibold mb-4">Salon Reviews</h2>
      <ReviewsSection salonId={salonId} />
    </div>
  );
};

export default ReviewsTab;
