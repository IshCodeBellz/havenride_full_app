import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { publish } from '@/lib/realtime/publish';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const msgs = await prisma.message.findMany({ where: { bookingId: id }, orderBy: { createdAt: 'asc' } });
  return NextResponse.json(msgs);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { sender, text } = await req.json();
  if (!sender || !text) return NextResponse.json({ error: 'sender and text required' }, { status: 400 });
  const m = await prisma.message.create({ data: { bookingId: id, sender, text } });
  await publish(`booking:${id}`, 'message', m);
  return NextResponse.json(m, { status: 201 });
}
