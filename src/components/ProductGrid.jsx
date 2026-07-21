"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function ProductGrid({ products, loading, pageSize = 8 }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [currentPage, pageSize, products]);

  if (loading) {
    return <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading products">
      {Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-2xl bg-slate-200" />)}
    </div>;
  }

  if (!products.length) {
    return <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <h3 className="font-semibold">No products found</h3>
      <p className="mt-1 text-sm text-slate-500">Try another product name, code, or category.</p>
    </div>;
  }

  return (
    <div className="mt-6">
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {pageItems.map((product) => (
          <article key={product.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <Link href={`/product/${product.id}`} className="block focus:outline-none focus:ring-2 focus:ring-slate-900" aria-label={`View ${product.name}`}>
              <div className="aspect-square overflow-hidden bg-slate-100">
                {product.img1 ? <img src={product.img1} alt={`${product.name} product image`} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-xs text-slate-400">Image coming soon</div>}
              </div>
              <div className="p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{product.sub_category || product.category || "Bungees"}</p>
                <h3 className="mt-1 min-h-10 text-sm font-semibold leading-5 text-slate-950">{product.name}</h3>
                {product.code && <p className="mt-1 text-xs text-slate-500">Code: {product.code}</p>}
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-base font-bold">₹{Number(product.price).toLocaleString("en-IN")}</p>
                  <span className="text-xs font-semibold">View details →</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
      {totalPages > 1 && <div className="mt-8 flex items-center justify-center gap-3 text-sm">
        <button onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="rounded-full border px-4 py-2 disabled:opacity-40">Previous</button>
        <span className="text-slate-500">{currentPage} / {totalPages}</span>
        <button onClick={() => setPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="rounded-full border px-4 py-2 disabled:opacity-40">Next</button>
      </div>}
    </div>
  );
}
