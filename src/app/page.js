"use client";

import { useCallback, useEffect, useState } from "react";
import OfferSlider from "@/components/OfferSlider";
import ProductGrid from "@/components/ProductGrid";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([
    { image_url: "/b1.png", alt: "Bungees connectivity products" },
    { image_url: "/b2.png", alt: "Bungees product collection" },
  ]);

  const loadProducts = useCallback(async (query = "", selectedCategory = "") => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (selectedCategory) params.set("category", selectedCategory);
      const response = await fetch(`/api/products${params.size ? `?${params}` : ""}`);
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Could not load products");
      setProducts(json.products || []);
      setCategories(json.categories || []);
    } catch (requestError) {
      setError(requestError.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);
  useEffect(() => {
    fetch("/api/banners")
      .then((response) => response.json())
      .then((json) => { if (json.banners?.length) setBanners(json.banners); })
      .catch(() => {});
  }, []);

  function submitSearch(event) {
    event.preventDefault();
    loadProducts(search.trim(), category);
  }

  function changeCategory(event) {
    const value = event.target.value;
    setCategory(value);
    loadProducts(search.trim(), value);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 pt-8 md:pt-12">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-600">Built to connect</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">Everyday technology that simply works.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">Discover practical connectivity products and accessories backed by direct support from Bungees.</p>
          </div>
          <a href="#products" className="w-fit rounded-full bg-slate-950 px-6 py-3 text-xs font-semibold text-white">Explore products ↓</a>
        </div>
      </section>

      <OfferSlider images={banners} />

      <section id="products" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Product catalogue</p>
            <h2 className="mt-2 text-2xl font-bold">Find the right product</h2>
          </div>
          <form onSubmit={submitSearch} role="search" className="flex w-full max-w-2xl flex-col gap-2 sm:flex-row">
            <label htmlFor="category-filter" className="sr-only">Filter by category</label>
            <select id="category-filter" value={category} onChange={changeCategory} className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-950">
              <option value="">All categories</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <label htmlFor="product-search" className="sr-only">Search products</label>
            <input id="product-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, code or category" className="min-w-0 flex-1 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-950" />
            <button className="rounded-full bg-slate-950 px-5 py-2.5 text-xs font-semibold text-white">Search</button>
          </form>
        </div>
        {error && <div role="alert" className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><span>{error}</span><button onClick={() => loadProducts(search, category)} className="font-semibold underline">Retry</button></div>}
        <ProductGrid products={products} loading={loading} />
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Why Bungees</p><h2 className="mt-2 text-2xl font-bold">Helpful products. Human support.</h2></div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[['Practical by design','Products selected for dependable everyday use.'],['Clear specifications','The details you need to choose with confidence.'],['Direct assistance','Talk to us before ordering or whenever you need support.']].map(([title, copy]) => <div key={title} className="rounded-2xl border border-slate-200 p-6"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-orange-500 py-12 text-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 md:flex-row md:items-center md:justify-between">
          <div><h2 className="text-2xl font-bold">Need help choosing?</h2><p className="mt-1 text-sm">Contact our team on WhatsApp, email, or phone.</p></div>
          <a href="#contact" className="w-fit rounded-full bg-slate-950 px-6 py-3 text-xs font-semibold text-white">Contact Bungees</a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
