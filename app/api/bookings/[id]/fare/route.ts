import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publish } from "@/lib/realtime/publish";
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { amount, currency } = await req.json();
  if (typeof amount !== "number" || amount < 0)
    return NextResponse.json({ error: "invalid amount" }, { status: 400 });
  const updated = await prisma.booking.update({
    where: { id },
    data: { finalFareAmount: amount, finalFareCurrency: currency || "GBP" },
  });
  await publish("dispatch", "booking_updated", {
    id,
    finalFareAmount: updated.finalFareAmount,
  });
  await publish(`booking:${id}`, "fare", {
    finalFareAmount: updated.finalFareAmount,
  });
  return NextResponse.json(updated);
}
