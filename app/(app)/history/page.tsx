"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/UI/Card";
import Button from "@/components/UI/Button";
import Link from "next/link";

type Item = { id:string; nama_makanan:string; kalori:number; waktu:string|null; sumber:string; foto_url:string|null; created_at:string };

export default function HistoryPage(){
  const [tanggal,setTanggal]=useState(()=>new Date().toISOString().slice(0,10));
  const [items,setItems]=useState<Item[]>([]);
  const [target,setTarget]=useState(0);
  const [memenuhi,setMemenuhi]=useState(false);
  const [streak,setStreak]=useState(0);
  const [loading,setLoading]=useState(true);
  const [msg,setMsg]=useState("");

  async function load(d:string){
    setLoading(true);
    const s=createClient();
    const {data:{user}}=await s.auth.getUser();
    if(!user){ location.href="/login"; return; }
    const {data:prof}=await s.from("profiles").select("target_kalori,current_streak").eq("id",user.id).single();
    if(prof){ setTarget(prof.target_kalori||0); setStreak(prof.current_streak||0); }
    const {data:its}=await s.from("kalori_intake").select("*").eq("user_id",user.id).eq("tanggal",d).order("created_at",{ascending:true});
    setItems((its as any)||[]);
    const {data:sum}=await s.from("daily_summary").select("memenuhi").eq("user_id",user.id).eq("tanggal",d).single();
    setMemenuhi(!!sum?.memenuhi);
    setLoading(false);
  }
  useEffect(()=>{ load(tanggal); },[tanggal]);

  const total=items.reduce((a,b)=>a+b.kalori,0);
  const sisa=target-total;
  const pct=target?Math.round(total/target*100):0;

  async function del(id:string){
    if(!confirm("Hapus item ini?")) return;
    const s=createClient();
    const {error}=await s.from("kalori_intake").delete().eq("id",id);
    if(error) setMsg(error.message); else load(tanggal);
  }

  return <div className="max-w-3xl mx-auto p-4 space-y-4">
    <div className="flex justify-between items-center">
      <h1 className="font-black uppercase text-2xl">Riwayat</h1>
      <Link href="/foto" className="bg-[#FF6B35] text-white border-[3px] border-black px-3 py-2 font-black uppercase text-xs shadow-[3px_3px_0px_#000]">+ Snap</Link>
    </div>
    <Card>
      <label className="font-black uppercase text-xs">Tanggal</label>
      <input type="date" value={tanggal} onChange={e=>setTanggal(e.target.value)} className="w-full border-[3px] border-black bg-white px-4 py-3 font-bold text-sm" />
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="bg-[#00D9A3] border-[3px] border-black p-3"><div className="font-black text-2xl">{total}</div><div className="font-black uppercase text-[10px]">Total kkal</div></div>
        <div className="bg-white border-[3px] border-black p-3"><div className="font-black text-2xl">{target}</div><div className="font-black uppercase text-[10px]">Target</div></div>
        <div className={`${sisa>=0?"bg-[#FFBE0B]":"bg-[#FF006E] text-white"} border-[3px] border-black p-3`}><div className="font-black text-2xl">{sisa>=0?`-${sisa}`:`+${Math.abs(sisa)}`}</div><div className="font-black uppercase text-[10px]">{sisa>=0?"Sisa":"Over"}</div></div>
      </div>
      <div className="mt-3 h-4 bg-zinc-200 border-[3px] border-black"><div className={`h-full ${pct>105?"bg-[#FF006E]":pct>=85?"bg-[#00D9A3]":"bg-[#004E89]"} border-r-[3px] border-black`} style={{width:Math.min(100,pct)+"%"}}/></div>
      <div className="mt-2 flex justify-between font-black uppercase text-xs"><span>{pct}% • {memenuhi?"Memenuhi ✅":"Belum memenuhi"}</span><span>🔥 Streak {streak}</span></div>
      {msg && <div className="mt-2 bg-black text-white p-2 font-bold text-xs">{msg}</div>}
    </Card>

    <Card>
      <h2 className="font-black uppercase text-sm">Makanan Hari Ini • {items.length} item</h2>
      {loading? <div className="font-bold text-sm mt-2">Memuat...</div>
      : items.length===0? <div className="mt-3 border-[3px] border-dashed border-black p-6 text-center font-bold text-sm">Belum ada data. <Link href="/foto" className="underline">Snap foto sekarang →</Link></div>
      : <div className="mt-3 space-y-2">
        {items.map(it=>(
          <div key={it.id} className="border-[3px] border-black bg-white p-2 flex gap-3 items-center">
            {it.foto_url? <img src={it.foto_url} alt="" className="w-16 h-16 object-cover border-[3px] border-black shrink-0"/> : <div className="w-16 h-16 bg-zinc-200 border-[3px] border-black flex items-center justify-center text-xl shrink-0">🍱</div>}
            <div className="flex-1 min-w-0">
              <div className="font-black uppercase text-sm truncate">{it.nama_makanan}</div>
              <div className="font-bold text-xs">{it.kalori} kkal • {it.waktu?it.waktu.slice(0,5):""} • {it.sumber==="ai"?"AI":"Manual"}</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="bg-black text-white px-2 py-1 font-black text-xs">{it.kalori}</span>
              <button onClick={()=>del(it.id)} className="bg-[#FF006E] text-white border-[2px] border-black px-2 py-1 font-black text-[10px] uppercase">Hapus</button>
            </div>
          </div>
        ))}
      </div>}
    </Card>
  </div>;
}
