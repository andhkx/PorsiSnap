"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setLoading(true);
    const s = createClient();
    const { error } = await s.auth.signInWithPassword({ email, password });
    if (error) setErr(error.message);
    else r.push("/profil");
    setLoading(false);
  }
  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <header className="border-b-[2.5px] border-[#0f172a] bg-white px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[var(--primary)] border-2 border-[#0f172a] grid place-items-center text-white font-black shadow-[2px_2px_0px_#0f172a]">P</div>
          <span className="font-black uppercase tracking-tight text-sm">PorsiSnap</span>
        </Link>
        <Link href="/register" className="neo-badge bg-[var(--neo-mint)] !py-1.5">Daftar</Link>
      </header>
      <div className="flex-1 grid place-items-center p-4">
        <div className="neo-card w-full max-w-[420px] p-6 md:p-7 bg-white">
          <div className="neo-badge bg-[var(--neo-lavender)] inline-block">Masuk</div>
          <h1 className="mt-3 text-2xl font-black leading-tight">Masuk untuk lanjut tracking</h1>
          <p className="mt-1 text-sm font-medium text-slate-600">HitCal flow — auth Supabase, redirect ke Profil.</p>
          <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase tracking-wider">Email</span>
              <input className="neo-input" type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="kamu@email.com" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase tracking-wider">Password</span>
              <input className="neo-input" type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
            </label>
            {err && <div role="alert" className="neo-card-soft bg-[var(--neo-coral)] p-3 text-xs font-black">{err}</div>}
            <button type="submit" disabled={loading} className="neo-btn w-full bg-[var(--primary)] text-white !rounded-full min-h-[56px] text-base">{loading?"Memproses...":"Masuk →"}</button>
          </form>
          <p className="mt-4 text-center text-xs font-bold">Belum punya akun? <Link href="/register" className="font-black underline decoration-2 underline-offset-4">Daftar</Link></p>
        </div>
      </div>
    </div>
  );
}
