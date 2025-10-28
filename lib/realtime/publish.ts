import Ably from "ably";
let rest: Ably.Rest | null = null;
function getRest() {
  if (rest) return rest;
  const key = process.env.ABLY_SERVER_KEY || process.env.NEXT_PUBLIC_ABLY_KEY;
  if (!key) return null;
  rest = new Ably.Rest(key);
  return rest;
}
export async function publish(channel: string, name: string, data: any) {
  const r = getRest();
  if (!r) return;
  try {
    await r.channels.get(channel).publish(name, data);
  } catch (e) {
    console.warn("Ably publish failed", e);
  }
}
