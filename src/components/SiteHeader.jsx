import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2" aria-label="Bungees home">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">B</span>
          <span className="flex flex-col">
            <span className="text-base font-bold tracking-tight">bungees</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500">everyday essentials</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-xs font-medium text-slate-600" aria-label="Main navigation">
          <Link href="/#products" className="hover:text-slate-950">Products</Link>
          <Link href="/#contact" className="hover:text-slate-950">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
