"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function DriverEarningsPage() {
  const { user } = useUser();
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    completedRides: 0,
    averagePerRide: 0,
    thisWeek: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, [user?.id]);

  async function fetchEarnings() {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      const myBookings = data.filter(
        (b: any) => b.driverId === user?.id && b.status === "COMPLETED"
      );

      const totalEarnings = myBookings.reduce((sum: number, b: any) => {
        const fare = b.finalFareAmount || 0;
        return sum + fare * 0.75; // 75% payout rate
      }, 0);

      setEarnings({
        totalEarnings,
        completedRides: myBookings.length,
        averagePerRide:
          myBookings.length > 0 ? totalEarnings / myBookings.length : 0,
        thisWeek: totalEarnings,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Earnings</h1>
        <p className="text-gray-600">View your earnings breakdown</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Total Earnings
          </h3>
          <p className="text-3xl font-bold">
            £{earnings.totalEarnings.toFixed(2)}
          </p>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Completed Rides
          </h3>
          <p className="text-3xl font-bold">{earnings.completedRides}</p>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Avg Per Ride
          </h3>
          <p className="text-3xl font-bold">
            £{earnings.averagePerRide.toFixed(2)}
          </p>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">This Week</h3>
          <p className="text-3xl font-bold">£{earnings.thisWeek.toFixed(2)}</p>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Payout Information</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Payout Rate:</span>
            <span className="font-semibold">75%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Gross Earnings:</span>
            <span>£{(earnings.totalEarnings / 0.75).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Your Share:</span>
            <span className="font-semibold">
              £{earnings.totalEarnings.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
