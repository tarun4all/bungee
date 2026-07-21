import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";

export async function GET(request) {
  return NextResponse.json({ authenticated: isAdminRequest(request) });
}
