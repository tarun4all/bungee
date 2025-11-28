import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    // 🔍 If `id` is present → return single product
    if (id) {
      const { data, error } = await supabaseAdmin
        .from("products")
        .select("*")
        .eq("id", id)
        .limit(1)
        .single(); // expects exactly one row

      if (error || !data) {
        console.error("Supabase product by id error:", error);
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ product: data });
    }

    // 🧾 No `id` → return all products
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    return NextResponse.json({ products: data ?? [] });
  } catch (err) {
    console.error("API /products error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
