"use client";
import RoleGate from "@/components/RoleGate";

function AdminPageContent() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, drivers, and settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Users</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm text-gray-600">Total users</p>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Drivers</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm text-gray-600">Active drivers</p>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-2">Bookings</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm text-gray-600">Today's rides</p>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-3 flex-wrap">
          <a href="/admin/metrics" className="px-4 py-2 btn-primary rounded">
            View Metrics
          </a>
          <a href="/admin/ops" className="px-4 py-2 btn-secondary rounded">
            Operations
          </a>
          <a
            href="/admin/settings"
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Settings
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <RoleGate requiredRole={["ADMIN"]}>
      <AdminPageContent />
    </RoleGate>
  );
}
