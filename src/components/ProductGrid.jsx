"use client";

import { useMemo, useState } from "react";

export default function ProductGrid({ products, pageSize = 8 }) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [page, pageSize, products]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="mt-6">
      {/* Products */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {pageItems.map((product) => (
          <article
            key={product.id}
            className="flex flex-col rounded-xl border bg-white p-3 shadow-sm hover:shadow-md transition"
          >
            <div className="relative mb-3 overflow-hidden rounded-lg bg-slate-100">
              <img
                src={product.image}
                alt={product.name}
                className="h-40 w-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <h3 className="text-sm font-semibold line-clamp-2">
                {product.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                {product.description}
              </p>
              <p className="mt-2 text-sm font-bold">₹{product.price}</p>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 active:scale-[0.98]">
                  Add to cart
                </button>
                <button className="rounded-md border px-3 py-2 text-xs hover:bg-slate-50 active:scale-[0.98]">
                  View
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        <span className="text-slate-500">
          Page <span className="font-semibold">{page}</span> of{" "}
          <span className="font-semibold">{totalPages}</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            disabled={page === 1}
            className="rounded-md border px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-[0.98]"
          >
            Previous
          </button>
          <button
            onClick={goNext}
            disabled={page === totalPages}
            className="rounded-md border px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-[0.98]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
