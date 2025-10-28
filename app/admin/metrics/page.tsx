"use client";
import { useEffect, useState } from "react";

export default function AdminMetricsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const [bookingsRes, usersRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/users/me"),
      ]);
      const bookings = await bookingsRes.json();
      const user = await usersRes.json();

      const completed = bookings.filter((b: any) => b.status === "COMPLETED");
      const revenue = completed.reduce((sum: number, b: any) => {
        return sum + (b.finalFareAmount || 0);
      }, 0);

      setStats({
        totalBookings: bookings.length,
        completedBookings: completed.length,
        requestedBookings: bookings.filter((b: any) => b.status === "REQUESTED")
          .length,
        revenue,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Metrics & Analytics</h1>
        <p className="text-gray-600">System performance and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Total Bookings
          </h3>
          <p className="text-3xl font-bold">{stats?.totalBookings || 0}</p>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Completed</h3>
          <p className="text-3xl font-bold">{stats?.completedBookings || 0}</p>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Pending</h3>
          <p className="text-3xl font-bold">{stats?.requestedBookings || 0}</p>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Revenue</h3>
          <p className="text-3xl font-bold">
            £{stats?.revenue.toFixed(2) || "0.00"}
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Booking Status Breakdown</h2>
        <div className="text-sm text-gray-500">
          View detailed breakdown of booking statuses and performance metrics
        </div>
      </div>
    </div>
  );
}
