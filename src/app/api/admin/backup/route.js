import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { getFirebaseDb, serializeProduct } from "@/lib/firebaseAdmin";

export async function GET(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await getFirebaseDb().collection("products").orderBy("name").get();
    const backup = {
      version: 1,
      exported_at: new Date().toISOString(),
      product_count: snapshot.size,
      products: snapshot.docs.map(serializeProduct),
    };
    const date = new Date().toISOString().slice(0, 10);
    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="bungees-products-${date}.json"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
