import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * Ensures that a signed-in user has a role in the database.
 * If the user doesn't have a role, automatically assigns RIDER.
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    if (!clerkUser?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    // Check if user exists in database
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // If user doesn't exist or doesn't have a role, create/update with RIDER role
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: clerkUser.primaryEmailAddress.emailAddress,
          name:
            `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
            null,
          role: "RIDER",
        },
      });

      // Create rider record
      await prisma.rider.create({
        data: {
          id: userId,
          phone: clerkUser.primaryPhoneNumber?.phoneNumber || null,
        },
      });
    } else if (!user.role) {
      user = await prisma.user.update({
        where: { id: userId },
        data: { role: "RIDER" },
      });

      // Create rider record if it doesn't exist
      await prisma.rider.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          phone: clerkUser.primaryPhoneNumber?.phoneNumber || null,
        },
      });
    }

    // Ensure appropriate record exists based on role
    if (user.role === "RIDER") {
      const riderExists = await prisma.rider.findUnique({
        where: { id: userId },
      });

      if (!riderExists) {
        await prisma.rider.create({
          data: {
            id: userId,
            phone: clerkUser.primaryPhoneNumber?.phoneNumber || null,
          },
        });
      }
    } else if (user.role === "DRIVER") {
      const driverExists = await prisma.driver.findUnique({
        where: { id: userId },
      });

      if (!driverExists) {
        await prisma.driver.create({
          data: {
            id: userId,
            phone: clerkUser.primaryPhoneNumber?.phoneNumber || null,
          },
        });
      }
    }

    return NextResponse.json({ role: user.role });
  } catch (error) {
    console.error("Error ensuring user role:", error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      {
        error: "Failed to ensure user role",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
