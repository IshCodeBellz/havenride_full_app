"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getChannel } from "@/lib/realtime/ably";
import RoleGate from "@/components/RoleGate";

function DispatcherPageContent() {
  const { user } = useUser();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();

    // Subscribe to real-time dispatcher channel
    const channel = getChannel("dispatch");
    const handler = () => {
      fetchBookings();
    };
    (channel as any)?.subscribe?.(handler);

    // Fallback polling
    const timer = setInterval(fetchBookings, 10000);

    return () => {
      (channel as any)?.unsubscribe?.(handler);
      clearInterval(timer);
    };
  }, []);

  async function fetchBookings() {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function assignDriver(bookingId: string, driverId: string) {
    const res = await fetch(`/api/bookings/${bookingId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ASSIGNED", driverId }),
    });
    if (res.ok) fetchBookings();
  }

  const requested = bookings.filter((b) => b.status === "REQUESTED");
  const active = bookings.filter(
    (b) => b.status !== "COMPLETED" && b.status !== "CANCELED" && b.driverId
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dispatcher Console</h1>
        <p className="text-gray-600">Assign rides and monitor operations</p>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              New Requests ({requested.length})
            </h2>
            <div className="space-y-3">
              {requested.length === 0 ? (
                <div className="text-sm text-gray-500">No new requests</div>
              ) : (
                requested.map((booking) => (
                  <div key={booking.id} className="border rounded p-3">
                    <div className="text-sm font-semibold mb-1">
                      {booking.pickupAddress} → {booking.dropoffAddress}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      Status: {booking.status}
                      {booking.requiresWheelchair && " • ♿"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Rider: {booking.riderId.slice(0, 8)}...
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => assignDriver(booking.id, user?.id || "")}
                        className="px-3 py-1 btn-primary text-xs rounded"
                      >
                        Assign to Me
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Active Rides ({active.length})
            </h2>
            <div className="space-y-3">
              {active.length === 0 ? (
                <div className="text-sm text-gray-500">No active rides</div>
              ) : (
                active.map((booking) => (
                  <div key={booking.id} className="border rounded p-3">
                    <div className="text-sm font-semibold mb-1">
                      {booking.pickupAddress} → {booking.dropoffAddress}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      Status: {booking.status} • Driver:{" "}
                      {booking.driverId?.slice(0, 8) || "Unassigned"}
                    </div>
                    {booking.requiresWheelchair && (
                      <div className="text-xs text-green-600">
                        ♿ Wheelchair
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          All Bookings ({bookings.length})
        </h2>
        <div className="text-sm text-gray-500 space-y-1">
          {bookings.length === 0 ? (
            <div>No bookings yet</div>
          ) : (
            <div>
              Requested: {requested.length} • Active: {active.length} •
              Completed:{" "}
              {bookings.filter((b) => b.status === "COMPLETED").length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DispatcherPage() {
  return (
    <RoleGate requiredRole={["DISPATCHER"]}>
      <DispatcherPageContent />
    </RoleGate>
  );
}
