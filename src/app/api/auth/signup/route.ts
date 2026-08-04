import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { SESSION_COOKIE, signSession } from "@/lib/session";

const SignupBody = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1),
  campusAddress: z.string().min(1),
  phone: z.string().min(1),
  studentId: z.string().min(1),
  bankLast4: z.string().length(4),
});

export async function POST(request: Request) {
  const parsed = SignupBody.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid signup details" }, { status: 400 });
  }

  const { password, ...rest } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email: rest.email } });
  if (existing) {
    return NextResponse.json({ error: "That email is already registered" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: { ...rest, passwordHash: bcrypt.hashSync(password, 10) },
  });

  const response = NextResponse.json({ id: user.id }, { status: 201 });
  response.cookies.set(SESSION_COOKIE, signSession(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return response;
}
