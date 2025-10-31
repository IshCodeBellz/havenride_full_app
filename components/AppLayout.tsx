"use client";
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import SOSButton from "./SOSButton";

interface AppLayoutProps {
  children: ReactNode;
  userRole?: string;
}

export default function AppLayout({ children, userRole }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={userRole} />
      <main className="flex-1 overflow-auto">{children}</main>
      {/* SOS Button for Riders and Drivers */}
      {(userRole === "RIDER" || userRole === "DRIVER") && <SOSButton />}
    </div>
  );
}
