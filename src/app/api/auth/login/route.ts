import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { SESSION_COOKIE, signSession } from "@/lib/session";

const LoginBody = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: Request) {
  const parsed = LoginBody.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid login details" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    return NextResponse.json(
      { error: "No account found with that email" },
      { status: 404 },
    );
  }

  if (!bcrypt.compareSync(parsed.data.password, user.passwordHash)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const response = NextResponse.json({ id: user.id });
  response.cookies.set(SESSION_COOKIE, signSession(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return response;
}
