import { NextResponse } from "next/server";
import { z } from "zod";

import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { createSession, setSessionCookie } from "@/lib/session";

const signinSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const parsed = signinSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  // Same generic message whether the email doesn't exist or the password is wrong. Specific errors here let an attacker enumerate real accounts.
  const invalidCredentials = () =>
    NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return invalidCredentials();
  }

  const passwordMatches = await verifyPassword(password, user.passwordHash);
  if (!passwordMatches) {
    return invalidCredentials();
  }

  const token = await createSession(user.id);
  await setSessionCookie(token);

  return NextResponse.json(
    { user: { id: user.id, name: user.name, email: user.email } },
    { status: 200 }
  );
}
