"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function RoleSelectPage() {
  const { user } = useUser();
  const router = useRouter();
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roles = [
    {
      id: "RIDER",
      name: "Rider",
      description: "Book and manage your rides",
      color: "bg-brand-700",
    },
    {
      id: "DRIVER",
      name: "Driver",
      description: "Go online and accept rides",
      color: "bg-brand-500",
    },
    {
      id: "DISPATCHER",
      name: "Dispatcher",
      description: "Assign rides and monitor ops",
      color: "bg-brand-400",
    },
    {
      id: "ADMIN",
      name: "Admin",
      description: "Manage system and users",
      color: "bg-neutral-900",
    },
  ];

  async function selectRole(role: string) {
    if (assigning) return;

    setAssigning(true);
    setError(null);

    try {
      const res = await fetch("/api/users/assign-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to assign role");
      }

      // Navigate based on role
      if (role === "RIDER") {
        router.push("/rider");
      } else if (role === "DRIVER") {
        router.push("/driver");
      } else if (role === "DISPATCHER") {
        router.push("/dispatcher");
      } else if (role === "ADMIN") {
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.message || "Failed to assign role");
      setAssigning(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Choose Your Role</h1>
        <p className="text-gray-600">Select how you want to use HavenRide</p>
        {!user?.id && (
          <p className="text-sm text-red-600 mt-2">
            Please sign in to continue
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => selectRole(role.id)}
            disabled={assigning || !user?.id}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className={`w-12 h-12 ${role.color} rounded-lg mb-4`}></div>
            <h3 className="text-xl font-semibold mb-2">{role.name}</h3>
            <p className="text-sm text-gray-600">{role.description}</p>
          </button>
        ))}
      </div>

      <div className="text-center pt-4 border-t">
        <p className="text-sm text-gray-600">
          You can change your role later from the settings
        </p>
      </div>
    </div>
  );
}
