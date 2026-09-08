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
    const {data}=await s.from("profiles").select("*").eq("id",user.id).single(); if(data){ setP(data); setForm({nama:data.nama,usia:data.usia,gender:data.gender,bb:data.bb,tb:data.tb,tujuan:data.tujuan});}
    setLoading(false);
  })(); },[]);
  async function save(e:React.FormEvent){
    e.preventDefault(); setSaving(true); setMsg("");
    const s=createClient(); const {data:{user}}=await s.auth.getUser();
    const calc=calcAll(Number(form.bb),Number(form.tb),Number(form.usia),form.gender as any,form.tujuan as any);
    const {error}=await s.from("profiles").update({nama:form.nama,usia:Number(form.usia),gender:form.gender,bb:Number(form.bb),tb:Number(form.tb),tujuan:form.tujuan,bmi:calc.bmi,status_bmi:calc.status_bmi,bmr:calc.bmr,tdee:calc.tdee,target_kalori:calc.target_kalori}).eq("id",user!.id);
    if(error) setMsg(error.message); else { setMsg("Tersimpan"); location.reload(); }
    setSaving(false);
  }
  async function logout(){ const s=createClient(); await s.auth.signOut(); location.href="/login"; }
  if(loading) return <div className="p-6 font-black uppercase">Memuat...</div>;
  if(!p) return <div className="p-6"><Card>Tidak ada profil.</Card></div>;
  return <div className="max-w-3xl mx-auto p-4 space-y-4">
    <div className="flex justify-between items-center"><h1 className="font-black uppercase text-2xl">Profil</h1><button onClick={logout} className="border-[3px] border-black bg-white px-3 py-2 font-black uppercase text-xs">Logout</button></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card className="!p-4 text-center"><div className="font-black text-3xl">{p.bmi}</div><div className="font-black uppercase text-[10px]">BMI • {p.status_bmi}</div></Card>
      <Card className="!p-4 text-center bg-[#FFBE0B]"><div className="font-black text-3xl">{p.bmr}</div><div className="font-black uppercase text-[10px]">BMR</div></Card>
      <Card className="!p-4 text-center bg-[#00D9A3]"><div className="font-black text-3xl">{p.tdee}</div><div className="font-black uppercase text-[10px]">TDEE</div></Card>
      <Card className="!p-4 text-center bg-[#FF6B35] text-white"><div className="font-black text-3xl">{p.target_kalori}</div><div className="font-black uppercase text-[10px]">Target</div></Card>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <Card className="!p-4 text-center bg-black text-white border-white"><div className="font-black text-3xl">🔥 {p.current_streak||0}</div><div className="font-black uppercase text-[10px]">Current Streak</div></Card>
      <Card className="!p-4 text-center"><div className="font-black text-3xl">🏆 {p.longest_streak||0}</div><div className="font-black uppercase text-[10px]">Longest Streak</div></Card>
    </div>
    <Card>
      <h2 className="font-black uppercase">Edit Profil</h2>
      <form onSubmit={save} className="mt-3 grid md:grid-cols-2 gap-3">
        <div className="md:col-span-2"><label className="font-black uppercase text-xs">Nama</label><Input value={form.nama} onChange={e=>setForm(s=>({...s,nama:e.target.value}))} required/></div>
        <div><label className="font-black uppercase text-xs">Usia</label><Input type="number" value={form.usia} onChange={e=>setForm(s=>({...s,usia:parseInt(e.target.value)||0}))} /></div>
        <div><label className="font-black uppercase text-xs">Gender</label><select className="w-full border-[3px] border-black bg-white px-4 py-3 font-semibold text-sm" value={form.gender} onChange={e=>setForm(s=>({...s,gender:e.target.value}))}><option value="pria">Pria</option><option value="wanita">Wanita</option></select></div>
        <div><label className="font-black uppercase text-xs">BB</label><Input type="number" step="0.1" value={form.bb} onChange={e=>setForm(s=>({...s,bb:parseFloat(e.target.value)||0}))}/></div>
        <div><label className="font-black uppercase text-xs">TB</label><Input type="number" value={form.tb} onChange={e=>setForm(s=>({...s,tb:parseInt(e.target.value)||0}))}/></div>
        <div className="md:col-span-2"><label className="font-black uppercase text-xs">Tujuan</label><select className="w-full border-[3px] border-black bg-white px-4 py-3 font-semibold text-sm" value={form.tujuan} onChange={e=>setForm(s=>({...s,tujuan:e.target.value}))}><option value="turunkan">Turunkan</option><option value="stabilkan">Stabilkan</option><option value="naikkan">Naikkan</option></select></div>
        {msg && <div className="md:col-span-2 bg-black text-white border-[3px] border-black p-2 font-bold text-xs">{msg}</div>}
        <div className="md:col-span-2"><Button type="submit" size="lg" disabled={saving}>{saving?"Menyimpan...":"Simpan →"}</Button></div>
      </form>
    </Card>
    <Link href="/foto" className="block"><Button size="lg">Snap Foto →</Button></Link>
  </div>;
}
