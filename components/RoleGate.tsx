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
        router.push("/role-select");
        return;
      }

      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();
        const userRole = data.role;

        if (!userRole) {
          // No role assigned, redirect to role selection
          router.push("/role-select");
          return;
        }

        // If specific role required, check it
        if (requiredRole && !requiredRole.includes(userRole)) {
          router.push("/role-select");
          return;
        }

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
