"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import AppLayout from "@/components/AppLayout";
import RoleGate from "@/components/RoleGate";

export default function PastRidesPage() {
  const { user } = useUser();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "canceled">("all");

  useEffect(() => {
    if (!user?.id) return;

    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        const myCompletedBookings = data.filter(
          (b: any) =>
            b.riderId === user?.id &&
            (b.status === "COMPLETED" || b.status === "CANCELED")
        );
        setBookings(myCompletedBookings);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [user?.id]);

  const filteredBookings = bookings.filter((b) => {
    if (filter === "all") return true;
    if (filter === "completed") return b.status === "COMPLETED";
    if (filter === "canceled") return b.status === "CANCELED";
    return true;
  });

  return (
    <RoleGate requiredRole={["RIDER"]}>
      <AppLayout userRole="RIDER">
        <div className="px-8 py-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0F3D3E] mb-2">
              Past Rides
            </h1>
            <p className="text-gray-600">View your ride history</p>
          </div>

          {/* Filter Buttons */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex gap-3">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "all"
                    ? "bg-[#00796B] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({bookings.length})
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "completed"
                    ? "bg-[#00796B] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Completed (
                {bookings.filter((b) => b.status === "COMPLETED").length})
              </button>
              <button
                onClick={() => setFilter("canceled")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "canceled"
                    ? "bg-[#00796B] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Canceled (
                {bookings.filter((b) => b.status === "CANCELED").length})
              </button>
            </div>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
              <p className="text-gray-500">Loading your past rides...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
              <p className="text-gray-500 text-lg mb-2">No rides found</p>
              <p className="text-gray-400 text-sm">
                {filter === "all"
                  ? "You haven't completed any rides yet"
                  : `You have no ${filter} rides`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                    {booking.finalFareAmount && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#0F3D3E]">
                          £{booking.finalFareAmount.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Route */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Pickup</div>
                        <div className="font-medium text-gray-900">
                          {booking.pickupAddress}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          Drop-off
                        </div>
                        <div className="font-medium text-gray-900">
                          {booking.dropoffAddress}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ride Details */}
                  <div className="border-t pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {booking.estimatedDistance && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          Distance
                        </div>
                        <div className="font-medium">
                          {booking.estimatedDistance.toFixed(1)} km
                        </div>
                      </div>
                    )}
                    {booking.estimatedDuration && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          Duration
                        </div>
                        <div className="font-medium">
                          {booking.estimatedDuration.toFixed(0)} min
                        </div>
                      </div>
                    )}
                    {booking.requiresWheelchair && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          Accessibility
                        </div>
                        <div className="font-medium">♿ Wheelchair</div>
                      </div>
                    )}
                    {booking.driverPhone && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Driver</div>
                        <div className="font-medium text-sm">
                          {booking.driverPhone}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Driver's Ride Report (if completed) */}
                  {booking.status === "COMPLETED" && booking.rideQuality && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-sm font-semibold text-green-800 mb-3">
                        Driver's Ride Report
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Quality:</span>
                          <span className="ml-2 font-medium capitalize">
                            {booking.rideQuality}
                          </span>
                          <span className="ml-1">
                            {booking.rideQuality === "excellent" && "🌟"}
                            {booking.rideQuality === "good" && "👍"}
                            {booking.rideQuality === "fair" && "👌"}
                            {booking.rideQuality === "poor" && "😞"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Comfort:</span>
                          <span className="ml-2 font-medium capitalize">
                            {booking.clientComfort.replace("_", " ")}
                          </span>
                          <span className="ml-1">
                            {booking.clientComfort === "very_comfortable" &&
                              "😊"}
                            {booking.clientComfort === "comfortable" && "🙂"}
                          </span>
                        </div>
                      </div>
                      {(booking.accessibilityNotes ||
                        booking.issuesReported) && (
                        <div className="mt-3 pt-3 border-t border-green-300 space-y-2">
                          {booking.accessibilityNotes && (
                            <div>
                              <div className="text-xs text-gray-600 mb-1">
                                Accessibility Notes:
                              </div>
                              <div className="text-sm text-gray-700">
                                {booking.accessibilityNotes}
                              </div>
                            </div>
                          )}
                          {booking.issuesReported && (
                            <div>
                              <div className="text-xs text-gray-600 mb-1">
                                Issues Reported:
                              </div>
                              <div className="text-sm text-gray-700">
                                {booking.issuesReported}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </AppLayout>
    </RoleGate>
  );
}
