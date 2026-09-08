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
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErr(error.message);
    else r.push("/profil");
    setLoading(false);
  }
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <header className="bg-white border-b-[4px] border-black px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-black uppercase">PorsiSnap</Link>
        <Link href="/register" className="border-[3px] border-black px-3 py-1 font-black uppercase text-xs bg-[#FFBE0B]">Daftar</Link>
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <h1 className="font-black uppercase text-2xl">Masuk</h1>
          <p className="font-semibold text-sm mt-1">Masuk untuk lanjut tracking kalori.</p>
          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <div><label className="font-black uppercase text-xs">Email</label><Input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="kamu@email.com" /></div>
            <div><label className="font-black uppercase text-xs">Password</label><Input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" /></div>
            {err && <div className="bg-[#FF006E] text-white border-[3px] border-black p-2 font-bold text-xs">{err}</div>}
            <Button type="submit" size="lg" disabled={loading}>{loading?"Memproses...":"Masuk →"}</Button>
          </form>
          <div className="mt-3 text-center font-bold text-xs">Belum punya akun? <Link href="/register" className="underline">Daftar</Link></div>
        </Card>
      </div>
    </div>
  );
}
