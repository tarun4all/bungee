import { getFirebaseDb } from "@/lib/firebaseAdmin";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bungees.in";
  const entries = [{ url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
  try {
    const snapshot = await getFirebaseDb().collection("products").get();
    return entries.concat(snapshot.docs.filter((doc) => doc.data().is_active !== false).map((doc) => ({ url: `${baseUrl}/product/${doc.id}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 })));
  } catch { return entries; }
}
