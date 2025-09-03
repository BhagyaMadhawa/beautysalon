import React, { useState } from "react";
import SalonDetailsTab from "./SalonDetailsTab";
import ManagePortfolioTab from "./ManagePortfolioTab";
import ServicesTab from "./ServicesTab";
import FaqsTab from "./FaqsTab";

const SalonDetailsPage = ({ userId, salonId }) => {
  const [activeSubTab, setActiveSubTab] = useState("details");

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case "details":
        return <SalonDetailsTab userId={userId} salonId={salonId} />;
      case "portfolio":
        return <ManagePortfolioTab userId={userId} salonId={salonId} />;
      case "services":
        return <ServicesTab userId={userId} salonId={salonId} />;
      case "faqs":
        return <FaqsTab userId={userId} salonId={salonId} />;
      default:
        return <SalonDetailsTab userId={userId} salonId={salonId} />;
    }
  };

  return (
    <div className="w-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Salon Details</h1>

        {/* Sub-tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveSubTab("details")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeSubTab === "details"
                ? "bg-puce text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveSubTab("portfolio")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeSubTab === "portfolio"
                ? "bg-puce text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setActiveSubTab("services")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeSubTab === "services"
                ? "bg-puce text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveSubTab("faqs")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeSubTab === "faqs"
                ? "bg-puce text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            FAQs
          </button>
        </div>

        {/* Sub-tab content */}
        <div>
          {renderSubTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SalonDetailsPage;
