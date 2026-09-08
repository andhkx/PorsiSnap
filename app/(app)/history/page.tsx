"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/UI/Card";
import Link from "next/link";
type Item = { id:string; nama_makanan:string; kalori:number; waktu:string|null; sumber:string; foto_url:string|null; created_at:string; };
export default function HistoryPage(){
  const [tanggal,setTanggal]=useState(()=>new Date().toISOString().slice(0,10));
  const [items,setItems]=useState<Item[]>([]);
  const [target,setTarget]=useState(0); const [memenuhi,setMemenuhi]=useState(false); const [streak,setStreak]=useState(0);
  const [loading,setLoading]=useState(true); const [msg,setMsg]=useState("");
  async function load(d:string){
    setLoading(true);
    const s=createClient(); const {data:{user}}=await s.auth.getUser(); if(!user){ location.href="/login"; return; }
    const {data:prof}=await s.from("profiles").select("target_kalori,current_streak").eq("id",user.id).single();
    if(prof){ setTarget(prof.target_kalori||0); setStreak(prof.current_streak||0); }
    const {data:its}=await s.from("kalori_intake").select("*").eq("user_id",user.id).eq("tanggal",d).order("created_at",{ascending:true});
    setItems((its as any)||[]);
    const {data:sum}=await s.from("daily_summary").select("memenuhi").eq("user_id",user.id).eq("tanggal",d).single();
    setMemenuhi(!!sum?.memenuhi);
    setLoading(false);
  }
  useEffect(()=>{ load(tanggal); },[tanggal]);
  const total=items.reduce((a,b)=>a+b.kalori,0); const sisa=target-total; const pct=target?Math.round(total/target*100):0;
  async function del(id:string){
    if(!confirm("Hapus item ini?")) return;
    const s=createClient(); const {error}=await s.from("kalori_intake").delete().eq("id",id);
    if(error) setMsg(error.message); else load(tanggal);
  }
  return <div className="mx-auto max-w-[480px] md:max-w-3xl p-4 space-y-4">
    <div className="flex items-center justify-between gap-3">
      <h1 className="text-2xl font-black uppercase tracking-tight">Riwayat</h1>
      <Link href="/foto" className="rounded-[9999px] bg-[#2563eb] text-white border-[3px] border-[#0f172a] px-4 py-2 text-xs font-black uppercase shadow-[3px_3px_0px_#0f172a]">+ Snap</Link>
    </div>
    <Card className="rounded-[24px]">
      <label className="text-[11px] font-black uppercase tracking-widest">Tanggal</label>
      <input type="date" value={tanggal} onChange={e=>setTanggal(e.target.value)} className="mt-1 w-full rounded-[16px] border-[3px] border-[#0f172a] bg-white px-4 py-3 text-sm font-black" />
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-[20px] bg-[#00D9A3] border-[3px] border-[#0f172a] p-3"><div className="text-2xl font-black leading-none">{total}</div><div className="mt-1 text-[9px] font-black uppercase tracking-widest">Total kkal</div></div>
        <div className="rounded-[20px] bg-white border-[3px] border-[#0f172a] p-3"><div className="text-2xl font-black leading-none">{target}</div><div className="mt-1 text-[9px] font-black uppercase tracking-widest">Target</div></div>
        <div className={`rounded-[20px] border-[3px] border-[#0f172a] p-3 ${sisa>=0?"bg-[#FFBE0B]":"bg-[#ff006e] text-white"}`}><div className="text-2xl font-black leading-none">{sisa>=0?`-${sisa}`:`+${Math.abs(sisa)}`}</div><div className="mt-1 text-[9px] font-black uppercase tracking-widest">{sisa>=0?"Sisa":"Over"}</div></div>
      </div>
      <div className="mt-3 h-4 overflow-hidden rounded-[9999px] border-[3px] border-[#0f172a] bg-[#e2e8f0]"><div className={`h-full ${pct>105?"bg-[#ff006e]":pct>=85?"bg-[#2563eb]":"bg-[#0f172a]"}`} style={{width:Math.min(100,pct)+"%"}}/></div>
      <div className="mt-2 flex justify-between text-xs font-black uppercase tracking-wide"><span>{pct}% • {memenuhi?"Memenuhi ✓":"Belum memenuhi"}</span><span>🔥 {streak}</span></div>
      {msg && <div className="mt-2 rounded-[16px] bg-[#0f172a] text-white p-3 text-xs font-black">{msg}</div>}
    </Card>
    <Card className="rounded-[24px]">
      <h2 className="text-xs font-black uppercase tracking-widest">Makanan Hari Ini • {items.length} item</h2>
      {loading? <div className="mt-3 text-sm font-black">Memuat...</div>
      : items.length===0? <div className="mt-3 rounded-[16px] border-[3px] border-dashed border-[#0f172a] p-6 text-center text-sm font-black">Belum ada data. <Link href="/foto" className="underline decoration-[3px] underline-offset-4">Snap foto →</Link></div>
      : <div className="mt-3 space-y-2">
        {items.map(it=>(
          <div key={it.id} className="flex gap-3 rounded-[20px] border-[3px] border-[#0f172a] bg-white p-2 items-center">
            {it.foto_url? <img src={it.foto_url} alt="" className="h-16 w-16 shrink-0 rounded-[16px] object-cover border-[3px] border-[#0f172a]"/> : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[16px] bg-[#f8fafc] border-[3px] border-[#0f172a] text-xl">🍱</div>}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-black uppercase">{it.nama_makanan}</div>
              <div className="text-xs font-bold opacity-60">{it.kalori} kkal • {it.waktu?it.waktu.slice(0,5):""} • {it.sumber==="ai"?"AI":"Manual"}</div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="rounded-[12px] bg-[#0f172a] px-2.5 py-1 text-xs font-black text-white">{it.kalori}</span>
              <button onClick={()=>del(it.id)} className="rounded-[9999px] bg-[#ff006e] text-white border-[3px] border-[#0f172a] px-2.5 py-1 text-[10px] font-black uppercase">Hapus</button>
            </div>
          </div>
        ))}
      </div>}
    </Card>
  </div>;
}
