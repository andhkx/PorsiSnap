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
  const [form, setForm] = useState({ email:"", password:"", nama:"", usia:20, gender:"pria", bb:60, tb:170, tujuan:"stabilkan" });
  const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);
  const set = (k:string,v:any)=>setForm(s=>({...s,[k]:v}));
  async function onSubmit(e:React.FormEvent){
    e.preventDefault(); setErr(""); setLoading(true);
    const supabase=createClient();
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if(error){ setErr(error.message); setLoading(false); return; }
    const uid = data.user?.id;
    if(!uid){ setErr("Gagal buat user"); setLoading(false); return; }
    const calc = calcAll(Number(form.bb), Number(form.tb), Number(form.usia), form.gender as any, form.tujuan as any);
    const { error: pErr } = await supabase.from("profiles").insert({
      id: uid, nama: form.nama, usia: Number(form.usia), gender: form.gender, bb: Number(form.bb), tb: Number(form.tb), tujuan: form.tujuan,
      bmi: calc.bmi, status_bmi: calc.status_bmi, bmr: calc.bmr, tdee: calc.tdee, target_kalori: calc.target_kalori
    });
    if(pErr){ setErr(pErr.message); setLoading(false); return; }
    r.push("/profil");
    setLoading(false);
  }
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <header className="bg-white border-b-[4px] border-black px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-black uppercase">PorsiSnap</Link>
        <Link href="/login" className="border-[3px] border-black px-3 py-1 font-black uppercase text-xs bg-white">Masuk</Link>
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-xl">
          <h1 className="font-black uppercase text-2xl">Daftar</h1>
          <p className="font-semibold text-sm">Isi profil — hitung BMI/BMR/TDEE otomatis.</p>
          <form onSubmit={onSubmit} className="mt-4 grid md:grid-cols-2 gap-3">
            <div className="md:col-span-2"><label className="font-black uppercase text-xs">Nama</label><Input required value={form.nama} onChange={e=>set("nama",e.target.value)} placeholder="Budi" /></div>
            <div className="md:col-span-2"><label className="font-black uppercase text-xs">Email</label><Input type="email" required value={form.email} onChange={e=>set("email",e.target.value)} placeholder="kamu@email.com" /></div>
            <div className="md:col-span-2"><label className="font-black uppercase text-xs">Password</label><Input type="password" required value={form.password} onChange={e=>set("password",e.target.value)} placeholder="••••••••" /></div>
            <div><label className="font-black uppercase text-xs">Usia</label><Input type="number" min={13} required value={form.usia} onChange={e=>set("usia",e.target.value)} /></div>
            <div><label className="font-black uppercase text-xs">Gender</label><select className="w-full border-[3px] border-black bg-white px-4 py-3 font-semibold text-sm" value={form.gender} onChange={e=>set("gender",e.target.value)}><option value="pria">Pria</option><option value="wanita">Wanita</option></select></div>
            <div><label className="font-black uppercase text-xs">BB (kg)</label><Input type="number" step="0.1" required value={form.bb} onChange={e=>set("bb",e.target.value)} /></div>
            <div><label className="font-black uppercase text-xs">TB (cm)</label><Input type="number" required value={form.tb} onChange={e=>set("tb",e.target.value)} /></div>
            <div className="md:col-span-2"><label className="font-black uppercase text-xs">Tujuan</label><select className="w-full border-[3px] border-black bg-white px-4 py-3 font-semibold text-sm" value={form.tujuan} onChange={e=>set("tujuan",e.target.value)}><option value="turunkan">Turunkan</option><option value="stabilkan">Stabilkan</option><option value="naikkan">Naikkan</option></select></div>
            {err && <div className="md:col-span-2 bg-[#FF006E] text-white border-[3px] border-black p-2 font-bold text-xs">{err}</div>}
            <div className="md:col-span-2"><Button type="submit" size="lg" disabled={loading}>{loading?"Memproses...":"Daftar →"}</Button></div>
          </form>
          <div className="mt-3 text-center font-bold text-xs">Sudah punya akun? <Link href="/login" className="underline">Masuk</Link></div>
        </Card>
      </div>
    </div>
  );
}
