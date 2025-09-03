import React from "react";

export default function ApprovalStatusPage({ approvalStatus }) {
  const messages = {
    approved: {
      title: "Registration Pending",
      message: "Your salon registration is currently pending approval. Please wait for the admin to review your submission.",
    },
    rejected: {
      title: "Registration Rejected",
      message: "Your salon registration has been rejected. Please contact support for more information or to resubmit your application.",
    },
  };

  const { title, message } = messages[approvalStatus] || {
    title: "Status Unknown",
    message: "Your registration status is unknown. Please contact support.",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">{title}</h1>
        <p className="text-gray-700 mb-6">{message}</p>
      </div>
    </div>
  );
}
