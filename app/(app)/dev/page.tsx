"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/UI/Card";
import Button from "@/components/UI/Button";

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
  return <div className="mx-auto max-w-[480px] md:max-w-3xl p-4 space-y-4">
    <h1 className="text-2xl font-black uppercase tracking-tight">Dev</h1>
    <Card className="rounded-[24px]">
      <h2 className="text-xs font-black uppercase tracking-widest">Session</h2>
      <pre className="mt-3 rounded-[16px] bg-[#0f172a] text-white p-3 text-xs overflow-auto border-[3px] border-[#0f172a]">{JSON.stringify(user?{id:user.id,email:user.email}:null, null, 2)}</pre>
    </Card>
    <Card className="rounded-[24px]">
      <h2 className="text-xs font-black uppercase tracking-widest">Streak API /api/streak</h2>
      <pre className="mt-3 rounded-[16px] bg-white border-[3px] border-[#0f172a] p-3 text-xs overflow-auto">{JSON.stringify(streak,null,2)}</pre>
    </Card>
    <Card className="rounded-[24px]">
      <h2 className="text-xs font-black uppercase tracking-widest">Danger Zone</h2>
      <div className="mt-3"><Button variant="danger" onClick={clearToday}>Hapus Data Hari Ini</Button></div>
      {msg&&<div className="mt-3 rounded-[16px] bg-[#ff006e] text-white border-[3px] border-[#0f172a] p-3 text-xs font-black">{msg}</div>}
      <p className="mt-3 text-xs font-bold opacity-60">Env sudah fix ke rxhibmwhkjpfwirzvojt — daftar ulang harus jalan. Jika masih cache, restart dev server.</p>
    </Card>
  </div>;
}
