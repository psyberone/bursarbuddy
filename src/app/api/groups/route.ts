import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readSession } from "@/lib/session";

export async function GET(request: Request) {
  const viewerId = readSession(request);
  if (viewerId === null) {
    return NextResponse.json({ error: "Please log in" }, { status: 401 });
  }

  const memberships = await prisma.groupMember.findMany({
    where: { userId: viewerId },
    include: { group: true },
  });

  return NextResponse.json(memberships.map((m) => m.group));
}
