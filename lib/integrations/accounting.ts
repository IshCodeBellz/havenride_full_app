export type AccountingPayload = { id: string; riderId: string; driverId?: string | null; pickupAddress: string; dropoffAddress: string; pickupTime: string; completedAt: string; fare: { amount: number; currency: string }; requiresWheelchair: boolean; distanceKm?: number | null; durationMin?: number | null; metadata?: Record<string, any>; };
async function postJSON(url: string, body: any, headers: Record<string,string> = {}) {
  return fetch(url, { method:'POST', headers: { 'Content-Type':'application/json', ...headers }, body: JSON.stringify(body) });
}
export async function sendToAccounting(payload: AccountingPayload) {
  const target = process.env.ACCOUNTING_WEBHOOK_URL;
  if (!target) return { ok: false, reason: 'no_webhook' };
  const secret = process.env.ACCOUNTING_WEBHOOK_SECRET || '';
  const headers: Record<string,string> = {}; if (secret) headers['X-Accounting-Secret'] = secret;
  try { const res = await postJSON(target, payload, headers); return { ok: res.ok, status: res.status }; } catch { return { ok: false, reason: 'network_error' }; }
}
