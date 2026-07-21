"use client";

import { useCallback, useEffect, useState } from "react";

const EMPTY = { image_url: "", alt: "", link_url: "", order: 0, is_active: true };

export default function AdminBannerManager() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/banners");
    const json = await response.json();
    if (response.ok) setBanners(json.banners || []);
    else setMessage(json.error || "Could not load banners");
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true); setMessage("Uploading banner…");
    const data = new FormData();
    data.append("file", file); data.append("folder", "banners");
    const response = await fetch("/api/admin/upload", { method: "POST", body: data });
    const json = await response.json(); setBusy(false);
    if (!response.ok) return setMessage(json.error);
    setForm((current) => ({ ...current, image_url: json.url }));
    setMessage("Banner image uploaded.");
  }

  async function save(event) {
    event.preventDefault(); setBusy(true); setMessage("");
    const response = await fetch("/api/admin/banners", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await response.json(); setBusy(false);
    if (!response.ok) return setMessage(json.error);
    setForm(EMPTY); setMessage(form.id ? "Banner updated." : "Banner created."); await load();
  }

  async function remove(banner) {
    if (!window.confirm(`Delete banner “${banner.alt}”?`)) return;
    const response = await fetch(`/api/admin/banners?id=${encodeURIComponent(banner.id)}`, { method: "DELETE" });
    const json = await response.json();
    if (!response.ok) return setMessage(json.error);
    if (form.id === banner.id) setForm(EMPTY);
    setMessage("Banner deleted."); await load();
  }

  return <section className="mt-10 border-t border-slate-300 pt-10 lg:col-span-2">
    <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Homepage</p><h2 className="mt-1 text-2xl font-bold">Offer banners</h2><p className="mt-1 text-sm text-slate-500">Manage carousel images, order, links, and visibility.</p></div>
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <form onSubmit={save} className="h-fit space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between"><h3 className="font-bold">{form.id ? "Edit banner" : "Add banner"}</h3>{form.id && <button type="button" onClick={() => setForm(EMPTY)} className="text-xs underline">Cancel</button>}</div>
        <label className="block text-xs font-semibold">Banner image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} className="mt-2 block w-full text-xs"/></label>
        {form.image_url && <img src={form.image_url} alt="Banner preview" className="aspect-[16/7] w-full rounded-xl object-cover"/>}
        <label className="block text-xs font-semibold">Alt text<input required value={form.alt} onChange={(event) => setForm({...form,alt:event.target.value})} placeholder="Describe the offer image" className="mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm font-normal"/></label>
        <label className="block text-xs font-semibold">Optional destination link<input value={form.link_url} onChange={(event) => setForm({...form,link_url:event.target.value})} placeholder="https://... or /product/..." className="mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm font-normal"/></label>
        <label className="block text-xs font-semibold">Display order<input type="number" value={form.order} onChange={(event) => setForm({...form,order:event.target.value})} className="mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm font-normal"/></label>
        <label className="flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold"><input type="checkbox" checked={form.is_active} onChange={(event) => setForm({...form,is_active:event.target.checked})}/> Published</label>
        <button disabled={busy || !form.image_url} className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white disabled:opacity-40">{busy ? "Please wait…" : form.id ? "Save banner" : "Create banner"}</button>
        {message && <p role="status" className="text-sm text-slate-600">{message}</p>}
      </form>
      <div className="space-y-3">{banners.map((banner) => <article key={banner.id} className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center"><img src={banner.image_url} alt={banner.alt} className="h-24 w-40 rounded-xl object-cover"/><div className="min-w-0 flex-1"><h3 className="font-semibold">{banner.alt}</h3><p className="mt-1 truncate text-xs text-slate-500">Order {banner.order} · {banner.is_active ? "Published" : "Draft"}{banner.link_url ? ` · ${banner.link_url}` : ""}</p></div><div className="flex gap-2"><button onClick={() => { setForm({...EMPTY,...banner}); window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'}); }} className="rounded-full border px-4 py-2 text-xs font-semibold">Edit</button><button onClick={() => remove(banner)} className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600">Delete</button></div></article>)}{!banners.length && <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">No managed banners yet. The homepage will use its default images.</div>}</div>
    </div>
  </section>;
}
