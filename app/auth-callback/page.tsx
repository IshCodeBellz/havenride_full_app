"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

/**
 * Auth Callback Page
 * Redirects users to the appropriate dashboard based on their role after sign-in
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    async function redirectUser() {
      if (!isLoaded) return;

      if (!user?.id) {
        router.push("/");
        return;
      }

      try {
        // Ensure user has a role
        await fetch("/api/users/ensure-role");

        // Fetch user data to get role
        const res = await fetch("/api/users/me");
        if (!res.ok) {
          router.push("/");
          return;
        }

        const data = await res.json();
        const userRole = data.role;

        // Redirect based on role
        if (userRole === "DRIVER") {
          router.push("/driver");
        } else if (userRole === "RIDER") {
          router.push("/rider");
        } else if (userRole === "DISPATCHER") {
          router.push("/dispatcher");
        } else if (userRole === "ADMIN") {
          router.push("/admin");
        } else {
          // No role yet, redirect to home
          router.push("/");
        }
      } catch (error) {
        console.error("Error in auth callback:", error);
        router.push("/");
      }
    }

    redirectUser();
  }, [user, isLoaded, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00796B] mx-auto mb-4"></div>
        <p className="text-neutral-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
