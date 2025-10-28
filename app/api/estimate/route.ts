import { NextRequest, NextResponse } from 'next/server';
import { estimateFare } from '@/lib/fare/estimate';
export async function POST(req: NextRequest) {
  const { pickup, dropoff, requiresWheelchair } = await req.json();
  if (!pickup || !dropoff) return NextResponse.json({ error: 'pickup & dropoff required' }, { status: 400 });
  const est = await estimateFare(pickup, dropoff, !!requiresWheelchair);
  return NextResponse.json(est);
}
