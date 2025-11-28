"use client";

import OfferSlider from "../components/OfferSlider";
import ProductGrid from "../components/ProductGrid";

import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) {
          throw new Error("Failed to load products");
        }
        const json = await res.json();
        setProducts(json.products || []);
      } catch (err) {
        console.error(err);
        setError("Could not load products. Try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  console.log({ products });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
              B
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight">bungee</span>
              <span className="text-[10px] uppercase tracking-wide text-slate-500">
                everyday essentials
              </span>
            </div>
          </div>

          {/* <div className="hidden sm:flex items-center gap-4 text-xs text-slate-600">
            <button className="hover:text-slate-900">New</button>
            <button className="hover:text-slate-900">Clothing</button>
            <button className="hover:text-slate-900">Accessories</button>
            <button className="hover:text-slate-900">Electronics</button>
          </div> */}

          <button className="flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium hover:bg-slate-50">
            <span>🛒</span>
            <span>Cart(Coming soon)</span>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white">
              0
            </span>
          </button>
        </div>
      </header>

      {/* Offer Slider */}
      <OfferSlider images={["/b1.png", "b2.png"]} />

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-lg md:text-xl font-semibold">
              Shop Bungee picks
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Curated everyday essentials. Clean, simple, and actually usable.
            </p>
          </div>
          <div className="flex gap-2 text-xs">
            {/* <button className="rounded-full border px-3 py-1.5 hover:bg-slate-50">
              All
            </button>
            <button className="rounded-full border px-3 py-1.5 hover:bg-slate-50">
              Clothing
            </button>
            <button className="rounded-full border px-3 py-1.5 hover:bg-slate-50">
              Accessories
            </button>
            <button className="rounded-full border px-3 py-1.5 hover:bg-slate-50">
              Electronics
            </button> */}
          </div>
        </div>

        <ProductGrid products={products} pageSize={8} />
      </section>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} bungee. All rights reserved.</span>
          <span>Made for people who scroll more than they walk.</span>
        </div>
      </footer>
    </main>
  );
}
