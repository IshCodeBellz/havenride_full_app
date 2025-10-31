"use client";
import * as Ably from "ably";

let realtime: Ably.Realtime | null = null;
let initializationFailed = false;

export function getRealtime() {
  if (initializationFailed) return null;
  if (realtime) return realtime;

  const key = process.env.NEXT_PUBLIC_ABLY_KEY;
  if (!key) {
    console.warn(
      "Ably key not configured - real-time features will be disabled"
    );
    initializationFailed = true;
    return null;
  }

  try {
    realtime = new Ably.Realtime(key);

    // Handle connection errors
    realtime.connection.on("failed", (stateChange) => {
      console.error("Ably connection failed:", stateChange.reason);
      initializationFailed = true;
    });

    return realtime;
  } catch (error) {
    console.error("Failed to initialize Ably:", error);
    initializationFailed = true;
    return null;
  }
}

// Type-safe channel interface
interface MockChannel {
  subscribe: (handler: any) => void;
  unsubscribe: (handler: any) => void;
  isMock: boolean;
}

export function getChannel(name: string): any {
  const r = getRealtime();
  if (!r) {
    // Return a mock channel that does nothing
    return {
      subscribe: () => {},
      unsubscribe: () => {},
      isMock: true,
    } as MockChannel;
  }
  return r.channels.get(name);
}
