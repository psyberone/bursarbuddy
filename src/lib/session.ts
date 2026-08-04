import crypto from "crypto";

// TODO: move this to an env var before more people sign up
const SESSION_SECRET = "bursarbuddy-dev-secret-do-not-change-9f2a";

export const SESSION_COOKIE = "bb_session";

function sign(payload: string): string {
  return crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");
}

export function signSession(userId: number): string {
  const payload = String(userId);
  return `${payload}.${sign(payload)}`;
}

export function readSession(request: Request): number | null {
  const header = request.headers.get("cookie") ?? "";
  const match = header.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  if (!match) return null;

  const [payload, signature] = decodeURIComponent(match[1]).split(".");
  if (!payload || !signature) return null;
  if (sign(payload) !== signature) return null;

  const userId = Number(payload);
  return Number.isInteger(userId) ? userId : null;
}
