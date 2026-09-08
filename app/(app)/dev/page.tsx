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
    const r=await fetch("/api/streak"); const j=await r.json(); setStreak(j);
  })();},[]);
  async function clearToday(){
    if(!confirm("Hapus semua data hari ini?")) return;
    const s=createClient();
    const t=new Date().toISOString().slice(0,10);
    const {error}=await s.from("kalori_intake").delete().eq("user_id",user.id).eq("tanggal",t);
    setMsg(error?error.message:"Hapus ok — daily_summary auto update");
  }
  return <div className="max-w-3xl mx-auto p-4 space-y-4">
    <h1 className="font-black uppercase text-2xl">Dev</h1>
    <Card><h2 className="font-black uppercase text-sm">Session</h2><pre className="mt-2 bg-black text-white p-3 text-xs overflow-auto border-[3px] border-black">{JSON.stringify(user?{id:user.id,email:user.email}:null, null, 2)}</pre></Card>
    <Card><h2 className="font-black uppercase text-sm">Streak API /api/streak</h2><pre className="mt-2 bg-white border-[3px] border-black p-3 text-xs overflow-auto">{JSON.stringify(streak,null,2)}</pre></Card>
    <Card><h2 className="font-black uppercase text-sm">Danger Zone</h2><div className="mt-3"><Button variant="danger" onClick={clearToday}>Hapus Data Hari Ini</Button></div>{msg&&<div className="mt-2 bg-[#FF006E] text-white border-[3px] border-black p-2 font-bold text-xs">{msg}</div>}</Card>
  </div>;
}
