"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { getChannel } from "@/lib/realtime/ably";

type Message = {
  id: string;
  bookingId: string;
  sender: "RIDER" | "DRIVER" | "DISPATCHER";
  text: string;
  createdAt: string;
};

export default function ChatWidget({
  bookingId,
  sender,
}: {
  bookingId: string;
  sender: "RIDER" | "DRIVER" | "DISPATCHER";
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch initial messages
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch(`/api/bookings/${bookingId}/messages`);
        if (res.ok && mounted) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [bookingId]);

  // Set up Ably subscription OR polling fallback
  useEffect(() => {
    let ch: any = null;
    let subscribed = false;

    const handler = (msg: any) => {
      if (msg.name === "message") {
        setMessages((prev) => {
          // Avoid duplicates - check by ID
          const exists = prev.some((m) => m.id === msg.data.id);
          if (exists) return prev;

          // Also check if this might replace a temp message with same text
          const tempIndex = prev.findIndex(
            (m) =>
              m.id.startsWith("temp-") &&
              m.text === msg.data.text &&
              m.sender === msg.data.sender
          );

          if (tempIndex !== -1) {
            // Replace the temp message with the real one
            const newMessages = [...prev];
            newMessages[tempIndex] = msg.data;
            return newMessages;
          }

          return [...prev, msg.data];
        });
      }
    };

    try {
      ch = getChannel(`booking:${bookingId}`);

      // Safe subscription with error handling - check if it's not a mock
      if (ch && !ch.isMock && typeof ch.subscribe === "function") {
        ch.subscribe(handler);
        subscribed = true;
        setRealtimeEnabled(true);
      }
    } catch {
      console.warn("Ably subscription failed, falling back to polling");
      setRealtimeEnabled(false);
    }

    // If Ably didn't work, use polling as fallback
    if (!subscribed) {
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/bookings/${bookingId}/messages`);
          if (res.ok) {
            const data = await res.json();
            setMessages(data);
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      }, 3000); // Poll every 3 seconds
    }

    return () => {
      try {
        // Clear polling interval
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

        // Safe unsubscription
        if (subscribed && ch && typeof ch.unsubscribe === "function") {
          ch.unsubscribe(handler);
        }
      } catch (error) {
        console.warn("Cleanup error (ignoring):", error);
      }
    };
  }, [bookingId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = useCallback(async () => {
    if (!input.trim()) return;

    const messageText = input.trim();
    setInput(""); // Clear input immediately for better UX

    // Optimistic update - add message immediately to UI
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      bookingId,
      sender,
      text: messageText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await fetch(`/api/bookings/${bookingId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender, text: messageText }),
      });

      if (res.ok) {
        // Get the actual message from server
        const actualMessage = await res.json();

        // Replace temp message with real one
        setMessages((prev) =>
          prev.map((m) => (m.id === tempMessage.id ? actualMessage : m))
        );
      } else {
        // If failed, remove the optimistic message and restore input
        setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
        setInput(messageText);
        console.error("Failed to send message");
      }
    } catch (error) {
      // If failed, remove the optimistic message and restore input
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
      setInput(messageText);
      console.error("Error sending message:", error);
    }
  }, [input, bookingId, sender]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    [send]
  );

  return (
    <div className="border rounded-lg flex flex-col h-80">
      <div className="p-2 border-b font-semibold bg-gray-50 flex items-center justify-between">
        <span>Chat</span>
        {!realtimeEnabled && (
          <span className="text-xs text-gray-500">(polling mode)</span>
        )}
      </div>
      <div className="flex-1 overflow-auto p-2 space-y-1 text-sm">
        {loading ? (
          <div className="text-center text-gray-500 py-4">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={
                m.sender === "RIDER"
                  ? "text-blue-700"
                  : m.sender === "DRIVER"
                  ? "text-green-700"
                  : "text-gray-800"
              }
            >
              <span className="font-semibold mr-1">{m.sender}:</span>
              {m.text}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
      <div className="p-2 flex gap-2 border-t bg-gray-50">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border rounded px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message…"
          autoComplete="off"
        />
        <button
          onClick={send}
          disabled={!input.trim()}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}
