"use client";

import { useEffect, useState } from "react";

export default function OfferSlider({
  offers,
  autoSlide = true,
  interval = 5000,
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!autoSlide || offers.length <= 1) return;

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % offers.length);
    }, interval);

    return () => clearInterval(id);
  }, [offers, autoSlide, interval]);

  if (!offers || offers.length === 0) return null;

  const current = offers[index];

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const goNext = () => {
    setIndex((prev) => (prev + 1) % offers.length);
  };

  return (
    <section className="w-full bg-transparent mt-4">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
                {current.tag}
              </p>
              <h2 className="mt-2 text-2xl md:text-3xl font-bold leading-tight">
                {current.title}
              </h2>
              <p className="mt-2 text-sm md:text-base opacity-90">
                {current.subtitle}
              </p>
              {current.badge && (
                <span className="inline-flex mt-4 items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                  {current.badge}
                </span>
              )}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button className="rounded-full bg-white px-4 py-2 text-xs md:text-sm font-semibold text-slate-900 hover:bg-slate-100 active:scale-[0.98] transition">
                  Shop now
                </button>
                <button className="rounded-full border border-white/40 px-4 py-2 text-xs md:text-sm font-medium hover:bg-white/10 active:scale-[0.98] transition">
                  View all offers
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center md:justify-end">
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-2xl border border-white/40 bg-white/20 backdrop-blur flex flex-col items-center justify-center text-center text-xs md:text-sm font-medium">
                <span className="text-3xl md:text-4xl font-bold">
                  {index + 1}
                  <span className="text-base md:text-lg">/{offers.length}</span>
                </span>
                <span className="mt-1 opacity-80">Active Offer</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <button
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/25 p-2 text-sm md:text-base hover:bg-black/40 active:scale-95"
          >
            ‹
          </button>
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/25 p-2 text-sm md:text-base hover:bg-black/40 active:scale-95"
          >
            ›
          </button>

          {/* Dots */}
          <div className="mt-4 flex justify-center gap-2">
            {offers.map((offer, i) => (
              <button
                key={offer.id}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
