"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function ProductPage({ params }) {
  const { slug } = use(params);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`/api/products?id=${encodeURIComponent(slug)}`);
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || "Product not found");
        setProduct(json.product);
        const relatedResponse = await fetch("/api/products");
        const relatedJson = await relatedResponse.json();
        setRelated((relatedJson.products || []).filter((item) => String(item.id) !== String(json.product.id)).slice(0, 4));
      } catch (requestError) { setError(requestError.message); }
      finally { setLoading(false); }
    }
    load();
  }, [slug]);

  if (loading) return <main className="min-h-screen bg-slate-50"><SiteHeader /><div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2"><div className="aspect-square animate-pulse rounded-3xl bg-slate-200"/><div className="h-80 animate-pulse rounded-3xl bg-slate-200"/></div></main>;
  if (error || !product) return <main className="min-h-screen bg-slate-50"><SiteHeader /><div className="mx-auto max-w-2xl px-4 py-24 text-center"><h1 className="text-2xl font-bold">Product not found</h1><p className="mt-2 text-sm text-slate-500">{error}</p><Link href="/" className="mt-6 inline-block rounded-full bg-slate-950 px-5 py-3 text-xs font-semibold text-white">Back to products</Link></div></main>;

  const images = [product.img1, product.img2].filter(Boolean);
  const specs = product.spec?.split(",").map((item) => item.trim()).filter(Boolean) || [];
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "";
  const message = encodeURIComponent(`Hello Bungees, I am interested in ${product.name}${product.code ? ` (${product.code})` : ""}. Please share more details.`);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <Link href="/#products" className="text-xs font-semibold text-slate-500 hover:text-slate-950">← All products</Link>
        <div className="mt-5 grid gap-8 md:grid-cols-2">
          <div>
            <div className="aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-white">
              {images.length ? <img src={images[imageIndex]} alt={`${product.name}${imageIndex ? " alternate view" : " product image"}`} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-slate-400">Image coming soon</div>}
            </div>
            {images.length > 1 && <div className="mt-3 flex gap-3">{images.map((image, index) => <button key={image} onClick={() => setImageIndex(index)} aria-label={`Show ${product.name} image ${index + 1}`} className={`h-16 w-16 overflow-hidden rounded-xl border-2 ${imageIndex === index ? "border-slate-950" : "border-transparent"}`}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}</div>}
          </div>
          <div className="md:pt-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">{product.sub_category || product.category || "Bungees product"}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{product.name}</h1>
            {product.code && <p className="mt-2 text-sm text-slate-500">Product code: <strong>{product.code}</strong></p>}
            {product.description && <p className="mt-6 leading-7 text-slate-600">{product.description}</p>}
            <p className="mt-6 text-3xl font-bold">₹{Number(product.price).toLocaleString("en-IN")}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${message}` : "#contact"} target={whatsappNumber ? "_blank" : undefined} rel="noreferrer" className="rounded-full bg-emerald-600 px-5 py-3 text-xs font-semibold text-white">WhatsApp enquiry</a>
              <a href={email ? `mailto:${email}?subject=${encodeURIComponent(`Enquiry: ${product.name}`)}&body=${message}` : "#contact"} className="rounded-full border border-slate-300 bg-white px-5 py-3 text-xs font-semibold">Email us</a>
              <a href={phone ? `tel:${phone}` : "#contact"} className="rounded-full border border-slate-300 bg-white px-5 py-3 text-xs font-semibold">Call to order</a>
            </div>
            {specs.length > 0 && <div className="mt-8 border-t border-slate-200 pt-6"><h2 className="font-semibold">Specifications</h2><ul className="mt-3 space-y-2 text-sm text-slate-600">{specs.map((spec) => <li key={spec} className="flex gap-2"><span aria-hidden="true">✓</span>{spec}</li>)}</ul></div>}
          </div>
        </div>
        {related.length > 0 && <section className="mt-16"><h2 className="text-xl font-bold">You may also like</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <Link key={item.id} href={`/product/${item.id}`} className="rounded-2xl border border-slate-200 bg-white p-3"><div className="aspect-square overflow-hidden rounded-xl bg-slate-100">{item.img1 && <img src={item.img1} alt={`${item.name} product image`} loading="lazy" className="h-full w-full object-cover" />}</div><h3 className="mt-3 text-sm font-semibold">{item.name}</h3><p className="mt-1 text-sm font-bold">₹{Number(item.price).toLocaleString("en-IN")}</p></Link>)}</div></section>}
      </section>
      <SiteFooter />
    </main>
  );
}
