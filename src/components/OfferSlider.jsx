"use client";

import { useEffect, useState } from "react";

export default function ImageSlider({
  images = [],
  autoSlide = true,
  interval = 4000,
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!autoSlide || images.length <= 1) return;

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(id);
  }, [images, autoSlide, interval]);

  if (!images || images.length === 0) return null;

  const goPrev = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  const goNext = () => setIndex((prev) => (prev + 1) % images.length);

  return (
    <section className="w-full select-none mt-4">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl h-[70vh] md:h-[75vh] lg:h-[80vh] shadow-xl">
          {/* Slide container */}
          <div
            className="flex transition-transform duration-700 ease-out h-full"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {images.map((item, i) => {
              const banner = typeof item === "string" ? { image_url: item } : item;
              const picture = (
                <img
                  src={banner.image_url}
                  alt={banner.alt || (i === 0 ? "Bungees connectivity products" : "Bungees product collection")}
                  className="w-full h-full object-cover"
                />
              );
              return (
              <div
                key={i}
                className="min-w-full h-full bg-slate-200 flex items-center justify-center"
              >
                {banner.link_url ? <a href={banner.link_url} className="block h-full w-full" aria-label={banner.alt || `View offer ${i + 1}`}>{picture}</a> : picture}
              </div>
            )})}
          </div>

          {/* Left Arrow */}
          <button
            onClick={goPrev}
            aria-label="Previous promotion"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-xl active:scale-95 transition"
          >
            ‹
          </button>

          {/* Right Arrow */}
          <button
            onClick={goNext}
            aria-label="Next promotion"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-xl active:scale-95 transition"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show promotion ${i + 1}`}
                className={`transition-all rounded-full ${
                  index === i ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
