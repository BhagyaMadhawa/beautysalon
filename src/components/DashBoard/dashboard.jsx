import React, { useEffect, useState } from "react";
import WeeklyClicksChart from "./chart";
import Sidebar from "../sidebar";
import Messages from "../Salon/Messages";
import SalonDetailsPage from "./SalonDetailsPage";
import ReviewsTab from "./ReviewsTab";

const sampleStats = [
  { label: "Total Views", value: "1,234", change: "+12%" },
  { label: "Bookings", value: "89", change: "+5%" },
  { label: "Revenue", value: "$4,567", change: "+8%" },
  { label: "New Customers", value: "45", change: "+15%" }
];

const DashBoard = ({ userId, salonId }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Fetch user role to determine dashboard content
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://beautysalon-qq6r.vercel.app/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.user.role);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    if (userId) {
      fetchUserRole();
    }
  }, [userId]);

  const renderTabContent = () => {
    // Restrict clients to only dashboard and messages tabs
    if (userRole === 'client' && !['dashboard', 'messages'].includes(activeTab)) {
      return (
        <div className="w-full p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
            <p className="text-gray-600">You don't have permission to access this section.</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <div className="w-full p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {sampleStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className={`text-sm ${stat.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last week
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Clicks</h2>
              <WeeklyClicksChart />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">New booking from Sarah M.</span>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">Profile updated successfully</span>
                  <span className="text-xs text-gray-500">Yesterday</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">New review received</span>
                  <span className="text-xs text-gray-500">2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        );
      case "messages":
        return (
          <div className="w-full p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
            <Messages />
          </div>
        );
      case "salonDetails":
        if (!salonId) {
          return (
            <div className="w-full p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Salon Details</h1>
              <div className="text-center">
                <p className="text-gray-600">Salon details are not available.</p>
                {userRole === 'professional' && (
                  <p className="text-sm text-gray-500 mt-2">
                    As a beauty professional, you can manage your services and profile through other sections.
                  </p>
                )}
              </div>
            </div>
          );
        }
        return (
          <div className="w-full p-6 overflow-auto h-full">
            <SalonDetailsPage userId={userId} salonId={salonId} />
          </div>
        );
      case "salonReviews":
        if (!salonId) {
          return (
            <div className="w-full p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h1>
              <div className="text-center">
                <p className="text-gray-600">Reviews are not available.</p>
                {userRole === 'professional' && (
                  <p className="text-sm text-gray-500 mt-2">
                    As a beauty professional, you can build your reputation through client feedback.
                  </p>
                )}
              </div>
            </div>
          );
        }
        return (
          <div className="w-full p-6">
            <ReviewsTab userId={userId} salonId={salonId} />
          </div>
        );
      default:
        return (
          <div className="w-full p-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Select a tab from the sidebar to get started.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen h-screen">
      <div className="flex px-2 mx-auto min-h-screen h-full bg-gray-50">
        <Sidebar onTabSelect={setActiveTab} salonId={salonId} />
        <main className="flex flex-1 min-h-full h-full overflow-auto">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default DashBoard;

