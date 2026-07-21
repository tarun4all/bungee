import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAdminRequest } from "@/lib/adminAuth";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

function safeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const folder = form.get("folder") === "banners" ? "banners" : "products";
  if (!(file instanceof File) || !ALLOWED.has(file.type) || file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Upload a JPG, PNG or WebP image smaller than 4 MB" },
      { status: 400 }
    );
  }

  try {
    const blob = await put(`${folder}/${safeName(file.name) || "image"}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    return NextResponse.json({ url: blob.url, pathname: blob.pathname });
  } catch (error) {
    console.error("Vercel Blob upload error:", error);
    return NextResponse.json(
      { error: "Image upload failed. Check the BLOB_READ_WRITE_TOKEN configuration." },
      { status: 500 }
    );
  }
}
