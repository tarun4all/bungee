import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "../../data/products";

export default function ProductPage({ params }) {
  //   const { id } = params;
  //   const product = products.find((p) => p.id === id);

  //   if (!product) {
  //     notFound();
  //   }

  const product = { id: "1" };

  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

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
          {/* Image */}
          <div className="rounded-2xl border bg-white p-4 md:p-6 shadow-sm">
            <div className="overflow-hidden rounded-xl bg-slate-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-80 md:h-[360px] object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {product.category}
            </p>

            <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
              {product.name}
            </h1>

            <p className="text-sm md:text-[15px] text-slate-600">
              {product.description}
            </p>

            <div className="pt-2">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Price
              </p>
              <p className="mt-1 text-2xl font-bold">₹{product.price}</p>
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
                      src={item.image}
                      alt={item.name}
                      className="h-32 w-full object-cover group-hover:scale-[1.03] transition"
                    />
                  </div>
                  <h3 className="text-xs font-semibold line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="mt-2 text-sm font-semibold">₹{item.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
