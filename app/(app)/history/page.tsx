"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Calendar, Flame, Trash2, ImageIcon, Utensils, Camera } from "lucide-react";
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
  return <div className="mx-auto w-full max-w-xl md:max-w-3xl p-4 pb-28 space-y-4">
    <div className="flex items-center justify-between gap-3">
      <span className="neo-badge bg-[var(--neo-lavender)] inline-flex items-center gap-1.5"><Utensils className="h-3.5 w-3.5" /> Riwayat</span>
      <Link href="/foto" className="neo-btn !py-2 !px-4 bg-[var(--primary)] text-white !rounded-full text-xs inline-flex items-center gap-1.5"><Camera className="h-3.5 w-3.5" /> Snap</Link>
    </div>
    <div className="neo-card bg-[var(--neo-sky)] p-6">
      <label className="block"><span className="mb-1 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider"><Calendar className="h-3.5 w-3.5" /> Tanggal</span>
        <input type="date" value={tanggal} onChange={e=>setTanggal(e.target.value)} className="neo-input" />
      </label>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="neo-card-soft !p-3 bg-[var(--neo-mint)]"><div className="text-2xl font-black leading-none">{total}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest">Total kkal</div></div>
        <div className="neo-card-soft !p-3 bg-[var(--neo-lavender)]"><div className="text-2xl font-black leading-none">{target}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest">Target</div></div>
        <div className={`neo-card-soft !p-3 ${sisa>=0?"bg-[var(--neo-peach)]":"bg-[var(--neo-coral)]"}`}><div className="text-2xl font-black leading-none">{sisa>=0?`-${sisa}`:`+${Math.abs(sisa)}`}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest">{sisa>=0?"Sisa":"Over"}</div></div>
      </div>
      <div className="mt-4 h-4 overflow-hidden rounded-full border-[2.5px] border-[#0f172a] bg-slate-100"><div className={`h-full transition-all ${pct>105?"bg-[var(--neo-coral)]":pct>=85?"bg-[var(--primary)]":"bg-[#0f172a]"}`} style={{width:Math.min(100,pct)+"%"}}/></div>
      <div className="mt-2 flex justify-between text-xs font-black uppercase tracking-wide"><span>{pct}% • {memenuhi?"Memenuhi":"Belum memenuhi"}</span><span className="inline-flex items-center gap-1"><Flame className="h-3.5 w-3.5" /> {streak} streak</span></div>
      {msg && <div role="alert" className="mt-3 neo-card-soft bg-[var(--neo-coral)] p-3 text-xs font-black">{msg}</div>}
    </div>
    <div className="neo-card bg-[var(--neo-peach)] p-6">
      <h2 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest"><Utensils className="h-3.5 w-3.5" /> Makanan Hari Ini • {items.length} item</h2>
      {loading? <div className="mt-3 text-sm font-black">Memuat...</div>
      : items.length===0? <div className="mt-3 rounded-[1rem] border-[2px] border-dashed border-[#0f172a]/30 p-6 text-center text-sm font-bold">Belum ada data. <Link href="/foto" className="font-black underline decoration-2 underline-offset-4">Snap foto →</Link></div>
      : <div className="mt-4 space-y-2">
        {items.map(it=>(
          <div key={it.id} className="flex gap-3 neo-card-soft !p-2 items-center bg-white">
            {it.foto_url? <img src={it.foto_url} alt={it.nama_makanan} className="h-16 w-16 shrink-0 rounded-xl object-cover border-2 border-[#0f172a]"/> : <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-[var(--muted)] border-2 border-[#0f172a]" aria-hidden><ImageIcon className="h-5 w-5 text-slate-500" /></div>}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-black">{it.nama_makanan}</div>
              <div className="text-xs font-semibold text-slate-600">{it.kalori} kkal • {it.waktu?it.waktu.slice(0,5):""} • {it.sumber==="ai"?"AI":"Manual"}</div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="neo-badge !text-[11px] bg-[#0f172a] text-white">{it.kalori}</span>
              <button type="button" onClick={()=>del(it.id)} className="neo-badge bg-[var(--neo-coral)] !text-[10px] inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> Hapus</button>
            </div>
          </div>
        ))}
      </div>}
    </div>
  </div>;
}
