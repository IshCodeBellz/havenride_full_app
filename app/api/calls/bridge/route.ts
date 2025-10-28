  import { NextRequest } from 'next/server';
  export async function GET(req: NextRequest) {
    const FROM = process.env.TWILIO_FROM_NUMBER || '';
    const to = req.nextUrl.searchParams.get('to') || '';
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Connecting your call. Please hold.</Say>
  <Dial callerId="${FROM}">${to}</Dial>
</Response>`;
    return new Response(twiml, { status: 200, headers: { 'Content-Type': 'application/xml' } });
  }
