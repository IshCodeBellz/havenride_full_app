import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { pin } = await req.json();
  const b = await prisma.booking.findUnique({ where: { id } });
  if (!b) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (String(pin) !== String(b.pinCode))
    return NextResponse.json({ error: "invalid_pin" }, { status: 400 });
  const updated = await prisma.booking.update({
    where: { id },
    data: { pickupVerified: true, status: "IN_PROGRESS" },
  });
  return NextResponse.json(updated);
}
