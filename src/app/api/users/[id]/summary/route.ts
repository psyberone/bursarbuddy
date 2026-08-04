import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { readSession } from "@/lib/session";

const UserId = z.coerce.number().int().positive();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const viewerId = readSession(request);
  if (viewerId === null) {
    return NextResponse.json({ error: "Please log in" }, { status: 401 });
  }

  const { id } = await params;
  const parsed = UserId.safeParse(id);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  const rows = await prisma.$queryRawUnsafe<Array<{ created: Date; total: bigint }>>(
    `SELECT "createdAt" AS created,
            (SELECT count(*) FROM "User") AS total
       FROM "User"
      WHERE id = ${parsed.data}`,
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: parsed.data,
    memberSince: rows[0].created,
    accountCount: Number(rows[0].total),
  });
}
