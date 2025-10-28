'use client';
import * as Ably from 'ably';
let realtime: Ably.Realtime | null = null;
export function getRealtime() {
  if (realtime) return realtime;
  const key = process.env.NEXT_PUBLIC_ABLY_KEY;
  if (!key) return null;
  realtime = new Ably.Realtime(key);
  return realtime;
}
export function getChannel(name: string) {
  const r = getRealtime();
  if (!r) return { subscribe: (_: any)=>{}, unsubscribe: (_: any)=>{} } as any;
  return r.channels.get(name);
}
