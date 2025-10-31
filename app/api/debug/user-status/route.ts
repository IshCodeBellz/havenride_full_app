import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * Debug endpoint to check user status
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({
        error: "Not signed in",
        userId: null,
      });
    }

    // Check database
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        driver: true,
        rider: true,
      },
    });

    return NextResponse.json({
      clerkUserId: userId,
      databaseUser: dbUser,
      hasDriver: !!dbUser?.driver,
      hasRider: !!dbUser?.rider,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
