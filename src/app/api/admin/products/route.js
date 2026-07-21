import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { isAdminRequest } from "@/lib/adminAuth";
import { getFirebaseDb, serializeProduct } from "@/lib/firebaseAdmin";

const FIELDS = [
  "name", "code", "price", "description", "spec", "category",
  "sub_category", "img1", "img2", "is_active", "is_featured",
];

function cleanProduct(input) {
  return Object.fromEntries(FIELDS.filter((field) => input[field] !== undefined).map((field) => {
    if (field === "price") return [field, Number(input[field])];
    if (field === "is_active" || field === "is_featured") return [field, Boolean(input[field])];
    return [field, String(input[field] ?? "").trim()];
  }));
}

function denied(request) {
  return !isAdminRequest(request)
    ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    : null;
}

export async function GET(request) {
  const unauthorized = denied(request); if (unauthorized) return unauthorized;
  try {
    const snapshot = await getFirebaseDb().collection("products").orderBy("name").get();
    return NextResponse.json({ products: snapshot.docs.map(serializeProduct) });
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function POST(request) {
  const unauthorized = denied(request); if (unauthorized) return unauthorized;
  const product = cleanProduct(await request.json());
  if (!product.name || !product.code || !Number.isFinite(product.price)) {
    return NextResponse.json({ error: "Name, code and a valid price are required" }, { status: 400 });
  }
  try {
    const existing = await getFirebaseDb().collection("products").where("code", "==", product.code).limit(1).get();
    if (!existing.empty) return NextResponse.json({ error: "Product code already exists" }, { status: 409 });
    const reference = await getFirebaseDb().collection("products").add({
      ...product,
      is_active: product.is_active ?? true,
      is_featured: product.is_featured ?? false,
      created_at: FieldValue.serverTimestamp(), updated_at: FieldValue.serverTimestamp(),
    });
    const document = await reference.get();
    return NextResponse.json({ product: serializeProduct(document) }, { status: 201 });
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 400 }); }
}

export async function PUT(request) {
  const unauthorized = denied(request); if (unauthorized) return unauthorized;
  const input = await request.json();
  if (!input.id) return NextResponse.json({ error: "Product id is required" }, { status: 400 });
  try {
    const reference = getFirebaseDb().collection("products").doc(String(input.id));
    await reference.update({ ...cleanProduct(input), updated_at: FieldValue.serverTimestamp() });
    return NextResponse.json({ product: serializeProduct(await reference.get()) });
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 400 }); }
}

export async function DELETE(request) {
  const unauthorized = denied(request); if (unauthorized) return unauthorized;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Product id is required" }, { status: 400 });
  try { await getFirebaseDb().collection("products").doc(id).delete(); return NextResponse.json({ ok: true }); }
  catch (error) { return NextResponse.json({ error: error.message }, { status: 400 }); }
}
