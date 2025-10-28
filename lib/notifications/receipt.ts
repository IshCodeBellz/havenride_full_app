export async function sendReceiptEmail(p: { toEmail: string; bookingId: string; dateISO: string; pickup: string; dropoff: string; fareAmount: number; fareCurrency?: string; distanceKm?: number|null; durationMin?: number|null; }) {
  const RESEND = process.env.RESEND_API_KEY;
  if (!RESEND) return { ok: false, reason: 'resend_not_configured' };
  const html = `
    <div style="font-family:ui-sans-serif,system-ui; padding: 12px;">
      <h2 style="margin:0 0 12px 0;">Your HavenRide receipt</h2>
      <p style="margin:0 0 8px 0; color:#334155;">Booking <b>${p.bookingId}</b> • ${new Date(p.dateISO).toLocaleString()}</p>
      <div style="padding:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; margin-bottom:12px;">
        <div><b>From:</b> ${p.pickup}</div>
        <div><b>To:</b> ${p.dropoff}</div>
      </div>
      <p style="font-size:18px; margin: 0 0 8px 0;"><b>Total: ${p.fareCurrency || 'GBP'} ${p.fareAmount.toFixed(2)}</b></p>
      ${p.distanceKm ? `<div style="color:#475569;">Distance ~ ${p.distanceKm.toFixed(1)} km</div>`:''}
      ${p.durationMin ? `<div style="color:#475569;">Duration ~ ${Math.round(p.durationMin)} min</div>`:''}
      <p style="margin-top:16px; color:#64748b;">Thanks for riding with HavenRide.</p>
    </div>`;
  try {
    const res = await fetch('https://api.resend.com/emails', { method:'POST', headers:{ 'Authorization':`Bearer ${RESEND}`, 'Content-Type':'application/json' }, body: JSON.stringify({ from:'HavenRide <receipts@havenride.app>', to:[p.toEmail], subject:'Your HavenRide receipt', html }) });
    return { ok: res.ok, status: res.status };
  } catch { return { ok: false, reason:'network_error' }; }
}
