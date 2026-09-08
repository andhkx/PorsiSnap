"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import Card from "@/components/UI/Card";
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
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b-[3px] border-[#0f172a] bg-white px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-[12px] bg-[#2563eb] border-[3px] border-[#0f172a] flex items-center justify-center text-white font-black shadow-[3px_3px_0px_#0f172a]">P</div>
          <span className="font-black uppercase tracking-tight">PorsiSnap</span>
        </Link>
        <Link href="/register" className="rounded-[9999px] border-[3px] border-[#0f172a] bg-[#FFBE0B] px-4 py-2 text-xs font-black uppercase">Daftar</Link>
      </header>
      <div className="flex-1 flex items-start md:items-center justify-center p-4 pt-6">
        <Card className="w-full max-w-[420px] rounded-[24px]">
          <h1 className="text-2xl font-black uppercase tracking-tight">Masuk</h1>
          <p className="mt-1 text-sm font-bold opacity-60">Masuk untuk lanjut tracking kalori.</p>
          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            <div><label className="text-[11px] font-black uppercase tracking-widest">Email</label><Input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="kamu@email.com" /></div>
            <div><label className="text-[11px] font-black uppercase tracking-widest">Password</label><Input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" /></div>
            {err && <div className="rounded-[16px] bg-[#ff006e] text-white border-[3px] border-[#0f172a] p-3 text-xs font-black">{err}</div>}
            <Button type="submit" size="lg" disabled={loading}>{loading?"Memproses...":"Masuk →"}</Button>
          </form>
          <div className="mt-4 text-center text-xs font-black">Belum punya akun? <Link href="/register" className="underline decoration-[3px] underline-offset-4">Daftar</Link></div>
        </Card>
      </div>
    </div>
  );
}
