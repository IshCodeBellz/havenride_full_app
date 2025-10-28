'use client';
import { useEffect, useRef, useState } from 'react';
import { getChannel } from '@/lib/realtime/ably';

type Message = { id: string; bookingId: string; sender: 'RIDER'|'DRIVER'|'DISPATCHER'; text: string; createdAt: string };

export default function ChatWidget({ bookingId, sender }: { bookingId: string; sender: 'RIDER'|'DRIVER'|'DISPATCHER' }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/bookings/${bookingId}/messages`);
      const data = await res.json();
      setMessages(data);
    })();

    const ch = getChannel(`booking:${bookingId}`);
    const handler = (msg: any) => {
      if (msg.name === 'message') setMessages((prev)=>[...prev, msg.data]);
    };
    (ch as any)?.subscribe?.(handler);
    return () => (ch as any)?.unsubscribe?.(handler);
  }, [bookingId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  async function send() {
    if (!input.trim()) return;
    const res = await fetch(`/api/bookings/${bookingId}/messages`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sender, text: input.trim() })
    });
    if (res.ok) setInput('');
  }

  return (
    <div className="border rounded-lg flex flex-col h-80">
      <div className="p-2 border-b font-semibold">Chat</div>
      <div className="flex-1 overflow-auto p-2 space-y-1 text-sm">
        {messages.map((m)=>(
          <div key={m.id} className={m.sender==='RIDER'?'text-blue-700': m.sender==='DRIVER'?'text-green-700':'text-gray-800'}>
            <span className="font-semibold mr-1">{m.sender}:</span>{m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="p-2 flex gap-2 border-t">
        <input value={input} onChange={(e)=>setInput(e.target.value)} className="border rounded px-2 py-1 flex-1" placeholder="Type a message…" />
        <button onClick={send} className="px-3 py-1 bg-blue-600 text-white rounded">Send</button>
      </div>
    </div>
  );
}
