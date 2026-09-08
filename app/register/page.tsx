"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { calcAll } from "@/lib/calculations";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import Card from "@/components/UI/Card";
import Link from "next/link";

export default function RegisterPage() {
  const r = useRouter();
  const [form, setForm] = useState({ email: "", password: "", nama: "", usia: 20, gender: "pria", bb: 60, tb: 170, tujuan: "stabilkan" as const });
  const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);
  const set = (k: string, v: any) => setForm(s => ({ ...s, [k]: v }));
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setLoading(true);
    const supabase = createClient();
    const calc = calcAll(Number(form.bb), Number(form.tb), Number(form.usia), form.gender as any, form.tujuan as any);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { nama: form.nama, usia: String(form.usia), gender: form.gender, bb: String(form.bb), tb: String(form.tb), tujuan: form.tujuan } }
      });
      if (error) throw new Error(error.message);
      if (!data.user) throw new Error("signUp tidak mengembalikan user — cek Supabase Auth logs");
      if (!data.session) {
        throw new Error("Akun dibuat tapi belum ada session (Confirm email masih aktif). Buka Supabase Dashboard rxhibmwhkjpfwirzvojt → Authentication → Configuration → Email → matikan Confirm email, atau cek inbox/spam untuk link verifikasi, lalu Login.");
      }
      const uid = data.user.id;
      const payload = { id: uid, nama: form.nama, usia: Number(form.usia), gender: form.gender, bb: Number(form.bb), tb: Number(form.tb), tujuan: form.tujuan, bmi: calc.bmi, status_bmi: calc.status_bmi, bmr: calc.bmr, tdee: calc.tdee, target_kalori: calc.target_kalori };
      const { error: upErr } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
      if (upErr) {
        const m = upErr.message.toLowerCase();
        if (m.includes("schema cache") || m.includes("could not find")) {
          throw new Error(`DB ${upErr.message} → Fix: 1) Pastikan .env.local NEXT_PUBLIC_SUPABASE_URL=https://rxhibmwhkjpfwirzvojt.supabase.co 2) Stop dev server (Ctrl+C) 3) rm -rf .next 4) npm run dev . Jika di Vercel, cek Environment Variables Vercel harus pakai rxhibm bukan zxgeg, lalu Redeploy.`);
        }
        throw new Error(upErr.message);
      }
      r.push("/profil");
    } catch (e: any) {
      setErr(String(e.message || e));
    }
    setLoading(false);
  }
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b-[3px] border-[#0f172a] bg-white px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-[12px] bg-[#2563eb] border-[3px] border-[#0f172a] flex items-center justify-center text-white font-black shadow-[3px_3px_0px_#0f172a]">P</div>
          <span className="font-black uppercase tracking-tight">PorsiSnap</span>
        </Link>
        <Link href="/login" className="rounded-[9999px] border-[3px] border-[#0f172a] bg-white px-4 py-2 text-xs font-black uppercase">Masuk</Link>
      </header>
      <div className="flex-1 flex justify-center p-4 pt-6 pb-[88px] md:pb-4">
        <Card className="w-full max-w-[560px] rounded-[24px]">
          <h1 className="text-2xl font-black uppercase tracking-tight">Daftar</h1>
          <p className="mt-1 text-sm font-bold opacity-60">Isi profil — BMI/BMR/TDEE hitung otomatis. Mobile-first.</p>
          <form onSubmit={onSubmit} className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className="text-[11px] font-black uppercase tracking-widest">Nama</label><Input required value={form.nama} onChange={e=>set("nama",e.target.value)} placeholder="Budi" /></div>
            <div className="sm:col-span-2"><label className="text-[11px] font-black uppercase tracking-widest">Email</label><Input type="email" required value={form.email} onChange={e=>set("email",e.target.value)} placeholder="kamu@email.com" /></div>
            <div className="sm:col-span-2"><label className="text-[11px] font-black uppercase tracking-widest">Password</label><Input type="password" required value={form.password} onChange={e=>set("password",e.target.value)} placeholder="••••••••" /></div>
            <div><label className="text-[11px] font-black uppercase tracking-widest">Usia</label><Input type="number" min={13} required value={form.usia} onChange={e=>set("usia",e.target.value)} /></div>
            <div><label className="text-[11px] font-black uppercase tracking-widest">Gender</label><select className="w-full border-[3px] border-[#0f172a] bg-white rounded-[16px] px-4 py-3 text-sm font-black" value={form.gender} onChange={e=>set("gender",e.target.value)}><option value="pria">Pria</option><option value="wanita">Wanita</option></select></div>
            <div><label className="text-[11px] font-black uppercase tracking-widest">BB (kg)</label><Input type="number" step="0.1" required value={form.bb} onChange={e=>set("bb",e.target.value)} /></div>
            <div><label className="text-[11px] font-black uppercase tracking-widest">TB (cm)</label><Input type="number" required value={form.tb} onChange={e=>set("tb",e.target.value)} /></div>
            <div className="sm:col-span-2"><label className="text-[11px] font-black uppercase tracking-widest">Tujuan</label><select className="w-full border-[3px] border-[#0f172a] bg-white rounded-[16px] px-4 py-3 text-sm font-black" value={form.tujuan} onChange={e=>set("tujuan",e.target.value)}><option value="turunkan">Turunkan</option><option value="stabilkan">Stabilkan</option><option value="naikkan">Naikkan</option></select></div>
            {err && <div className="sm:col-span-2 rounded-[16px] bg-[#ff006e] text-white border-[3px] border-[#0f172a] p-3 text-xs font-black whitespace-pre-wrap break-words">{err}</div>}
            <div className="sm:col-span-2"><Button type="submit" size="lg" disabled={loading}>{loading?"Memproses...":"Daftar →"}</Button></div>
          </form>
          <div className="mt-4 text-center text-xs font-black">Sudah punya akun? <Link href="/login" className="underline decoration-[3px] underline-offset-4">Masuk</Link></div>
        </Card>
      </div>
    </div>
  );
}
