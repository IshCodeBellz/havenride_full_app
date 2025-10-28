import { prisma } from '@/lib/prisma';

type Coords = { lat: number; lng: number };
type FareResult = { distanceKm: number; durationMin: number; amount: number; currency: string; breakdown: any };

function haversine(a: Coords, b: Coords) {
  const R = 6371; const toRad=(x:number)=>x*Math.PI/180;
  const dLat=toRad(b.lat-a.lat), dLng=toRad(b.lng-a.lng);
  const x=Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(x));
}

async function getSettings() {
  const s = await prisma.settings.findUnique({ where: { id: 1 } });
  if (s) return s;
  return { baseFare: Number(process.env.BASE_FARE || 6), perKm: Number(process.env.PER_KM || 1.8), wheelchairMult: Number(process.env.WHEELCHAIR_MULT || 1.15), provider: 'fallback' } as any;
}

export async function estimateFare(pickup: Coords, dropoff: Coords, requiresWheelchair: boolean): Promise<FareResult> {
  const s = await getSettings();
  const distanceKm = haversine(pickup, dropoff);
  const durationMin = Math.max(6, (distanceKm/25)*60);
  const base = s.baseFare ?? 6, perKm = s.perKm ?? 1.8, wheelchairMult = requiresWheelchair ? (s.wheelchairMult ?? 1.15) : 1;
  const amount = Math.round((base + perKm*distanceKm)*wheelchairMult*100)/100;
  return { distanceKm, durationMin, amount, currency: 'GBP', breakdown: { base, perKm, wheelchairMult, provider: s.provider || 'fallback' } };
}
