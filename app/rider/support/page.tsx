"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import RoleGate from "@/components/RoleGate";

function RiderSupportContent() {
  const [searchQuery, setSearchQuery] = useState("");

  const helpArticles = [
    {
      title: "How HavenRide Works",
      icon: "😊",
      description: "Learn about our accessible transportation service",
    },
    {
      title: "Refunds and Cancellations",
      icon: "♿",
      description: "Understanding our refund and cancellation policy",
    },
    {
      title: "Accessibility Assistance",
      icon: "📋",
      description: "Information about wheelchair access and mobility support",
    },
    {
      title: "Payment and Receipts",
      icon: "💳",
      description: "Managing payments, receipts, and billing",
    },
  ];

  return (
    <div className="px-8 py-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F3D3E] mb-2">
          Need help? We're here for you.
        </h1>
        <p className="text-gray-600">
          Find answers or contact our support team
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help articles..."
            className="w-full border border-gray-300 rounded-lg px-12 py-4 focus:outline-none focus:ring-2 focus:ring-[#00796B]"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Help Articles */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-[#0F3D3E] mb-4">
            Help Articles
          </h2>
          <div className="space-y-3">
            {helpArticles.map((article, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E0F2F1] rounded-full flex items-center justify-center text-2xl">
                    {article.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0F3D3E] mb-1">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {article.description}
                    </p>
                  </div>
                </div>
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Us */}
        <div>
          <h2 className="text-2xl font-semibold text-[#0F3D3E] mb-4">
            Contact Us
          </h2>
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
            <button className="w-full bg-[#00796B] text-white py-3 rounded-lg font-semibold hover:bg-[#00695C] transition-colors">
              Chat with Support
            </button>
            <button className="w-full border-2 border-[#00796B] text-[#00796B] py-3 rounded-lg font-semibold hover:bg-[#E0F2F1] transition-colors">
              Call Support
            </button>
            <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Report an Issue
            </button>
            <p className="text-sm text-gray-600 mt-4 text-center">
              Our team is available 24/7 to assist with your journey.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="bg-[#0F3D3E] text-white rounded-2xl p-6 mt-8">
        <p className="text-center">
          For emergencies, please use the SOS option on your dashboard.
        </p>
      </div>
    </div>
  );
}

export default function RiderSupportPage() {
  return (
    <RoleGate requiredRole={["RIDER"]}>
      <AppLayout userRole="RIDER">
        <RiderSupportContent />
      </AppLayout>
    </RoleGate>
  );
}
