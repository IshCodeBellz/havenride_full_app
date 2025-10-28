"use client";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getChannel } from "@/lib/realtime/ably";
import ChatWidget from "@/components/ChatWidget";
import RoleGate from "@/components/RoleGate";

function DriverPageContent() {
  const { user } = useUser();
  const [online, setOnline] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    fetchBookings();
    const ch = getChannel(`driver:${user?.id}`) as any;
    const onMsg = () => fetchBookings();
    ch?.subscribe?.(onMsg);
    const timer = setInterval(fetchBookings, 10000);
    return () => {
      ch?.unsubscribe?.(onMsg);
      clearInterval(timer);
    };
  }, [user?.id]);

  async function fetchBookings() {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

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
    await fetch(`/api/bookings/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "COMPLETED" }),
    });
    fetchBookings();
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

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            {bookings.map((b: any) => (
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
            ))}
          </div>
          <div>
            {activeBookingId ? (
              <ChatWidget bookingId={activeBookingId} sender="DRIVER" />
            ) : (
              <div className="text-sm text-gray-500 border rounded p-4">
                Select a booking to open chat.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DriverPage() {
  return (
    <RoleGate requiredRole={["DRIVER"]}>
      <DriverPageContent />
    </RoleGate>
  );
}
