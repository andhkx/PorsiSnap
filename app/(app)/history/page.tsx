"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Calendar, Flame, Trash2, ImageIcon, Utensils, Camera, Clock } from "lucide-react";
type Item={id:string;nama_makanan:string;kalori:number;waktu:string|null;tanggal:string;sumber:string;foto_url:string|null;created_at:string;rincian:any};
type Group={id:string;foto_url:string|null;waktu:string|null;tanggal:string;total:number;foods:{name:string;calories:number;portion?:string}[];created_at:string;sumber:string;isSingle:boolean};
const pastel=["bg-[var(--neo-sky)]","bg-[var(--neo-mint)]","bg-[var(--neo-lavender)]","bg-[var(--neo-peach)]","bg-white"];
export default function HistoryPage(){
  const [tanggal,setTanggal]=useState(()=>new Date().toISOString().slice(0,10));
  const [groups,setGroups]=useState<Group[]>([]);
  const [target,setTarget]=useState(0);const [memenuhi,setMemenuhi]=useState(false);const [streak,setStreak]=useState(0);
  const [loading,setLoading]=useState(true);const [msg,setMsg]=useState("");
  async function load(d:string){
    setLoading(true);setMsg("");
    const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user){location.href="/login";return;}
    const {data:prof}=await s.from("profiles").select("target_kalori,current_streak").eq("id",user.id).single();
    if(prof){setTarget(prof.target_kalori||0);setStreak(prof.current_streak||0);}
    const {data:its,error}=await s.from("kalori_intake").select("*").eq("user_id",user.id).eq("tanggal",d).order("created_at",{ascending:true});
    if(error){setMsg(error.message);setGroups([]);setLoading(false);return;}
    const items=(its as Item[])||[];
    const map=new Map<string,Group>();
    const single:Group[]=[];
    for(const it of items){
      const rincian=Array.isArray((it as any).rincian)? (it as any).rincian: null;
      if(rincian && rincian.length>0){
        single.push({id:it.id,foto_url:it.foto_url,waktu:it.waktu,tanggal:it.tanggal,total:it.kalori,foods:rincian.map((r:any)=>({name:String(r.name||r.nama||""),calories:Math.round(Number(r.calories||r.kalori||0)),portion:r.portion})),created_at:it.created_at,sumber:it.sumber,isSingle:true});
      } else {
        const key=it.foto_url? `foto:${it.foto_url}` : `id:${it.id}`;
        if(map.has(key)){
          const g=map.get(key)!;g.foods.push({name:it.nama_makanan,calories:it.kalori});g.total+=it.kalori;
        } else {
          map.set(key,{id:it.id,foto_url:it.foto_url,waktu:it.waktu,tanggal:it.tanggal,total:it.kalori,foods:[{name:it.nama_makanan,calories:it.kalori}],created_at:it.created_at,sumber:it.sumber,isSingle:false});
        }
      }
    }
    const all=[...single,...Array.from(map.values())].sort((a,b)=> new Date(a.created_at).getTime()-new Date(b.created_at).getTime());
    setGroups(all);
    const {data:sum}=await s.from("daily_summary").select("memenuhi").eq("user_id",user.id).eq("tanggal",d).single();
    setMemenuhi(!!(sum as any)?.memenuhi);
    setLoading(false);
  }
  useEffect(()=>{load(tanggal);},[tanggal]);
  const total=groups.reduce((a,b)=>a+b.total,0);const sisa=target-total;const pct=target?Math.round(total/target*100):0;
  async function delGroup(g:Group){
    if(!confirm(`Hapus menu ini (${g.total} kkal)?`)) return;
    const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user) return;
    let error:any=null;
    if(!g.isSingle && g.foto_url){
      const res=await s.from("kalori_intake").delete().eq("user_id",user.id).eq("tanggal",tanggal).eq("foto_url",g.foto_url);
      error=res.error;
    } else {
      const res=await s.from("kalori_intake").delete().eq("id",g.id);
      error=res.error;
    }
    if(error) setMsg(error.message); else load(tanggal);
  }
  return <div className="mx-auto w-full max-w-xl md:max-w-3xl p-4 pb-28 space-y-4">
    <div className="flex items-center justify-between gap-3">
      <span className="neo-badge bg-[var(--neo-lavender)] inline-flex items-center gap-1.5"><Utensils className="h-3.5 w-3.5"/> Riwayat</span>
      <Link href="/foto" className="neo-btn !py-2 !px-4 bg-[var(--primary)] text-white !rounded-full text-xs inline-flex items-center gap-1.5"><Camera className="h-3.5 w-3.5"/> Snap</Link>
    </div>
    <div className="neo-card bg-[var(--neo-sky)] p-6">
      <label className="block"><span className="mb-1 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider"><Calendar className="h-3.5 w-3.5"/> Tanggal</span>
        <input type="date" value={tanggal} onChange={e=>setTanggal(e.target.value)} className="neo-input"/>
      </label>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="neo-card-soft !p-3 bg-[var(--neo-mint)]"><div className="text-2xl font-black leading-none">{total}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest">Total kkal</div></div>
        <div className="neo-card-soft !p-3 bg-[var(--neo-lavender)]"><div className="text-2xl font-black leading-none">{target}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest">Target</div></div>
        <div className={`neo-card-soft !p-3 ${sisa>=0?"bg-[var(--neo-peach)]":"bg-[var(--neo-coral)]"}`}><div className="text-2xl font-black leading-none">{sisa>=0?`-${sisa}`:`+${Math.abs(sisa)}`}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest">{sisa>=0?"Sisa":"Over"}</div></div>
      </div>
      <div className="mt-4 h-4 overflow-hidden rounded-full border-[2.5px] border-[#0f172a] bg-slate-100"><div className={`h-full transition-all ${pct>105?"bg-[var(--neo-coral)]":pct>=85?"bg-[var(--primary)]":"bg-[#0f172a]"}`} style={{width:Math.min(100,pct)+"%"}}/></div>
      <div className="mt-2 flex justify-between text-xs font-black uppercase tracking-wide"><span>{pct}% • {memenuhi?"Memenuhi":"Belum memenuhi"}</span><span className="inline-flex items-center gap-1"><Flame className="h-3.5 w-3.5"/> {streak} streak</span></div>
      {msg && <div role="alert" className="mt-3 neo-card-soft bg-[var(--neo-coral)] p-3 text-xs font-black">{msg}</div>}
    </div>
    <div className="neo-card bg-white p-6">
      <h2 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest"><Utensils className="h-3.5 w-3.5"/> Makanan Hari Ini • {groups.length} menu • {groups.reduce((a,b)=>a+b.foods.length,0)} item</h2>
      {loading? <div className="mt-3 text-sm font-black">Memuat...</div>
      : groups.length===0? <div className="mt-3 rounded-[1rem] border-[2px] border-dashed border-[#0f172a]/30 p-6 text-center text-sm font-bold">Belum ada data. <Link href="/foto" className="font-black underline decoration-2 underline-offset-4">Snap foto →</Link></div>
      : <div className="mt-4 space-y-3">
        {groups.map((g,idx)=>(
          <div key={g.id} className={`overflow-hidden neo-card-soft !p-0 ${pastel[idx%pastel.length]}`}>
            {g.foto_url? <img src={g.foto_url} alt="menu" className="h-44 w-full object-cover border-b-[2.5px] border-[#0f172a]"/> : <div className="grid h-24 place-items-center border-b-[2.5px] border-[#0f172a] bg-slate-100" aria-hidden><ImageIcon className="h-6 w-6 text-slate-500"/></div>}
            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest opacity-70"><Clock className="h-3 w-3"/> {g.waktu?g.waktu.slice(0,5):g.created_at.slice(11,16)} • {g.sumber==="ai"?"AI":"Manual"} • {g.foods.length} makanan</div>
                  <div className="mt-1 text-lg font-black leading-none">{g.total} <span className="text-xs font-black">kkal</span></div>
                </div>
                <button type="button" onClick={()=>delGroup(g)} className="neo-badge bg-[var(--neo-coral)] !text-[10px] inline-flex items-center gap-1 shrink-0"><Trash2 className="h-3 w-3"/> Hapus</button>
              </div>
              <div className="mt-3 space-y-1.5">
                {g.foods.map((f,i)=>(
                  <div key={i} className="flex items-center justify-between gap-2 rounded-xl border-2 border-[#0f172a] bg-white px-3 py-2">
                    <span className="truncate text-xs font-black">{f.name}</span>
                    <span className="shrink-0 neo-badge !py-0.5 bg-[#0f172a] text-white !text-[11px]">{f.calories} kkal</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>}
    </div>
  </div>;
}
