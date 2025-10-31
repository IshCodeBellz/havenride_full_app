"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface RoleGateProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

export default function RoleGate({ children, requiredRole }: RoleGateProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [hasRole, setHasRole] = useState(false);

  useEffect(() => {
    async function checkRole() {
      if (!isLoaded) return;

      if (!user?.id) {
        router.push("/");
        return;
      }

      try {
        // Try to ensure user has a role (may fail if user already exists with proper setup)
        try {
          const ensureRes = await fetch("/api/users/ensure-role");
          if (!ensureRes.ok) {
            const errorText = await ensureRes.text();
            console.error("Failed to ensure role:", errorText);
            // Don't stop here - continue to fetch user data
          }
        } catch (ensureError) {
          console.error("Error calling ensure-role:", ensureError);
          // Continue anyway - user might already be set up
        }

        // Then fetch user data
        const res = await fetch("/api/users/me");
        if (!res.ok) {
          console.error("Failed to fetch user data");
          router.push("/");
          return;
        }

        const data = await res.json();
        const userRole = data.role;

        console.log(
          "RoleGate: User role is",
          userRole,
          "Required:",
          requiredRole
        );

        if (!userRole) {
          // Still no role after ensure-role, redirect home
          console.log("RoleGate: No role found, redirecting home");
          router.push("/");
          return;
        }

        // If specific role required, check it
        if (requiredRole && !requiredRole.includes(userRole)) {
          // Redirect to their appropriate dashboard
          console.log(
            "RoleGate: User doesn't have required role, redirecting to their dashboard"
          );
          if (userRole === "RIDER") {
            router.push("/rider");
          } else if (userRole === "DRIVER") {
            router.push("/driver");
          } else if (userRole === "DISPATCHER") {
            router.push("/dispatcher");
          } else if (userRole === "ADMIN") {
            router.push("/admin");
          } else {
            router.push("/");
          }
          return;
        }

        console.log("RoleGate: Access granted");
        setHasRole(true);
      } catch (e) {
        console.error("Error checking role:", e);
      } finally {
        setChecking(false);
      }
    }

    checkRole();
  }, [user, isLoaded, router, requiredRole]);

  if (checking) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!hasRole) {
    return null;
  }

  return <>{children}</>;
}
