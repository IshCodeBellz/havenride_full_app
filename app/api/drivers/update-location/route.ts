import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function POST(req: NextRequest) {
  const { driverId, lat, lng } = await req.json();
  if (!driverId || typeof lat !== 'number' || typeof lng !== 'number') return NextResponse.json({ error: 'driverId, lat, lng required' }, { status: 400 });
  await prisma.driver.update({ where: { id: driverId }, data: { lastLat: lat, lastLng: lng } });
  return NextResponse.json({ ok: true });
}
