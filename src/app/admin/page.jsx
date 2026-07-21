"use client";

import { useCallback, useEffect, useState } from "react";
import AdminBannerManager from "@/components/AdminBannerManager";

const EMPTY = { name: "", code: "", price: "", description: "", spec: "", category: "", sub_category: "", img1: "", img2: "", is_active: true, is_featured: false };

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(null);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const loadProducts = useCallback(async () => {
    const response = await fetch("/api/admin/products");
    if (response.status === 401) { setAuthenticated(false); return; }
    const json = await response.json();
    setProducts(json.products || []);
    setAuthenticated(true);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => loadProducts(), 0);
    return () => window.clearTimeout(timer);
  }, [loadProducts]);

  async function login(event) {
    event.preventDefault(); setBusy(true); setMessage("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const json = await response.json(); setBusy(false);
    if (!response.ok) return setMessage(json.error);
    setPassword(""); await loadProducts();
  }

  async function save(event) {
    event.preventDefault(); setBusy(true); setMessage("");
    const response = await fetch("/api/admin/products", { method: form.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const json = await response.json(); setBusy(false);
    if (!response.ok) return setMessage(json.error);
    setMessage(form.id ? "Product updated." : "Product created."); setForm(EMPTY); await loadProducts();
  }

  async function remove(product) {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return;
    const response = await fetch(`/api/admin/products?id=${encodeURIComponent(product.id)}`, { method: "DELETE" });
    const json = await response.json();
    if (!response.ok) return setMessage(json.error);
    setMessage("Product deleted."); if (form.id === product.id) setForm(EMPTY); await loadProducts();
  }

  async function upload(event, field) {
    const file = event.target.files?.[0]; if (!file) return;
    setBusy(true); setMessage("Uploading image…");
    const data = new FormData(); data.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body: data });
    const json = await response.json(); setBusy(false);
    if (!response.ok) return setMessage(json.error);
    setForm((current) => ({ ...current, [field]: json.url })); setMessage("Image uploaded.");
  }

  if (authenticated === null) return <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Loading dashboard…</main>;
  if (!authenticated) return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4"><form onSubmit={login} className="w-full max-w-sm rounded-3xl bg-white p-8 text-slate-950"><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Bungees</p><h1 className="mt-2 text-2xl font-bold">Admin dashboard</h1><label htmlFor="password" className="mt-6 block text-xs font-semibold">Admin password</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-2 w-full rounded-xl border px-4 py-3"/><button disabled={busy} className="mt-4 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">Sign in</button>{message && <p role="alert" className="mt-3 text-sm text-red-600">{message}</p>}</form></main>;

  const fields = [
    ["name", "Product name", true], ["code", "Product code", true], ["price", "Price (₹)", true],
    ["category", "Category"], ["sub_category", "Subcategory"], ["description", "Description"], ["spec", "Specifications (comma separated)"],
  ];

  return <main className="min-h-screen bg-slate-100 text-slate-950">
    <header className="border-b bg-slate-950 text-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4"><div><p className="font-bold">Bungees Admin</p><p className="text-xs text-slate-400">Catalogue and homepage</p></div><div className="flex gap-2"><a href="/api/admin/backup" download className="rounded-full border border-slate-700 px-4 py-2 text-xs">Download JSON backup</a><button onClick={async () => { await fetch('/api/admin/logout',{method:'POST'}); setAuthenticated(false); }} className="rounded-full border border-slate-700 px-4 py-2 text-xs">Sign out</button></div></div></header>
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[420px_1fr]">
      <section className="h-fit rounded-2xl bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h1 className="text-xl font-bold">{form.id ? "Edit product" : "Add product"}</h1>{form.id && <button onClick={() => setForm(EMPTY)} className="text-xs underline">Cancel</button>}</div>
        <form onSubmit={save} className="mt-5 space-y-4">{fields.map(([name,label,required]) => <label key={name} className="block text-xs font-semibold">{label}<input name={name} type={name === 'price' ? 'number' : 'text'} step={name === 'price' ? '0.01' : undefined} required={required} value={form[name]} onChange={(e) => setForm({...form,[name]:e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-normal"/></label>)}
          {["img1","img2"].map((field,index) => <div key={field}><label className="block text-xs font-semibold">Product image {index + 1}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => upload(event,field)} className="mt-1.5 block w-full text-xs"/></label>{form[field] && <div className="mt-2 flex items-center gap-3"><img src={form[field]} alt={`Product preview ${index + 1}`} className="h-16 w-16 rounded-lg object-cover"/><button type="button" onClick={() => setForm({...form,[field]:""})} className="text-xs text-red-600">Remove</button></div>}</div>)}
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold"><input type="checkbox" checked={form.is_active} onChange={(event) => setForm({...form,is_active:event.target.checked})}/> Published</label>
            <label className="flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold"><input type="checkbox" checked={form.is_featured} onChange={(event) => setForm({...form,is_featured:event.target.checked})}/> Featured</label>
          </div>
          <button disabled={busy} className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold disabled:opacity-50">{busy ? "Please wait…" : form.id ? "Save changes" : "Create product"}</button>{message && <p role="status" className="text-sm text-slate-600">{message}</p>}
        </form>
      </section>
      <section><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Products</h2><span className="rounded-full bg-white px-3 py-1 text-xs">{products.length} total</span></div><div className="space-y-3">{products.map((product) => <article key={product.id} className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center"><div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">{product.img1 && <img src={product.img1} alt={`${product.name} thumbnail`} className="h-full w-full object-cover"/>}</div><div className="min-w-0 flex-1"><h3 className="font-semibold">{product.name}</h3><p className="text-xs text-slate-500">{product.code} · ₹{Number(product.price).toLocaleString('en-IN')}</p></div><div className="flex gap-2"><button onClick={() => { setForm({...EMPTY,...product,price:String(product.price ?? '')}); window.scrollTo({top:0,behavior:'smooth'}); }} className="rounded-full border px-4 py-2 text-xs font-semibold">Edit</button><button onClick={() => remove(product)} className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600">Delete</button></div></article>)}{!products.length && <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">No products yet.</div>}</div></section>
      <AdminBannerManager />
    </div>
  </main>;
}
