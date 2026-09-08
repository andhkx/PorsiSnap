"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DevPage(){
  const [user,setUser]=useState<any>(null);
  const [streak,setStreak]=useState<any>(null);
  const [msg,setMsg]=useState("");
  useEffect(()=>{(async()=>{
    const s=createClient();
    const {data:{user}}=await s.auth.getUser(); setUser(user);
    try{ const r=await fetch("/api/streak"); const j=await r.json(); setStreak(j);}catch(e:any){ setStreak({error:String(e)}) }
  })();},[]);
  async function clearToday(){
    if(!confirm("Hapus semua data hari ini?")) return;
    const s=createClient();
    const t=new Date().toISOString().slice(0,10);
    const {error}=await s.from("kalori_intake").delete().eq("user_id",user.id).eq("tanggal",t);
    setMsg(error?error.message:"Hapus ok — daily_summary auto update ✓");
  }
  return <div className="mx-auto max-w-5xl p-4 pb-28 space-y-4">
    <div className="neo-badge bg-[var(--neo-lavender)] inline-block">Dev</div>
    <div className="neo-card bg-white p-6">
      <h2 className="text-xs font-black uppercase tracking-widest">Session</h2>
      <pre className="mt-3 neo-inset !p-3 text-xs overflow-auto bg-[#0f172a] text-white whitespace-pre-wrap break-words">{JSON.stringify(user?{id:user.id,email:user.email}:null, null, 2)}</pre>
    </div>
    <div className="neo-card bg-white p-6">
      <h2 className="text-xs font-black uppercase tracking-widest">Streak API /api/streak</h2>
      <pre className="mt-3 neo-inset !p-3 text-xs overflow-auto bg-white whitespace-pre-wrap break-words">{JSON.stringify(streak,null,2)}</pre>
    </div>
    <div className="neo-card bg-white p-6">
      <h2 className="text-xs font-black uppercase tracking-widest">Danger Zone</h2>
      <button type="button" onClick={clearToday} className="neo-btn mt-3 bg-[var(--neo-coral)] !rounded-full">Hapus Data Hari Ini</button>
      {msg&&<div role="status" className="mt-3 neo-card-soft bg-[var(--neo-coral)] p-3 text-xs font-black">{msg}</div>}
      <p className="mt-3 text-xs font-semibold text-slate-600">Env zxgegw... • bucket food-photos public • HitCal neo token 1:1 • Analytics on.</p>
    </div>
  </div>;
}
