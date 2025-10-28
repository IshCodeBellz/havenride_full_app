"use client";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function DriverProfilePage() {
  const { user } = useUser();
  const [vehicle, setVehicle] = useState({
    make: "",
    model: "",
    plate: "",
    wheelchairCapable: false,
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Driver Profile</h1>
        <p className="text-gray-600">Manage your driver information</p>
      </div>

      <div className="border rounded-lg p-6 space-y-6">
        <div>
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

        <div>
          <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Vehicle Make
              </label>
              <input
                type="text"
                value={vehicle.make}
                onChange={(e) =>
                  setVehicle({ ...vehicle, make: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                placeholder="e.g., Toyota"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Vehicle Model
              </label>
              <input
                type="text"
                value={vehicle.model}
                onChange={(e) =>
                  setVehicle({ ...vehicle, model: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                placeholder="e.g., Prius"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                License Plate
              </label>
              <input
                type="text"
                value={vehicle.plate}
                onChange={(e) =>
                  setVehicle({ ...vehicle, plate: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                placeholder="e.g., AB12 CDE"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="wheelchair"
                checked={vehicle.wheelchairCapable}
                onChange={(e) =>
                  setVehicle({
                    ...vehicle,
                    wheelchairCapable: e.target.checked,
                  })
                }
                className="w-4 h-4"
              />
              <label htmlFor="wheelchair" className="text-sm">
                Vehicle is wheelchair accessible
              </label>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Verification Status</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Documents pending verification</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <button className="px-6 py-2 btn-primary rounded">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
