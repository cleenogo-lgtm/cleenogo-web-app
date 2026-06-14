import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { SiteContent } from "./site-content";

const OWNER_EMAIL = "cleenogo@gmail.com";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function b64url(buf: Buffer | string) {
  return Buffer.from(buf).toString("base64url");
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function makeToken(secret: string) {
  const payload = JSON.stringify({
    sub: OWNER_EMAIL,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  });
  const p = b64url(payload);
  return `${p}.${sign(p, secret)}`;
}

function verifyToken(token: string, secret: string): boolean {
  const [p, sig] = token.split(".");
  if (!p || !sig) return false;
  const expected = sign(p, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(p, "base64url").toString("utf8"));
    if (data.sub !== OWNER_EMAIL) return false;
    if (typeof data.exp !== "number" || data.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

export const loginOwner = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; password: string }) =>
    z.object({
      email: z.string().email().max(255),
      password: z.string().min(1).max(200),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const expectedPassword = process.env.OWNER_PASSWORD;
    const secret = process.env.OWNER_SESSION_SECRET;
    if (!expectedPassword || !secret) {
      throw new Error("Owner auth not configured");
    }
    // Brief delay to slow brute-force attempts
    await new Promise((r) => setTimeout(r, 250));

    const emailOk = data.email.trim().toLowerCase() === OWNER_EMAIL;
    const pwBuf = Buffer.from(data.password);
    const expBuf = Buffer.from(expectedPassword);
    const pwOk =
      pwBuf.length === expBuf.length && timingSafeEqual(pwBuf, expBuf);

    if (!emailOk || !pwOk) {
      throw new Error("بيانات الدخول غير صحيحة");
    }
    return { token: makeToken(secret), email: OWNER_EMAIL };
  });

export const verifyOwnerToken = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string }) =>
    z.object({ token: z.string().min(1).max(2000) }).parse(d),
  )
  .handler(async ({ data }) => {
    const secret = process.env.OWNER_SESSION_SECRET;
    if (!secret) return { valid: false as const };
    return { valid: verifyToken(data.token, secret) };
  });

export const saveSiteContent = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string; content: SiteContent }) => {
    // light shape check; full validation by trust via signed token
    if (!d || typeof d.token !== "string" || typeof d.content !== "object") {
      throw new Error("Invalid payload");
    }
    if (d.token.length > 2000) throw new Error("Invalid token");
    if (JSON.stringify(d.content).length > 200_000) throw new Error("Content too large");
    return d;
  })
  .handler(async ({ data }) => {
    const secret = process.env.OWNER_SESSION_SECRET;
    if (!secret || !verifyToken(data.token, secret)) {
      throw new Error("Unauthorized");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ id: 1, data: data.content as any });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
