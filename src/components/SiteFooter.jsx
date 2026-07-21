const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "";

export default function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2">
        <div>
          <p className="text-lg font-bold">bungees</p>
          <p className="mt-2 max-w-sm text-sm text-slate-400">Reliable everyday technology and accessories, selected for real-world use.</p>
        </div>
        <div className="sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Connect with us</p>
          <div className="mt-3 flex flex-wrap gap-2 sm:justify-end">
            <a href={whatsappNumber ? `https://wa.me/${whatsappNumber}` : "#contact"} className="rounded-full border border-slate-700 px-4 py-2 text-xs hover:border-white">WhatsApp</a>
            <a href={email ? `mailto:${email}` : "#contact"} className="rounded-full border border-slate-700 px-4 py-2 text-xs hover:border-white">Email</a>
            <a href={phone ? `tel:${phone}` : "#contact"} className="rounded-full border border-slate-700 px-4 py-2 text-xs hover:border-white">Call</a>
            <a href="#contact" aria-disabled="true" className="rounded-full border border-slate-800 px-4 py-2 text-xs text-slate-500">Instagram soon</a>
            <a href="#contact" aria-disabled="true" className="rounded-full border border-slate-800 px-4 py-2 text-xs text-slate-500">Facebook soon</a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-4 text-center text-[11px] text-slate-500">© {new Date().getFullYear()} Bungees. All rights reserved.</div>
    </footer>
  );
}
