import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

import DashBoard from '../components/DashBoard/dashboard';
import ApprovalStatusPage from '../components/DashBoard/ApprovalStatusPage';
import { api } from '../lib/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [salonId, setSalonId] = useState(null);
  const [salonLoading, setSalonLoading] = useState(true);
  const [salonError, setSalonError] = useState(null);

  // Check if salonId is passed from navigation state (e.g., after salon registration)
  const navigationSalonId = location.state?.salonId;

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Fetch salon information when user is available
  useEffect(() => {
    const fetchSalon = async () => {
      if (!user?.id) return;

      // If salonId is passed from navigation state (e.g., after salon registration), use it
      if (navigationSalonId) {
        setSalonId(navigationSalonId);
        setSalonLoading(false);
        return;
      }

      // If user is a professional, they can access dashboard without a salon
      if (user.role === 'professional') {
        setSalonId(null); // Professionals don't need salon ID
        setSalonLoading(false);
        return;
      }

      try {
        setSalonLoading(true);
        const data = await api(`/api/salons/user/${user.id}`);
        setSalonId(data.salon.id);
      } catch (error) {
        console.error('Error fetching salon:', error);
        if (error.message.includes('404') || error.message.includes('Not Found')) {
          // User doesn't have a salon yet
          setSalonId(null);
        } else {
          setSalonError(error.message || 'Failed to fetch salon information');
        }
      } finally {
        setSalonLoading(false);
      }
    };

    if (user?.id) {
      fetchSalon();
    }
  }, [user?.id, user?.role, navigationSalonId]);

  if (loading || salonLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (salonError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Error: {salonError}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-puce text-white px-4 py-2 rounded-lg hover:bg-puce/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if user is not approved (pending or rejected)
  if (user?.approval_status === 'pending' || user?.approval_status === 'rejected') {
    return <ApprovalStatusPage approvalStatus={user.approval_status} />;
  }

  return (
    <div className="mb-8">
      <DashBoard userId={user?.id} salonId={salonId} />
    </div>
  );
};

export default Dashboard;
