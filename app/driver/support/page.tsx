"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import RoleGate from "@/components/RoleGate";

function DriverSupportContent() {
  const [searchQuery, setSearchQuery] = useState("");

  const helpArticles = [
    {
      id: 1,
      icon: "🚗",
      title: "Getting Started as a Driver",
      description: "Learn how to set up your profile and start accepting rides",
    },
    {
      id: 2,
      icon: "💰",
      title: "Understanding Earnings & Payouts",
      description: "How driver payouts work and when you get paid",
    },
    {
      id: 3,
      icon: "♿",
      title: "Accessibility Services",
      description: "Guidelines for providing wheelchair-accessible rides",
    },
    {
      id: 4,
      icon: "📋",
      title: "Ride Documentation",
      description: "How to properly document rides after completion",
    },
    {
      id: 5,
      icon: "⭐",
      title: "Vehicle Requirements",
      description: "Vehicle standards and maintenance requirements",
    },
    {
      id: 6,
      icon: "🔒",
      title: "Safety & Security",
      description: "Staying safe while driving and emergency procedures",
    },
  ];

  const filteredArticles = helpArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-8 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F3D3E] mb-2">
          Driver Support
        </h1>
        <p className="text-gray-600">How can we help you today?</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00796B]"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>
      </div>

      {/* Help Articles */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="text-xl font-semibold text-[#0F3D3E] mb-4">
          Help Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div
                key={article.id}
                className="border rounded-xl p-4 hover:border-[#00796B] hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{article.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {article.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-500">
              No articles found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Contact Options */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="text-xl font-semibold text-[#0F3D3E] mb-4">
          Contact Support
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="border-2 border-[#00796B] rounded-xl p-4 hover:bg-[#00796B] hover:text-white transition-colors">
            <div className="text-3xl mb-2">💬</div>
            <div className="font-semibold">Chat with Us</div>
            <div className="text-sm text-gray-600 mt-1">
              Average response: 2 mins
            </div>
          </button>
          <button className="border-2 border-[#00796B] rounded-xl p-4 hover:bg-[#00796B] hover:text-white transition-colors">
            <div className="text-3xl mb-2">📞</div>
            <div className="font-semibold">Call Support</div>
            <div className="text-sm text-gray-600 mt-1">Available 24/7</div>
          </button>
          <button className="border-2 border-[#00796B] rounded-xl p-4 hover:bg-[#00796B] hover:text-white transition-colors">
            <div className="text-3xl mb-2">📧</div>
            <div className="font-semibold">Email Us</div>
            <div className="text-sm text-gray-600 mt-1">
              Response within 24hrs
            </div>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#0F3D3E] mb-4">
          Quick Actions
        </h2>
        <div className="space-y-3">
          <button className="w-full text-left p-4 border rounded-xl hover:border-[#00796B] hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">
                  Report a Safety Issue
                </div>
                <div className="text-sm text-gray-600">
                  Report safety concerns or incidents
                </div>
              </div>
              <div className="text-xl">→</div>
            </div>
          </button>
          <button className="w-full text-left p-4 border rounded-xl hover:border-[#00796B] hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">
                  Update Vehicle Information
                </div>
                <div className="text-sm text-gray-600">
                  Change your vehicle details or documents
                </div>
              </div>
              <div className="text-xl">→</div>
            </div>
          </button>
          <button className="w-full text-left p-4 border rounded-xl hover:border-[#00796B] hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">
                  Request Payment Support
                </div>
                <div className="text-sm text-gray-600">
                  Get help with earnings or payouts
                </div>
              </div>
              <div className="text-xl">→</div>
            </div>
          </button>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🚨</div>
          <div>
            <div className="font-semibold text-red-900 mb-1">
              Emergency Assistance
            </div>
            <div className="text-sm text-red-700">
              If you're in immediate danger, please call emergency services
              (999) or use the SOS button in the app.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DriverSupportPage() {
  return (
    <RoleGate requiredRole={["DRIVER"]}>
      <AppLayout userRole="DRIVER">
        <DriverSupportContent />
      </AppLayout>
    </RoleGate>
  );
}
