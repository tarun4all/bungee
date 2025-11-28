"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function ProductPage({ params }) {
  const { slug } = use(params);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [error, setError] = useState("");

  // Image slider index for current product
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`/api/products?id=${slug}`);
        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }

        const json = await res.json();
        if (!json.product) {
          throw new Error("Product not found");
        }

        setProduct(json.product);
        setImgIndex(0); // reset slider when product changes
      } catch (err) {
        console.error(err);
        setError("Product not found or something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  // Fetch related products (just top 4 from /api/products)
  useEffect(() => {
    if (!product) return;

    async function fetchRelated() {
      try {
        setRelatedLoading(true);
        const res = await fetch("/api/products");
        if (!res.ok) return;

        const json = await res.json();
        const all = json.products || [];

        // Filter out current product, take top 4
        const filtered = all.filter((p) => p.id !== product.id).slice(0, 4);

        console.log({ filtered, all });
        setRelated(all);
      } catch (err) {
        console.error("related error", err);
      } finally {
        setRelatedLoading(false);
      }
    }

    fetchRelated();
  }, [product]);

  // Loading skeleton
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <header className="border-b bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                B
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight">
                  bungee
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  everyday essentials
                </span>
              </div>
            </Link>
            <div className="h-7 w-24 rounded-full bg-slate-200 animate-pulse" />
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-4 py-6 md:py-10">
          <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] items-start">
            <div className="rounded-2xl border bg-white p-4 md:p-6 shadow-sm">
              <div className="h-80 md:h-[360px] w-full rounded-xl bg-slate-200 animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-6 w-40 rounded-full bg-slate-200 animate-pulse" />
              <div className="h-8 w-64 rounded bg-slate-200 animate-pulse" />
              <div className="h-16 w-full rounded bg-slate-200 animate-pulse" />
              <div className="h-8 w-32 rounded bg-slate-200 animate-pulse" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Error / not found
  if (error || !product) {
    return (
      <main className="min-h-screen bg-slate-50">
        <header className="border-b bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                B
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight">
                  bungee
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  everyday essentials
                </span>
              </div>
            </Link>

            <Link
              href="/"
              className="text-xs rounded-full border px-3 py-1.5 hover:bg-slate-50"
            >
              ← Back to shop
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="rounded-2xl border bg-white p-8 text-center">
            <h1 className="text-lg font-semibold mb-2">Product not found</h1>
            <p className="text-sm text-slate-500 mb-4">
              Either this product doesn’t exist or something went wrong.
            </p>
            <Link
              href="/"
              className="inline-flex items-center rounded-full border px-4 py-2 text-xs font-medium hover:bg-slate-50"
            >
              Go back to home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // Supabase fields
  const { name, price, spec, img1, img2, code, category, sub_category } =
    product;

  const displayCategory = sub_category || category || "Bungee product";
  const specList = spec ? spec.split(",") : [];
  const images = [img1, img1].filter(Boolean);

  const goPrevImg = () => {
    setImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goNextImg = () => {
    setImgIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              B
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                bungee
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                everyday essentials
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs rounded-full border px-3 py-1.5 hover:bg-slate-50"
          >
            ← Back to shop
          </Link>
        </div>
      </header>

      {/* Product section */}
      <section className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] items-start">
          {/* Images with slider */}
          <div className="rounded-2xl border bg-white p-4 md:p-6 shadow-sm">
            <div className="relative overflow-hidden rounded-xl bg-slate-100 h-80 md:h-[360px]">
              {images.length > 0 && (
                <div
                  className="flex h-full transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${imgIndex * 100}%)` }}
                >
                  {images.map((src, idx) => (
                    <div
                      key={idx}
                      className="min-w-full h-full flex items-center justify-center bg-slate-100"
                    >
                      <img
                        src={src}
                        alt={`${name} image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={goPrevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-xl active:scale-95"
                  >
                    ‹
                  </button>
                  <button
                    onClick={goNextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-xl active:scale-95"
                  >
                    ›
                  </button>

                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        className={`transition-all rounded-full ${
                          imgIndex === i
                            ? "w-6 h-2 bg-white"
                            : "w-2 h-2 bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {displayCategory}
            </p>

            <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
              {name}
            </h1>

            {code && (
              <p className="text-xs font-mono text-slate-500">
                Product code: <span className="font-semibold">{code}</span>
              </p>
            )}

            {specList.length > 0 && (
              <div className="text-sm md:text-[15px] text-slate-600">
                <h2 className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-1">
                  Specifications
                </h2>
                <ul className="list-disc pl-4 space-y-1">
                  {specList.map((line, idx) => (
                    <li key={idx}>{line.trim()}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Price
              </p>
              <p className="mt-1 text-2xl font-bold">₹{price}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button className="rounded-full bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 active:scale-[0.98]">
                Add to cart
              </button>
              <button className="rounded-full border px-5 py-2.5 text-xs font-medium hover:bg-slate-100 active:scale-[0.98]">
                Add to wishlist
              </button>
            </div>

            <div className="pt-4 border-t mt-4">
              <p className="text-xs text-slate-500">
                • Free shipping on orders above ₹999
                <br />• Easy 7-day returns. No overthinking required.
              </p>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              You might also like
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="group rounded-xl border bg-white p-3 shadow-sm hover:shadow-md transition flex flex-col"
                >
                  <div className="overflow-hidden rounded-lg bg-slate-100 mb-2">
                    <img
                      src={item.img1}
                      alt={item.name}
                      className="h-32 w-full object-cover group-hover:scale-[1.03] transition"
                    />
                  </div>
                  <h3 className="text-xs font-semibold line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                    {item.spec}
                  </p>
                  <p className="mt-2 text-sm font-semibold">₹{item.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* If no related but still loading, you can show nothing or a small skeleton */}
        {relatedLoading && related.length === 0 && (
          <div className="mt-10">
            <div className="h-5 w-40 bg-slate-200 rounded animate-pulse mb-3" />
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border bg-white p-3 shadow-sm"
                >
                  <div className="h-32 w-full bg-slate-200 rounded mb-2 animate-pulse" />
                  <div className="h-3 w-24 bg-slate-200 rounded mb-1 animate-pulse" />
                  <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
