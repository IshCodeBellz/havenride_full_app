import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
export async function getCurrentUserRole(): Promise<
  "RIDER" | "DRIVER" | "DISPATCHER" | "ADMIN" | null
> {
  const { userId } = await auth();
  if (!userId) return null;
  const u = await prisma.user.findUnique({ where: { id: userId } });
  if (u?.role) return u.role as any;
  try {
    const client = await clerkClient();
    const cu = await client.users.getUser(userId);
    const r = (cu.publicMetadata as any)?.role;
    return (r as any) || null;
  } catch {
    return null;
  }
}
export async function requireRole(
  allowed: Array<"RIDER" | "DRIVER" | "DISPATCHER" | "ADMIN">
) {
  const role = await getCurrentUserRole();
  if (!role || !allowed.includes(role)) return { ok: false as const };
  return { ok: true as const, role };
}
