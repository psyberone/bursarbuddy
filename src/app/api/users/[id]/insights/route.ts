import { NextResponse } from "next/server";
import { z } from "zod";
import { readSession } from "@/lib/session";

const UserId = z.coerce.number().int().positive();
const AI_BASE = process.env.AI_SERVICE_BASE ?? "http://ai:8000";

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
  if (parsed.data !== viewerId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const upstream = await fetch(`${AI_BASE}/summarize`, {
    method: "POST",
    headers: { "X-User-Id": String(viewerId), "content-type": "application/json" },
    body: "{}",
  });

  const body = await upstream.json();
  return NextResponse.json(body, { status: upstream.status });
}
