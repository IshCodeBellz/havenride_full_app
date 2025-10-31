"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import CenteredContainer from "@/components/CenteredContainer";

/**
 * ADMIN USE ONLY - Manual Role Assignment Page
 *
 * This page is NOT linked in the public navigation.
 * New users are automatically assigned the RIDER role.
 * Drivers should sign up via /driver-signup.
 *
 * This page exists only for internal/admin purposes to manually
 * assign DISPATCHER or ADMIN roles, or to reassign roles as needed.
 */

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
      color: "bg-[#00796B]",
    },
    {
      id: "DRIVER",
      name: "Driver",
      description: "Go online and accept rides",
      color: "bg-[#26A69A]",
    },
    {
      id: "DISPATCHER",
      name: "Dispatcher",
      description: "Assign rides and monitor ops",
      color: "bg-[#4DB6AC]",
    },
    {
      id: "ADMIN",
      name: "Admin",
      description: "Manage system and users",
      color: "bg-[#263238]",
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
    <div className="min-h-screen bg-gray-50 py-20">
      <CenteredContainer>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#263238] mb-4">
              Choose Your Role
            </h1>
            <p className="text-lg text-neutral-600">
              Select how you want to use HavenRide
            </p>
            {!user?.id && (
              <p className="text-sm text-red-600 mt-2">
                Please sign in to continue
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => selectRole(role.id)}
                disabled={assigning || !user?.id}
                className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:border-[#00796B] transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div
                  className={`w-16 h-16 ${role.color} rounded-2xl mb-6 flex items-center justify-center text-white text-2xl font-bold`}
                >
                  {role.name.charAt(0)}
                </div>
                <h3 className="text-2xl font-semibold text-[#263238] mb-2 group-hover:text-[#00796B] transition-colors">
                  {role.name}
                </h3>
                <p className="text-neutral-600">{role.description}</p>
              </button>
            ))}
          </div>

          <div className="text-center pt-6 border-t">
            <p className="text-sm text-neutral-600">
              You can change your role later from the settings
            </p>
          </div>
        </div>
      </CenteredContainer>
    </div>
  );
}
