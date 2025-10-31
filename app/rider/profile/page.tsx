"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import AppLayout from "@/components/AppLayout";
import RoleGate from "@/components/RoleGate";

function RiderProfileContent() {
  const { user } = useUser();
  const [name, setName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(
    user?.primaryEmailAddress?.emailAddress || ""
  );
  const [phone, setPhone] = useState("");
  const [alwaysWheelchair, setAlwaysWheelchair] = useState(false);
  const [needsAssistance, setNeedsAssistance] = useState(false);

  const handleSaveChanges = () => {
    // TODO: Implement save functionality
    alert("Profile updates will be implemented with backend integration");
  };

  return (
    <div className="px-8 py-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F3D3E]">Your Account</h1>
        <p className="text-gray-600">Manage your details and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0F3D3E] mb-6">
            Profile Information
          </h2>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-[#0F3D3E] rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.firstName?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-sm text-gray-500">Profile Picture</p>
              <button className="text-[#00796B] text-sm font-medium hover:underline">
                Change Photo
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00796B]"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00796B]"
                placeholder="johndoe@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00796B]"
                placeholder="+44 7911 123456"
              />
            </div>

            <button
              onClick={handleSaveChanges}
              className="w-full bg-[#00796B] text-white py-3 rounded-lg font-semibold hover:bg-[#00695C] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Saved Locations */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0F3D3E] mb-6">
            Saved Locations
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E0F2F1] rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#00796B]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <span className="font-medium">Home</span>
              </div>
              <button className="text-[#00796B] hover:underline">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E0F2F1] rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#00796B]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="font-medium">Work</span>
              </div>
              <button className="text-[#00796B] hover:underline">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E0F2F1] rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#00796B]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <span className="font-medium">Hospital</span>
              </div>
              <button className="text-[#00796B] hover:underline">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Accessibility Preferences */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0F3D3E] mb-6">
            Accessibility Preferences
          </h2>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={alwaysWheelchair}
                onChange={(e) => setAlwaysWheelchair(e.target.checked)}
                className="w-5 h-5 text-[#00796B] border-gray-300 rounded focus:ring-[#00796B]"
              />
              <div>
                <p className="font-medium text-gray-900">
                  Always request wheelchair-accessible vehicle
                </p>
                <p className="text-sm text-gray-500">
                  All rides will be booked with wheelchair access by default
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={needsAssistance}
                onChange={(e) => setNeedsAssistance(e.target.checked)}
                className="w-5 h-5 text-[#00796B] border-gray-300 rounded focus:ring-[#00796B]"
              />
              <div>
                <p className="font-medium text-gray-900">
                  Needs assistance entering vehicle
                </p>
                <p className="text-sm text-gray-500">
                  Driver will be notified to provide extra assistance
                </p>
              </div>
            </label>
          </div>

          <button className="w-full mt-6 bg-[#00796B] text-white py-3 rounded-lg font-semibold hover:bg-[#00695C] transition-colors">
            Add New Card
          </button>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0F3D3E] mb-6">
            Payment Methods
          </h2>

          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xs">VISA</span>
                </div>
                <div>
                  <p className="font-medium">Card ending in 2483</p>
                  <p className="text-sm text-gray-500">Expires 12/25</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Default
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            All data is securely stored in compliance with GDPR.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RiderProfilePage() {
  return (
    <RoleGate requiredRole={["RIDER"]}>
      <AppLayout userRole="RIDER">
        <RiderProfileContent />
      </AppLayout>
    </RoleGate>
  );
}
