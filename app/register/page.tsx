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
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: any) => setForm(s => ({ ...s, [k]: v }));
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setLoading(true);
    const s = createClient();
    const { data, error } = await s.auth.signUp({ email: form.email, password: form.password });
    if (error) { setErr(error.message); setLoading(false); return; }
    const uid = data.user?.id;
    if (!uid) { setErr("Gagal buat user — cek konfirmasi email di Supabase Auth settings."); setLoading(false); return; }
    const calc = calcAll(Number(form.bb), Number(form.tb), Number(form.usia), form.gender as any, form.tujuan as any);
    const { error: pErr } = await s.from("profiles").insert({
      id: uid, nama: form.nama, usia: Number(form.usia), gender: form.gender, bb: Number(form.bb), tb: Number(form.tb), tujuan: form.tujuan,
      bmi: calc.bmi, status_bmi: calc.status_bmi, bmr: calc.bmr, tdee: calc.tdee, target_kalori: calc.target_kalori,
    });
    if (pErr) { setErr(pErr.message + " (pastikan email konfirmasi nonaktif atau cek spam)"); setLoading(false); return; }
    r.push("/profil");
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
      <div className="flex-1 flex justify-center p-4 pt-6">
        <Card className="w-full max-w-[560px] rounded-[24px]">
          <h1 className="text-2xl font-black uppercase tracking-tight">Daftar</h1>
          <p className="mt-1 text-sm font-bold opacity-60">Isi profil — BMI/BMR/TDEE hitung otomatis.</p>
          <form onSubmit={onSubmit} className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className="text-[11px] font-black uppercase tracking-widest">Nama</label><Input required value={form.nama} onChange={e => set("nama", e.target.value)} placeholder="Budi" /></div>
            <div className="sm:col-span-2"><label className="text-[11px] font-black uppercase tracking-widest">Email</label><Input type="email" required value={form.email} onChange={e => set("email", e.target.value)} placeholder="kamu@email.com" /></div>
            <div className="sm:col-span-2"><label className="text-[11px] font-black uppercase tracking-widest">Password</label><Input type="password" required value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" /></div>
            <div><label className="text-[11px] font-black uppercase tracking-widest">Usia</label><Input type="number" min={13} required value={form.usia} onChange={e => set("usia", e.target.value)} /></div>
            <div><label className="text-[11px] font-black uppercase tracking-widest">Gender</label><select className="w-full border-[3px] border-[#0f172a] bg-white rounded-[16px] px-4 py-3 text-sm font-black" value={form.gender} onChange={e => set("gender", e.target.value)}><option value="pria">Pria</option><option value="wanita">Wanita</option></select></div>
            <div><label className="text-[11px] font-black uppercase tracking-widest">BB (kg)</label><Input type="number" step="0.1" required value={form.bb} onChange={e => set("bb", e.target.value)} /></div>
            <div><label className="text-[11px] font-black uppercase tracking-widest">TB (cm)</label><Input type="number" required value={form.tb} onChange={e => set("tb", e.target.value)} /></div>
            <div className="sm:col-span-2"><label className="text-[11px] font-black uppercase tracking-widest">Tujuan</label><select className="w-full border-[3px] border-[#0f172a] bg-white rounded-[16px] px-4 py-3 text-sm font-black" value={form.tujuan} onChange={e => set("tujuan", e.target.value)}><option value="turunkan">Turunkan</option><option value="stabilkan">Stabilkan</option><option value="naikkan">Naikkan</option></select></div>
            {err && <div className="sm:col-span-2 rounded-[16px] bg-[#ff006e] text-white border-[3px] border-[#0f172a] p-3 text-xs font-black">{err}</div>}
            <div className="sm:col-span-2"><Button type="submit" size="lg" disabled={loading}>{loading ? "Memproses..." : "Daftar →"}</Button></div>
          </form>
          <div className="mt-4 text-center text-xs font-black">Sudah punya akun? <Link href="/login" className="underline decoration-[3px] underline-offset-4">Masuk</Link></div>
        </Card>
      </div>
    </div>
  );
}
