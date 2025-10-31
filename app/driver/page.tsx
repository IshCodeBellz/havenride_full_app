"use client";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { getChannel } from "@/lib/realtime/ably";
import ChatWidget from "@/components/ChatWidget";
import RoleGate from "@/components/RoleGate";
import AppLayout from "@/components/AppLayout";
import RideDocumentationForm, {
  RideDocumentation,
} from "@/components/RideDocumentationForm";

function DriverPageContent() {
  const { user } = useUser();
  const [online, setOnline] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [documentingBookingId, setDocumentingBookingId] = useState<
    string | null
  >(null);
  const fetchingRef = useRef(false);
  const initialLoadRef = useRef(true);

  const assigned = useMemo(
    () =>
      bookings.find((b) => b.driverId === user?.id && b.status !== "COMPLETED"),
    [bookings, user?.id]
  );

  useEffect(() => {
    if (assigned?.id) setActiveBookingId(assigned.id);
  }, [assigned?.id]);

  async function toggleOnline(next: boolean) {
    const res = await fetch("/api/drivers/set-online", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ driverId: user?.id, online: next }),
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Unable to change status");
      return;
    }
    setOnline(next);
  }

  useEffect(() => {
    let timer: any;
    if (online) {
      timer = setInterval(async () => {
        await fetch("/api/drivers/update-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            driverId: user?.id,
            lat: 51.5 + Math.random() / 100,
            lng: -0.1 + Math.random() / 100,
          }),
        });
      }, 8000);
    }
    return () => timer && clearInterval(timer);
  }, [online, user?.id]);

  // Memoized fetch function to prevent re-creating on every render
  const fetchBookings = useCallback(async () => {
    // Prevent concurrent fetches
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      fetchingRef.current = false;
      initialLoadRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    fetchBookings();

    // Set up Ably subscription with error handling
    let ch: any = null;
    let subscribed = false;
    let handler: any = null;

    try {
      ch = getChannel(`driver:${user.id}`);
      handler = () => fetchBookings();

      if (ch && !ch.isMock && typeof ch.subscribe === "function") {
        ch.subscribe(handler);
        subscribed = true;
      }
    } catch (error) {
      console.warn("Ably subscription failed, using polling fallback");
    }

    // Polling fallback (only if Ably didn't work, or as backup)
    const timer = setInterval(fetchBookings, 15000); // Increased to 15 seconds

    return () => {
      clearInterval(timer);
      try {
        if (
          subscribed &&
          ch &&
          handler &&
          typeof ch.unsubscribe === "function"
        ) {
          ch.unsubscribe(handler);
        }
      } catch (error) {
        console.warn("Cleanup error:", error);
      }
    };
  }, [user?.id, fetchBookings]);

  async function take(id: string) {
    await fetch(`/api/bookings/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ASSIGNED", driverId: user?.id }),
    });
    fetchBookings();
  }
  async function arrive(id: string) {
    await fetch(`/api/bookings/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ARRIVED" }),
    });
    fetchBookings();
  }
  async function startWithPin(id: string) {
    const pin = prompt("Enter pickup PIN provided by rider");
    if (!pin) return;
    const res = await fetch(`/api/bookings/${id}/verify-pin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    if (!res.ok) {
      alert("Invalid PIN");
      return;
    }
    fetchBookings();
  }
  async function complete(id: string) {
    const input = prompt("Final fare (£)? Leave empty to keep estimate.");
    if (input && !isNaN(Number(input))) {
      await fetch(`/api/bookings/${id}/fare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(input), currency: "GBP" }),
      });
    }
    // Show documentation form instead of completing immediately
    setDocumentingBookingId(id);
  }

  async function handleDocumentationSubmit(data: RideDocumentation) {
    if (!documentingBookingId) return;

    try {
      const res = await fetch(
        `/api/bookings/${documentingBookingId}/document`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to document ride");
      }

      setDocumentingBookingId(null);
      await fetchBookings();
    } catch (error) {
      console.error("Failed to document ride:", error);
      throw error;
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Driver Console</h1>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={online}
            onChange={(e) => toggleOnline(e.target.checked)}
          />
          <span>{online ? "Online" : "Offline"}</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {initialLoadRef.current ? (
            <div className="text-center text-gray-500 py-4">
              Loading bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No bookings yet
            </div>
          ) : (
            bookings.map((b: any) => (
              <div
                key={b.id}
                className={`border rounded p-3 ${
                  activeBookingId === b.id ? "ring-2 ring-blue-400" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">
                      {b.pickupAddress} → {b.dropoffAddress}
                    </div>
                    <div className="text-xs text-gray-600">
                      Status: {b.status} {b.requiresWheelchair ? "• ♿" : ""}
                    </div>
                    {typeof b.finalFareAmount === "number" && (
                      <div className="text-xs text-gray-700">
                        Final fare: £{b.finalFareAmount.toFixed(2)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!b.driverId && (
                      <button
                        className="px-3 py-1 border rounded"
                        onClick={() => take(b.id)}
                      >
                        Take
                      </button>
                    )}
                    {b.status !== "ARRIVED" && (
                      <button
                        className="px-3 py-1 border rounded"
                        onClick={() => arrive(b.id)}
                      >
                        Arrived
                      </button>
                    )}
                    {b.status === "ARRIVED" && (
                      <button
                        className="px-3 py-1 border rounded"
                        onClick={() => startWithPin(b.id)}
                      >
                        Start (PIN)
                      </button>
                    )}
                    {b.status === "IN_PROGRESS" && (
                      <button
                        className="px-3 py-1 border rounded"
                        onClick={() => complete(b.id)}
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Booking ID: <code>{b.id.slice(0, 8)}…</code>
                </div>
                <div className="mt-2">
                  <button
                    className="text-xs underline"
                    onClick={() => setActiveBookingId(b.id)}
                  >
                    Open Chat
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div>
          {activeBookingId ? (
            (() => {
              const activeBooking = bookings.find(
                (b) => b.id === activeBookingId
              );
              const isCompleted =
                activeBooking?.status === "COMPLETED" ||
                activeBooking?.status === "CANCELED";

              if (isCompleted) {
                return (
                  <div className="text-sm text-gray-500 border rounded p-4 h-80 flex items-center justify-center">
                    <div className="text-center">
                      <p className="font-semibold">Chat Closed</p>
                      <p className="mt-2">This ride has been completed</p>
                    </div>
                  </div>
                );
              }

              return (
                <ChatWidget
                  key={activeBookingId}
                  bookingId={activeBookingId}
                  sender="DRIVER"
                />
              );
            })()
          ) : (
            <div className="text-sm text-gray-500 border rounded p-4">
              Select a booking to open chat.
            </div>
          )}
        </div>
      </div>

      {/* Ride Documentation Modal */}
      {documentingBookingId && (
        <RideDocumentationForm
          bookingId={documentingBookingId}
          onSubmit={handleDocumentationSubmit}
          onCancel={() => setDocumentingBookingId(null)}
        />
      )}
    </div>
  );
}

export default function DriverPage() {
  return (
    <RoleGate requiredRole={["DRIVER"]}>
      <AppLayout userRole="DRIVER">
        <DriverPageContent />
      </AppLayout>
    </RoleGate>
  );
}
