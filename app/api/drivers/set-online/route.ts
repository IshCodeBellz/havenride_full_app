import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { driverId, online } = await req.json();

  if (!driverId || typeof online !== "boolean") {
    return NextResponse.json(
      { error: "driverId and online (boolean) required" },
      { status: 400 }
    );
  }

  try {
    await prisma.driver.update({
      where: { id: driverId },
      data: { isOnline: online },
    });

    return NextResponse.json({ ok: true, isOnline: online });
  } catch (error) {
    console.error("Error updating driver status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
