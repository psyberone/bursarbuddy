import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { readSession } from "@/lib/session";

const NewExpense = z.object({
  description: z.string().min(1).max(500),
  amountCents: z.coerce.number().int().positive(),
  groupId: z.coerce.number().int().positive().optional(),
});

export async function POST(request: Request) {
  const viewerId = readSession(request);
  if (viewerId === null) {
    return NextResponse.json({ error: "Please log in" }, { status: 401 });
  }

  const parsed = NewExpense.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid expense" }, { status: 400 });
  }

  if (parsed.data.groupId !== undefined) {
    const membership = await prisma.groupMember.findFirst({
      where: { userId: viewerId, groupId: parsed.data.groupId },
    });
    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const expense = await prisma.expense.create({
    data: {
      userId: viewerId,
      description: parsed.data.description,
      amountCents: parsed.data.amountCents,
      groupId: parsed.data.groupId ?? null,
    },
  });

  return NextResponse.json(expense, { status: 201 });
}

export async function GET(request: Request) {
  const viewerId = readSession(request);
  if (viewerId === null) {
    return NextResponse.json({ error: "Please log in" }, { status: 401 });
  }
  const expenses = await prisma.expense.findMany({ where: { userId: viewerId } });
  return NextResponse.json(expenses);
}
