"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import ChatWidget from "@/components/ChatWidget";
import { getChannel } from "@/lib/realtime/ably";
import RoleGate from "@/components/RoleGate";

function RiderPageContent() {
  const { user } = useUser();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [wheelchair, setWheelchair] = useState(false);
  const [estimate, setEstimate] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (user?.id) {
      fetchBookings();
      // Subscribe to real-time updates for all rider bookings
      const channel = getChannel(`rider:${user.id}`);
      const handler = () => fetchBookings();
      (channel as any)?.subscribe?.(handler);
      return () => (channel as any)?.unsubscribe?.(handler);
    }
  }, [user?.id]);

  async function fetchBookings() {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      const myBookings = data.filter((b: any) => b.riderId === user?.id);
      setBookings(myBookings);

      // Auto-select most recent active booking
      const active = myBookings.find(
        (b: any) => b.status !== "COMPLETED" && b.status !== "CANCELED"
      );
      if (active && !selectedBookingId) {
        setSelectedBookingId(active.id);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleEstimate() {
    if (!pickup || !dropoff) return;
    setLoading(true);
    try {
      // Mock coordinates - in production, use geocoding API
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup: { lat: 51.5074, lng: -0.1278 },
          dropoff: { lat: 51.5155, lng: -0.1384 },
          requiresWheelchair: wheelchair,
        }),
      });
      const data = await res.json();
      setEstimate(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleBook() {
    if (!user) {
      alert("Please sign in to book a ride");
      return;
    }

    setLoading(true);
    try {
      // Create payment intent
      const paymentRes = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(estimate.amount * 100),
          currency: "gbp",
        }),
      });
      const { clientSecret } = await paymentRes.json();

      // Create booking
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          riderId: user.id,
          pickupAddress: pickup,
          dropoffAddress: dropoff,
          pickupTime: new Date(),
          pickupLat: 51.5074,
          pickupLng: -0.1278,
          dropoffLat: 51.5155,
          dropoffLng: -0.1384,
          requiresWheelchair: wheelchair,
          priceEstimate: estimate,
          paymentIntentId: clientSecret,
        }),
      });

      if (bookingRes.ok) {
        const newBooking = await bookingRes.json();
        setBooking(newBooking);
        setPickup("");
        setDropoff("");
        setEstimate(null);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to book ride");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Book a Ride</h1>
        <p className="text-gray-600">Request your accessible ride</p>
      </div>

      {/* Booking Form */}
      {!booking && (
        <div className="card-white space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Pickup Address
            </label>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Enter pickup location"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Drop-off Address
            </label>
            <input
              type="text"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="Enter destination"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="wheelchair"
              checked={wheelchair}
              onChange={(e) => setWheelchair(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="wheelchair" className="text-sm">
              Wheelchair accessible vehicle
            </label>
          </div>

          <button
            onClick={handleEstimate}
            disabled={!pickup || !dropoff || loading}
            className="w-full btn-primary py-3 disabled:opacity-50"
          >
            {loading ? "Estimating..." : "Get Estimate"}
          </button>

          {estimate && (
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Estimated Fare:</span>
                <span className="font-bold text-lg">
                  £{estimate.amount.toFixed(2)}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Distance: ~{estimate.distanceKm.toFixed(1)} km
              </div>
              <button
                onClick={handleBook}
                disabled={loading}
                className="w-full btn-primary py-3 mt-4"
              >
                {loading ? "Booking..." : "Book Ride"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bookings List */}
      {bookings.length > 0 && (
        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              {bookings.map((b: any) => (
                <div
                  key={b.id}
                  className={`border rounded p-4 cursor-pointer hover:shadow transition-shadow ${
                    selectedBookingId === b.id ? "ring-2 ring-blue-400" : ""
                  }`}
                  onClick={() => setSelectedBookingId(b.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-sm">
                        {b.pickupAddress}
                      </div>
                      <div className="text-xs text-gray-600">
                        → {b.dropoffAddress}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        b.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : b.status === "REQUESTED"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {b.createdAt && new Date(b.createdAt).toLocaleString()}
                  </div>
                  {b.finalFareAmount && (
                    <div className="text-sm font-semibold mt-2">
                      £{b.finalFareAmount.toFixed(2)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div>
              {selectedBookingId ? (
                <ChatWidget bookingId={selectedBookingId} sender="RIDER" />
              ) : (
                <div className="text-sm text-gray-500 border rounded p-4 h-80 flex items-center justify-center">
                  Select a booking to view chat
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Confirmation View */}
      {booking && (
        <div className="border rounded-lg p-6 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h3 className="font-semibold text-green-900">
              Booking Confirmed! 🎉
            </h3>
            <p className="text-sm text-green-700 mt-1">
              Your PIN: <strong>{booking.pinCode}</strong>
            </p>
            <p className="text-xs text-green-600 mt-2">
              Give this PIN to your driver for pickup verification.
            </p>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium">From:</span>{" "}
              {booking.pickupAddress}
            </div>
            <div>
              <span className="text-sm font-medium">To:</span>{" "}
              {booking.dropoffAddress}
            </div>
            <div>
              <span className="text-sm font-medium">Status:</span>{" "}
              <span className="capitalize">{booking.status}</span>
            </div>
          </div>

          <ChatWidget bookingId={booking.id} sender="RIDER" />

          <button
            onClick={() => {
              setBooking(null);
              setBookings([]);
            }}
            className="w-full border py-2 rounded hover:bg-gray-50"
          >
            Book Another Ride
          </button>
        </div>
      )}

      <div className="border-t pt-4">
        <Link href="/" className="text-brand hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function RiderPage() {
  return (
    <RoleGate requiredRole={["RIDER"]}>
      <RiderPageContent />
    </RoleGate>
  );
}
