"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function RiderProfilePage() {
  const { user } = useUser();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      // Filter for current user's bookings
      const myBookings = data.filter((b: any) => b.riderId === user?.id);
      setBookings(myBookings);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Rider Profile</h1>
        <p className="text-gray-600">Your account and ride history</p>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-600">Email:</span>{" "}
            {user?.emailAddresses[0]?.emailAddress}
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">Name:</span>{" "}
            {user?.fullName || "Not set"}
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Ride History</h2>
        {loading ? (
          <div>Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="text-sm text-gray-500">
            No rides yet. Book your first ride!
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="border rounded p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">
                      {booking.pickupAddress} → {booking.dropoffAddress}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Status:{" "}
                      <span className="capitalize">{booking.status}</span>
                    </div>
                    {booking.createdAt && (
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(booking.createdAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                  {booking.finalFareAmount && (
                    <div className="text-lg font-bold">
                      £{booking.finalFareAmount.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
