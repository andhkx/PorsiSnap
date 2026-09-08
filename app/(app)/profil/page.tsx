"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { calcAll } from "@/lib/calculations";
import Link from "next/link";

export default function ProfilPage(){
  const [p,setP]=useState<any>(null); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [msg,setMsg]=useState("");
  const [form,setForm]=useState({nama:"",usia:25,gender:"pria",bb:60,tb:165,tujuan:"stabilkan"});
  useEffect(()=>{(async()=>{
    const s=createClient(); const {data:{user}}=await s.auth.getUser(); if(!user){location.href="/login";return;}
    const {data,error}=await s.from("profiles").select("*").eq("id",user.id).single();
    if(error){ setMsg(error.message); setLoading(false); return; }
    if(data){ setP(data); setForm({nama:data.nama,usia:data.usia,gender:data.gender,bb:data.bb,tb:data.tb,tujuan:data.tujuan});}
    setLoading(false);
  })();},[]);
  async function save(e:React.FormEvent){
    e.preventDefault(); setSaving(true); setMsg("");
    const s=createClient(); const {data:{user}}=await s.auth.getUser();
    const calc=calcAll(Number(form.bb),Number(form.tb),Number(form.usia),form.gender as any,form.tujuan as any);
    const {error}=await s.from("profiles").update({nama:form.nama,usia:Number(form.usia),gender:form.gender,bb:Number(form.bb),tb:Number(form.tb),tujuan:form.tujuan,bmi:calc.bmi,status_bmi:calc.status_bmi,bmr:calc.bmr,tdee:calc.tdee,target_kalori:calc.target_kalori}).eq("id",user!.id);
    if(error) setMsg(error.message); else { setMsg("Tersimpan ✓"); setTimeout(()=>location.reload(),600); }
    setSaving(false);
  }
  async function logout(){ const s=createClient(); await s.auth.signOut(); location.href="/login"; }
  if(loading) return <div className="mx-auto max-w-5xl p-6 font-black">Memuat...</div>;
  if(!p) return <div className="mx-auto max-w-5xl p-4"><div className="neo-card p-6">Tidak ada profil. {msg}</div></div>;
  return <div className="mx-auto max-w-5xl p-4 pb-28 space-y-4">
    <div className="flex items-center justify-between gap-3">
      <div className="neo-badge bg-[var(--neo-lavender)]">Profil</div>
      <button onClick={logout} className="neo-badge bg-white !py-1.5">Logout</button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="neo-card p-4 text-center"><div className="text-[10px] font-black uppercase tracking-widest opacity-60">BMI</div><div className="text-3xl font-black leading-none mt-1">{p.bmi}</div><div className="text-[10px] font-black uppercase mt-1">{p.status_bmi}</div></div>
      <div className="neo-card p-4 text-center bg-[var(--neo-peach)]"><div className="text-[10px] font-black uppercase tracking-widest opacity-60">BMR</div><div className="text-3xl font-black leading-none mt-1">{p.bmr}</div><div className="text-[10px] font-black uppercase mt-1">kkal</div></div>
      <div className="neo-card p-4 text-center bg-[var(--neo-sky)]"><div className="text-[10px] font-black uppercase tracking-widest opacity-60">TDEE</div><div className="text-3xl font-black leading-none mt-1">{p.tdee}</div><div className="text-[10px] font-black uppercase mt-1">×1.55</div></div>
      <div className="neo-card p-4 text-center bg-[#0f172a] text-white"><div className="text-[10px] font-black uppercase tracking-widest opacity-70">Target</div><div className="text-3xl font-black leading-none mt-1">{p.target_kalori}</div><div className="text-[10px] font-black uppercase mt-1">kkal/hari</div></div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="neo-card p-4 text-center bg-[#0f172a] text-white"><div className="text-2xl font-black">🔥 {p.current_streak||0}</div><div className="text-[10px] font-black uppercase tracking-widest opacity-70">Current Streak</div></div>
      <div className="neo-card p-4 text-center"><div className="text-2xl font-black">🏆 {p.longest_streak||0}</div><div className="text-[10px] font-black uppercase tracking-widest opacity-60">Longest</div></div>
    </div>
    <div className="neo-card p-6 md:p-8 bg-white">
      <div className="neo-badge bg-[var(--neo-mint)] inline-block">Edit Profil</div>
      <h2 className="mt-3 text-xl font-black leading-tight">Perbarui datamu</h2>
      <form onSubmit={save} className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Nama</span><input className="neo-input" value={form.nama} onChange={e=>setForm(s=>({...s,nama:e.target.value}))} required/></label>
        <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Usia</span><input className="neo-input" type="number" value={form.usia} onChange={e=>setForm(s=>({...s,usia:parseInt(e.target.value)||0}))} /></label>
        <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Gender</span>
          <div className="flex gap-2">
            <button type="button" onClick={()=>setForm(s=>({...s,gender:"pria"}))} className={`neo-btn flex-1 !p-2 text-xs font-black ${form.gender==="pria"?"!bg-[var(--neo-lavender)]":"bg-white"}`}>Pria</button>
            <button type="button" onClick={()=>setForm(s=>({...s,gender:"wanita"}))} className={`neo-btn flex-1 !p-2 text-xs font-black ${form.gender==="wanita"?"!bg-[var(--neo-lavender)]":"bg-white"}`}>Wanita</button>
          </div>
        </label>
        <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">BB (kg)</span><input className="neo-input" type="number" step="0.1" value={form.bb} onChange={e=>setForm(s=>({...s,bb:parseFloat(e.target.value)||0}))}/></label>
        <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">TB (cm)</span><input className="neo-input" type="number" value={form.tb} onChange={e=>setForm(s=>({...s,tb:parseInt(e.target.value)||0}))}/></label>
        <label className="block sm:col-span-2"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Tujuan</span>
          <div className="grid grid-cols-3 gap-2">
            {(["stabilkan","turunkan","naikkan"] as const).map(v=>(
              <button key={v} type="button" onClick={()=>setForm(s=>({...s,tujuan:v}))} className={`neo-btn !py-2.5 text-xs font-black capitalize ${form.tujuan===v?"!bg-[#0f172a] !text-white":"bg-white"}`}>{v}</button>
            ))}
          </div>
        </label>
        {msg && <div className="sm:col-span-2 neo-card-soft bg-[#0f172a] text-white p-3 text-xs font-black">{msg}</div>}
        <div className="sm:col-span-2"><button type="submit" disabled={saving} className="neo-btn w-full bg-[var(--primary)] text-white !rounded-full min-h-[56px] text-base">{saving?"Menyimpan...":"Simpan →"}</button></div>
      </form>
    </div>
    <Link href="/foto" className="neo-btn flex w-full justify-center bg-[var(--primary)] text-white !rounded-full min-h-[56px]">Snap Foto →</Link>
  </div>;
}
