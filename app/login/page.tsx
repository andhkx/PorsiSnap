"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
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
    <div className="min-h-dvh bg-[#f8fafc] flex flex-col">
      <header className="border-b-[2.5px] border-[#0f172a] bg-white px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[var(--primary)] border-2 border-[#0f172a] grid place-items-center text-white font-black shadow-[2px_2px_0px_#0f172a]">P</div>
          <span className="font-black uppercase tracking-tight text-sm">PorsiSnap</span>
        </Link>
        <Link href="/" className="neo-badge bg-[var(--neo-mint)] !py-1.5">Daftar</Link>
      </header>
      <div className="flex-1 grid place-items-center p-4">
        <div className="neo-card w-full max-w-[420px] p-6 md:p-7 bg-[var(--neo-lavender)]">
          <div className="neo-badge bg-white inline-block">Masuk</div>
          <h1 className="mt-3 text-2xl font-black leading-tight">Masuk untuk lanjut tracking</h1>
          <p className="mt-1 text-sm font-medium text-slate-700">Session tersimpan di cookie — tidak perlu login berulang di browser yang sama.</p>
          <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase tracking-wider">Email</span>
              <input className="neo-input" type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="kamu@email.com" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase tracking-wider">Password</span>
              <div className="relative">
                <input className="neo-input !pr-12" type={show ? "text" : "password"} required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
                <button type="button" aria-label={show ? "sembunyikan password" : "lihat password"} onClick={()=>setShow(s=>!s)} className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full border-2 border-[#0f172a] bg-white">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
            {err && <div role="alert" className="neo-card-soft bg-[var(--neo-coral)] p-3 text-xs font-black break-words">{err}</div>}
            <button type="submit" disabled={loading} className="neo-btn w-full bg-[var(--primary)] text-white !rounded-full min-h-[56px] text-base">{loading?"Memproses...":"Masuk →"}</button>
          </form>
          <p className="mt-4 text-center text-xs font-bold">Belum punya akun? <Link href="/" className="font-black underline decoration-2 underline-offset-4">Daftar di Beranda</Link></p>
        </div>
      </div>
    </div>
  );
}
