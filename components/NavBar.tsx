'use client';
import Link from 'next/link';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function NavBar() {
  const { isSignedIn } = useUser();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/users/me');
        if (res.ok) {
          const data = await res.json();
          setRole(data.role || null);
        }
      } catch {}
    })();
  }, [isSignedIn]);

  return (
    <div className="w-full border-b bg-white/70 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold">HavenRide</Link>
          <Link href="/role-select" className="text-sm text-gray-700 hover:underline">Role</Link>
          {role === 'RIDER' && <>
            <Link href="/rider" className="text-sm text-gray-700 hover:underline">Book</Link>
            <Link href="/rider/profile" className="text-sm text-gray-700 hover:underline">Profile</Link>
          </>}
          {role === 'DRIVER' && <>
            <Link href="/driver" className="text-sm text-gray-700 hover:underline">Console</Link>
            <Link href="/driver/earnings" className="text-sm text-gray-700 hover:underline">Earnings</Link>
            <Link href="/driver/profile" className="text-sm text-gray-700 hover:underline">Profile</Link>
          </>}
          {role === 'DISPATCHER' && <>
            <Link href="/dispatcher" className="text-sm text-gray-700 hover:underline">Dispatcher</Link>
          </>}
          {role === 'ADMIN' && <>
            <Link href="/admin" className="text-sm text-gray-700 hover:underline">Admin</Link>
            <Link href="/admin/metrics" className="text-sm text-gray-700 hover:underline">Metrics</Link>
            <Link href="/admin/ops" className="text-sm text-gray-700 hover:underline">Ops</Link>
          </>}
        </div>
        <div className="flex items-center gap-3">
          {isSignedIn ? <UserButton afterSignOutUrl="/" /> : <SignInButton />}
        </div>
      </div>
    </div>
  );
}
