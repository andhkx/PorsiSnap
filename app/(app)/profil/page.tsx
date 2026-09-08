"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { calcAll } from "@/lib/calculations";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import Card from "@/components/UI/Card";
import Link from "next/link";

export default function ProfilPage(){
  const [p,setP]=useState<any>(null); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [msg,setMsg]=useState("");
  const [form,setForm]=useState({nama:"",usia:20,gender:"pria",bb:60,tb:170,tujuan:"stabilkan"});
  useEffect(()=>{ (async()=>{
    const s=createClient(); const {data:{user}}=await s.auth.getUser(); if(!user){location.href="/login";return;}
    const {data,error}=await s.from("profiles").select("*").eq("id",user.id).single();
    if(error){ setMsg(error.message); setLoading(false); return; }
    if(data){ setP(data); setForm({nama:data.nama,usia:data.usia,gender:data.gender,bb:data.bb,tb:data.tb,tujuan:data.tujuan});}
    setLoading(false);
  })(); },[]);
  async function save(e:React.FormEvent){
    e.preventDefault(); setSaving(true); setMsg("");
    const s=createClient(); const {data:{user}}=await s.auth.getUser();
    const calc=calcAll(Number(form.bb),Number(form.tb),Number(form.usia),form.gender as any,form.tujuan as any);
    const {error}=await s.from("profiles").update({nama:form.nama,usia:Number(form.usia),gender:form.gender,bb:Number(form.bb),tb:Number(form.tb),tujuan:form.tujuan,bmi:calc.bmi,status_bmi:calc.status_bmi,bmr:calc.bmr,tdee:calc.tdee,target_kalori:calc.target_kalori}).eq("id",user!.id);
    if(error) setMsg(error.message); else { setMsg("Tersimpan ✓"); setTimeout(()=>location.reload(),600); }
    setSaving(false);
  }
  async function logout(){ const s=createClient(); await s.auth.signOut(); location.href="/login"; }
  if(loading) return <div className="mx-auto max-w-[480px] p-6 text-sm font-black">Memuat...</div>;
  if(!p) return <div className="mx-auto max-w-[480px] p-4"><Card>Tidak ada profil. {msg && <span className="text-xs">{msg}</span>}</Card></div>;
  return <div className="mx-auto max-w-[480px] md:max-w-3xl p-4 space-y-4">
    <div className="flex items-center justify-between gap-3">
      <h1 className="text-2xl font-black uppercase tracking-tight">Profil</h1>
      <button onClick={logout} className="rounded-[9999px] border-[3px] border-[#0f172a] bg-white px-4 py-2 text-xs font-black uppercase tracking-widest">Logout</button>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <Card className="!p-4 text-center rounded-[20px]"><div className="text-3xl font-black leading-none">{p.bmi}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest opacity-60">BMI • {p.status_bmi}</div></Card>
      <Card className="!p-4 text-center rounded-[20px] bg-[#FFBE0B]"><div className="text-3xl font-black leading-none">{p.bmr}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest">BMR</div></Card>
      <Card className="!p-4 text-center rounded-[20px] bg-[#2563eb] text-white"><div className="text-3xl font-black leading-none">{p.tdee}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest opacity-90">TDEE</div></Card>
      <Card className="!p-4 text-center rounded-[20px] bg-[#0f172a] text-white"><div className="text-3xl font-black leading-none">{p.target_kalori}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest opacity-70">Target kkal</div></Card>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <Card className="!p-4 text-center rounded-[20px] bg-[#0f172a] text-white border-[#0f172a]"><div className="text-2xl font-black">🔥 {p.current_streak||0}</div><div className="text-[10px] font-black uppercase tracking-widest opacity-70">Current Streak</div></Card>
      <Card className="!p-4 text-center rounded-[20px]"><div className="text-2xl font-black">🏆 {p.longest_streak||0}</div><div className="text-[10px] font-black uppercase tracking-widest opacity-60">Longest</div></Card>
    </div>
    <Card className="rounded-[24px]">
      <h2 className="text-sm font-black uppercase tracking-widest">Edit Profil</h2>
      <form onSubmit={save} className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className="text-[11px] font-black uppercase tracking-widest">Nama</label><Input value={form.nama} onChange={e=>setForm(s=>({...s,nama:e.target.value}))} required/></div>
        <div><label className="text-[11px] font-black uppercase tracking-widest">Usia</label><Input type="number" value={form.usia} onChange={e=>setForm(s=>({...s,usia:parseInt(e.target.value)||0}))} /></div>
        <div><label className="text-[11px] font-black uppercase tracking-widest">Gender</label><select className="w-full rounded-[16px] border-[3px] border-[#0f172a] bg-white px-4 py-3 text-sm font-black" value={form.gender} onChange={e=>setForm(s=>({...s,gender:e.target.value}))}><option value="pria">Pria</option><option value="wanita">Wanita</option></select></div>
        <div><label className="text-[11px] font-black uppercase tracking-widest">BB (kg)</label><Input type="number" step="0.1" value={form.bb} onChange={e=>setForm(s=>({...s,bb:parseFloat(e.target.value)||0}))}/></div>
        <div><label className="text-[11px] font-black uppercase tracking-widest">TB (cm)</label><Input type="number" value={form.tb} onChange={e=>setForm(s=>({...s,tb:parseInt(e.target.value)||0}))}/></div>
        <div className="sm:col-span-2"><label className="text-[11px] font-black uppercase tracking-widest">Tujuan</label><select className="w-full rounded-[16px] border-[3px] border-[#0f172a] bg-white px-4 py-3 text-sm font-black" value={form.tujuan} onChange={e=>setForm(s=>({...s,tujuan:e.target.value}))}><option value="turunkan">Turunkan</option><option value="stabilkan">Stabilkan</option><option value="naikkan">Naikkan</option></select></div>
        {msg && <div className="sm:col-span-2 rounded-[16px] bg-[#0f172a] text-white p-3 text-xs font-black">{msg}</div>}
        <div className="sm:col-span-2"><Button type="submit" size="lg" disabled={saving}>{saving?"Menyimpan...":"Simpan →"}</Button></div>
      </form>
    </Card>
    <Link href="/foto" className="block"><Button size="lg">Snap Foto →</Button></Link>
  </div>;
}
