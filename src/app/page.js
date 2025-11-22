"use client";

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full">
        {/* Glass Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-white/0 p-6 md:p-8 shadow-[0_18px_45px_rgba(0,0,0,0.6)]">
          {/* Soft gradient blob */}
          <div className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full bg-fuchsia-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-sky-500/30 blur-3xl" />

          {/* Brand */}
          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-lg font-bold">
              B
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight">
                bungee
              </span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                everyday essentials
              </span>
            </div>
          </div>

          {/* Text */}
          <div className="relative space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              coming soon
            </p>

            <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
              Bungee store is almost ready.
            </h1>

            <p className="text-sm md:text-[15px] text-slate-300">
              Curated basics, zero drama. We’re putting the final touches on
              your new favourite shopping experience.
            </p>

            {/* Fake countdown row */}
            <div className="mt-4 flex gap-3 text-center text-xs md:text-sm">
              {[
                { label: "Days", value: "07" },
                { label: "Hours", value: "12" },
                { label: "Minutes", value: "34" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-3 py-3"
                >
                  <div className="text-lg md:text-xl font-semibold">
                    {item.value}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Email capture */}
            <form
              className="mt-5 flex flex-col sm:flex-row gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter email to get notified"
                className="flex-1 rounded-full border border-white/15 bg-black/30 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-slate-200"
              />
              <button className="rounded-full bg-slate-50 px-5 py-2.5 text-xs font-semibold text-slate-900 hover:bg-white active:scale-[0.98]">
                Notify me
              </button>
            </form>

            {/* Tiny footer row */}
            <div className="mt-4 flex items-center justify-between gap-3 text-[11px] text-slate-400">
              <span>No spam. Just drop alerts when we go live.</span>
              <div className="flex items-center gap-2">
                <span className="opacity-70">Follow</span>
                <button className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center">
                  ✕
                </button>
                <button className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center">
                  𝕏
                </button>
                <button className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center">
                  ⓘ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom mini footer */}
        <div className="mt-5 flex items-center justify-between text-[11px] text-slate-500">
          <span>© {new Date().getFullYear()} bungee.</span>
          <span>Built while overthinking the homepage.</span>
        </div>
      </div>
    </main>
  );
}
