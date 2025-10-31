import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ role: null });

  const db = await prisma.user.findUnique({ where: { id: userId } });
  if (db?.role) return NextResponse.json({ role: db.role });

  try {
    const client = await clerkClient();
    const u = await client.users.getUser(userId);
    const metaRole = (u.publicMetadata as any)?.role || null;
    return NextResponse.json({ role: metaRole });
  } catch {
    return NextResponse.json({ role: null });
  }
}
