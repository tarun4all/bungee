import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { isAdminRequest } from "@/lib/adminAuth";
import { getFirebaseDb } from "@/lib/firebaseAdmin";

function denied(request) {
  return !isAdminRequest(request)
    ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    : null;
}

function cleanBanner(input) {
  return {
    image_url: String(input.image_url || "").trim(),
    alt: String(input.alt || "").trim(),
    link_url: String(input.link_url || "").trim(),
    order: Number(input.order) || 0,
    is_active: input.is_active !== false,
  };
}

function serialize(document) {
  const data = document.data();
  return {
    id: document.id, ...data,
    created_at: data.created_at?.toDate?.().toISOString() || null,
    updated_at: data.updated_at?.toDate?.().toISOString() || null,
  };
}

export async function GET(request) {
  const unauthorized = denied(request); if (unauthorized) return unauthorized;
  try {
    const snapshot = await getFirebaseDb().collection("banners").orderBy("order").get();
    return NextResponse.json({ banners: snapshot.docs.map(serialize) });
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function POST(request) {
  const unauthorized = denied(request); if (unauthorized) return unauthorized;
  const banner = cleanBanner(await request.json());
  if (!banner.image_url || !banner.alt) {
    return NextResponse.json({ error: "Banner image and alt text are required" }, { status: 400 });
  }
  try {
    const reference = await getFirebaseDb().collection("banners").add({ ...banner, created_at: FieldValue.serverTimestamp(), updated_at: FieldValue.serverTimestamp() });
    return NextResponse.json({ banner: serialize(await reference.get()) }, { status: 201 });
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 400 }); }
}

export async function PUT(request) {
  const unauthorized = denied(request); if (unauthorized) return unauthorized;
  const input = await request.json();
  if (!input.id) return NextResponse.json({ error: "Banner id is required" }, { status: 400 });
  const banner = cleanBanner(input);
  if (!banner.image_url || !banner.alt) return NextResponse.json({ error: "Banner image and alt text are required" }, { status: 400 });
  try {
    const reference = getFirebaseDb().collection("banners").doc(String(input.id));
    await reference.update({ ...banner, updated_at: FieldValue.serverTimestamp() });
    return NextResponse.json({ banner: serialize(await reference.get()) });
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 400 }); }
}

export async function DELETE(request) {
  const unauthorized = denied(request); if (unauthorized) return unauthorized;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Banner id is required" }, { status: 400 });
  try { await getFirebaseDb().collection("banners").doc(id).delete(); return NextResponse.json({ ok: true }); }
  catch (error) { return NextResponse.json({ error: error.message }, { status: 400 }); }
}
