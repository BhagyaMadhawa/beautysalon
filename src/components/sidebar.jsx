import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Sidebar({ onTabSelect, salonId }) {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Fetch user role to determine which menu items to show
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

    fetchUserRole();
  }, []);

  // If user is a client, only show Dashboard, Messages, and Logout
  if (userRole === 'client') {
    return (
      <aside className="w-64 min-h-screen bg-white shadow-md flex flex-col justify-between p-4">
        {/* Navigation */}
        <nav className="space-y-4">
          <button
            onClick={() => onTabSelect("dashboard")}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-gray-700 hover:bg-puce1-200 focus:outline-none focus:ring-2 focus:ring-puce"
            aria-current="page"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
            Dashboard
          </button>

          <button
            onClick={() => onTabSelect("messages")}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-gray-700 hover:bg-puce1-200 focus:outline-none focus:ring-2 focus:ring-puce"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
            </svg>
            Messages
          </button>

          <button
            className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-gray-700 hover:bg-puce1-200 focus:outline-none focus:ring-2 focus:ring-puce"
            onClick={async () => {
              try {
                await api('/api/auth/logout', { method: 'POST' });
                window.location.href = '/';
              } catch (error) {
                console.error('Logout failed:', error);
              }
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M17 16l4-4m0 0l-4-4m4 4H7" />
            </svg>
            Logout
          </button>
        </nav>

        {/* Get Review Button */}
        <div className="mt-6 p-4 bg-puce1-200 rounded-lg text-center">
          <p className="text-sm font-semibold mb-2">Get Review</p>
          <p className="text-xs mb-4">Share this link to get a review</p>
          <button
            className="w-full px-3 py-2 bg-puce text-white rounded-md hover:bg-puce1-600 transition"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }}
          >
            Copy Link
          </button>
        </div>
      </aside>
    );
  }

  // If no salonId, only show Dashboard, Messages, and Logout
  if (!salonId) {
    return (
      <aside className="w-64 min-h-screen bg-white shadow-md flex flex-col justify-between p-4">
        {/* Navigation */}
        <nav className="space-y-4">
          <button
            onClick={() => onTabSelect("dashboard")}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-gray-700 hover:bg-puce1-200 focus:outline-none focus:ring-2 focus:ring-puce"
            aria-current="page"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
            Dashboard
          </button>

          <button
            onClick={() => onTabSelect("messages")}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-gray-700 hover:bg-puce1-200 focus:outline-none focus:ring-2 focus:ring-puce"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
            </svg>
            Messages
          </button>

          <button
            className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-gray-700 hover:bg-puce1-200 focus:outline-none focus:ring-2 focus:ring-puce"
            onClick={async () => {
              try {
                await api('/api/auth/logout', { method: 'POST' });
                window.location.href = '/';
              } catch (error) {
                console.error('Logout failed:', error);
              }
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M17 16l4-4m0 0l-4-4m4 4H7" />
            </svg>
            Logout
          </button>
        </nav>

        {/* Get Review Button */}
        <div className="mt-6 p-4 bg-puce1-200 rounded-lg text-center">
          <p className="text-sm font-semibold mb-2">Get Review</p>
          <p className="text-xs mb-4">Share this link to get a review</p>
          <button
            className="w-full px-3 py-2 bg-puce text-white rounded-md hover:bg-puce1-600 transition"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }}
          >
            Copy Link
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md flex flex-col justify-between p-4">
      {/* Navigation */}
      <nav className="space-y-4">
        <button
          onClick={() => onTabSelect("dashboard")}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-gray-700 hover:bg-puce1-200 focus:outline-none focus:ring-2 focus:ring-puce"
          aria-current="page"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
          Dashboard
        </button>

        <button
          onClick={() => onTabSelect("messages")}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-gray-700 hover:bg-puce1-200 focus:outline-none focus:ring-2 focus:ring-puce"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
          </svg>
          Messages
        </button>

        {/* Only show salon-specific options for non-professionals */}
        {userRole !== 'professional' && (
          <>
            <button
              onClick={() => onTabSelect("salonDetails")}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-gray-700 hover:bg-puce1-200 focus:outline-none focus:ring-2 focus:ring-puce"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M9 12h6M9 16h6M9 8h6M5 20h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
              </svg>
              Salon Details
            </button>

            <button
              onClick={() => onTabSelect("salonReviews")}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-gray-700 hover:bg-puce1-200 focus:outline-none focus:ring-2 focus:ring-puce"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14v7" />
                <path d="M12 14L3 9" />
                <path d="M21 9l-9 5" />
              </svg>
              Salon Reviews
            </button>
          </>
        )}

        <button
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-gray-700 hover:bg-puce1-200 focus:outline-none focus:ring-2 focus:ring-puce"
          onClick={async () => {
            try {
              await api('/api/auth/logout', { method: 'POST' });
              window.location.href = '/';
            } catch (error) {
              console.error('Logout failed:', error);
            }
          }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M17 16l4-4m0 0l-4-4m4 4H7" />
          </svg>
          Logout
        </button>
      </nav>

      {/* Get Review Button */}
      <div className="mt-6 p-4 bg-puce1-200 rounded-lg text-center">
        <p className="text-sm font-semibold mb-2">Get Review</p>
        <p className="text-xs mb-4">Share this link to get a review</p>
        <button
          className="w-full px-3 py-2 bg-puce text-white rounded-md hover:bg-puce1-600 transition"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
          }}
        >
          Copy Link
        </button>
      </div>
    </aside>
  );
}
