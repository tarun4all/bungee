import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "bungee_admin";

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

export function createAdminToken() {
  if (!secret()) throw new Error("Admin authentication is not configured");
  return createHmac("sha256", secret()).update("bungee-admin-v1").digest("hex");
}

export function isValidAdminToken(value = "") {
  if (!value || !secret()) return false;
  const expected = createAdminToken();
  const received = Buffer.from(value);
  const target = Buffer.from(expected);
  return received.length === target.length && timingSafeEqual(received, target);
}

export function isAdminRequest(request) {
  return isValidAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
}
