import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { rideQuality, clientComfort, accessibilityNotes, issuesReported } =
    await req.json();

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        rideQuality,
        clientComfort,
        accessibilityNotes: accessibilityNotes || null,
        issuesReported: issuesReported || null,
        documentedAt: new Date(),
        status: "COMPLETED",
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Failed to document ride:", error);
    return NextResponse.json(
      { error: "Failed to document ride" },
      { status: 500 }
    );
  }
}
