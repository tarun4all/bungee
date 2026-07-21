import { NextResponse } from "next/server";
import { getFirebaseDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await getFirebaseDb().collection("banners").orderBy("order").get();
    const banners = snapshot.docs
      .map((document) => ({ id: document.id, ...document.data() }))
      .filter((banner) => banner.is_active !== false && banner.image_url);
    return NextResponse.json({ banners });
  } catch (error) {
    console.error("Banners API error:", error);
    return NextResponse.json({ banners: [] });
  }
}
