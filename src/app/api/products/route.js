import { NextResponse } from "next/server";
import { getFirebaseDb, serializeProduct } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const query = searchParams.get("q")?.trim().toLowerCase();
  const category = searchParams.get("category")?.trim().toLowerCase();

  try {
    const products = getFirebaseDb().collection("products");
    if (id) {
      const document = await products.doc(id).get();
      if (!document.exists || document.data()?.is_active === false) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ product: serializeProduct(document) });
    }

    const snapshot = await products.orderBy("name").get();
    let result = snapshot.docs
      .map(serializeProduct)
      .filter((product) => product.is_active !== false);

    if (query) {
      result = result.filter((product) =>
        [product.name, product.code, product.category, product.sub_category]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query))
      );
    }
    const categories = [...new Set(
      snapshot.docs
        .map(serializeProduct)
        .filter((product) => product.is_active !== false)
        .map((product) => product.category?.trim())
        .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b));

    if (category) {
      result = result.filter(
        (product) => product.category?.trim().toLowerCase() === category
      );
    }
    return NextResponse.json({ products: result, categories });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { error: "Products are temporarily unavailable" },
      { status: 500 }
    );
  }
}
