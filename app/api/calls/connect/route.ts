import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const { riderPhone, driverPhone } = await req.json();
  const SID = process.env.TWILIO_ACCOUNT_SID; const TOKEN = process.env.TWILIO_AUTH_TOKEN; const FROM = process.env.TWILIO_FROM_NUMBER; const BASE_URL = process.env.PUBLIC_BASE_URL;
  if (!SID || !TOKEN || !FROM || !BASE_URL) return NextResponse.json({ error: 'Twilio env not configured' }, { status: 400 });
  if (!riderPhone || !driverPhone) return NextResponse.json({ error: 'riderPhone and driverPhone required' }, { status: 400 });
  const url = `${BASE_URL}/api/calls/bridge?to=${encodeURIComponent(driverPhone)}`;
  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${SID}/Calls.json`;
  const params = new URLSearchParams(); params.append('From', FROM); params.append('To', riderPhone); params.append('Url', url);
  const resp = await fetch(twilioUrl, { method:'POST', headers:{ 'Authorization':'Basic '+Buffer.from(`${SID}:${TOKEN}`).toString('base64'), 'Content-Type':'application/x-www-form-urlencoded' }, body: params as any });
  if (!resp.ok) return NextResponse.json({ error: 'Twilio call failed', detail: await resp.text() }, { status: 502 });
  return NextResponse.json({ ok: true });
}
