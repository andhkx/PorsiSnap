"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { BarChart3, TrendingUp, Flame, Award, CalendarRange, Download } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import jsPDF from "jspdf";
type Row = { tanggal: string; total_kalori: number; memenuhi: boolean };
export default function StatsPage(){
  const [periode,setPeriode]=useState<7|30>(7);
  const [rows,setRows]=useState<Row[]>([]);
  const [target,setTarget]=useState(0); const [streak,setStreak]=useState(0); const [longest,setLongest]=useState(0);
  const [loading,setLoading]=useState(true);
  async function load(p:7|30){
    setLoading(true);
    const s=createClient(); const {data:{user}}=await s.auth.getUser(); if(!user){location.href="/login";return;}
    const {data:prof}=await s.from("profiles").select("target_kalori,current_streak,longest_streak").eq("id",user.id).single();
    if(prof){ setTarget(prof.target_kalori||0); setStreak(prof.current_streak||0); setLongest(prof.longest_streak||0); }
    const from=new Date(); from.setDate(from.getDate()-p+1); const fromStr=from.toISOString().slice(0,10);
    const {data}=await s.from("daily_summary").select("tanggal,total_kalori,memenuhi").eq("user_id",user.id).gte("tanggal",fromStr).order("tanggal",{ascending:true});
    const map=new Map((data as any[]||[]).map(r=>[r.tanggal,r]));
    const filled:Row[]=[]; for(let i=0;i<p;i++){ const d=new Date(from); d.setDate(from.getDate()+i); const t=d.toISOString().slice(0,10); const r=map.get(t); filled.push({tanggal:t.slice(5),total_kalori:r?.total_kalori??0,memenuhi:!!r?.memenuhi}); }
    setRows(filled); setLoading(false);
  }
  useEffect(()=>{ load(periode); },[periode]);
  const total=rows.reduce((a,b)=>a+b.total_kalori,0); const avg=rows.length?Math.round(total/rows.length):0;
  const aktif=rows.filter(r=>r.total_kalori>0).length; const ok=rows.filter(r=>r.memenuhi).length; const pct=target?Math.round(avg/target*100):0;
  function pdf(){
    const doc=new jsPDF(); doc.setFont("helvetica","bold"); doc.setFontSize(16); doc.text("PorsiSnap — Laporan",10,15);
    doc.setFontSize(10); doc.setFont("helvetica","normal"); doc.text(`Periode: ${periode} hari • Target: ${target} kkal • Streak: ${streak} (best ${longest})`,10,22);
    doc.text(`Total: ${total} | Rata-rata: ${avg} | Aktif: ${aktif}/${periode} | Memenuhi: ${ok}/${periode} | ${pct}% vs target`,10,28);
    let y=36; doc.setFont("helvetica","bold"); doc.text("Tanggal | Total | Memenuhi",10,y); y+=6; doc.setFont("helvetica","normal");
    rows.forEach(r=>{ doc.text(`${r.tanggal} | ${r.total_kalori} kkal | ${r.memenuhi?"Ya":"Tidak"}`,10,y); y+=6; if(y>280){ doc.addPage(); y=15; } }); doc.save(`porsisnap-${periode}hari.pdf`);
  }
  return <div className="mx-auto w-full max-w-xl md:max-w-5xl p-4 pb-28 space-y-4">
    <div className="flex items-center justify-between gap-3">
      <span className="neo-badge bg-[var(--neo-lavender)] inline-flex items-center gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> Statistik</span>
      <span className="hidden md:inline-flex neo-badge bg-white inline-flex items-center gap-1.5"><CalendarRange className="h-3.5 w-3.5" /> {periode} Hari</span>
    </div>

    <div className="neo-card p-5 bg-white">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest"><TrendingUp className="h-3.5 w-3.5 text-[var(--primary)]" /> Ringkasan • Target {target} kkal</h2>
        <span className="neo-badge bg-[#0f172a] text-white hidden sm:inline-flex">{pct}% vs target</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="neo-card-soft !p-3 text-center bg-[var(--neo-mint)]"><div className="text-[10px] font-black uppercase tracking-widest opacity-60">Rata-rata</div><div className="text-2xl font-black leading-none mt-1">{avg}</div><div className="text-[10px] font-black uppercase">kkal</div></div>
        <div className="neo-card-soft !p-3 text-center bg-[var(--neo-lavender)]"><div className="text-[10px] font-black uppercase tracking-widest opacity-60">Total</div><div className="text-2xl font-black leading-none mt-1">{total}</div><div className="text-[10px] font-black uppercase">kkal</div></div>
        <div className="neo-card-soft !p-3 text-center bg-white"><div className="text-[10px] font-black uppercase tracking-widest opacity-60">Hari Aktif</div><div className="text-xl font-black leading-none mt-1">{aktif}/{periode}</div><div className="text-[10px] font-black uppercase">{ok} memenuhi</div></div>
        <div className="neo-card-soft !p-3 text-center bg-[#0f172a] text-white"><div className="inline-flex items-center gap-1 text-xs font-black"><Flame className="h-3.5 w-3.5" /> {streak}</div><div className="text-[10px] font-black uppercase opacity-60">Streak • Best {longest}</div></div>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={()=>setPeriode(7)} className={`neo-btn flex-1 !py-2 text-xs ${periode===7?"!bg-[#0f172a] !text-white":"bg-white"}`}>7 Hari</button>
        <button type="button" onClick={()=>setPeriode(30)} className={`neo-btn flex-1 !py-2 text-xs ${periode===30?"!bg-[#0f172a] !text-white":"bg-white"}`}>30 Hari</button>
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <div className="neo-card bg-white p-5">
        <h3 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest"><TrendingUp className="h-3.5 w-3.5" /> Grafik Harian</h3>
        <div className="mt-3 h-[220px] neo-inset !p-2 bg-white overflow-hidden">
          {loading? <div className="grid h-full place-items-center text-sm font-black">Memuat...</div> : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" opacity={0.12} />
                <XAxis dataKey="tanggal" tick={{fontSize:10,fontWeight:900}} stroke="#0f172a" />
                <YAxis tick={{fontSize:10,fontWeight:900}} stroke="#0f172a" width={34} />
                <Tooltip contentStyle={{border:"2.5px solid #0f172a",borderRadius:"1rem",fontWeight:900}} />
                <Line type="monotone" dataKey="total_kalori" stroke="var(--primary)" strokeWidth={3} dot={{stroke:"#0f172a",strokeWidth:2,r:4,fill:"#fff"}} activeDot={{r:6}} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <div className="neo-card bg-white p-5">
        <h3 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest"><BarChart3 className="h-3.5 w-3.5" /> Bar Harian • {ok}/{periode} memenuhi</h3>
        <div className="mt-3 h-[220px] neo-inset !p-2 bg-white overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" opacity={0.12} />
              <XAxis dataKey="tanggal" tick={{fontSize:10,fontWeight:900}} stroke="#0f172a" />
              <YAxis tick={{fontSize:10,fontWeight:900}} stroke="#0f172a" width={34} />
              <Tooltip contentStyle={{border:"2.5px solid #0f172a",borderRadius:"1rem",fontWeight:900}} />
              <Bar dataKey="total_kalori" fill="var(--primary)" stroke="#0f172a" strokeWidth={2} radius={[10,10,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    <div className="neo-card bg-[var(--neo-peach)] p-5">
      <div className="text-xs font-black uppercase tracking-widest opacity-60">Kalender Mini • {periode} hari terakhir</div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {rows.map((r,i)=>(
          <span key={i} className={`h-8 w-8 grid place-items-center rounded-xl border-2 border-[#0f172a] text-[10px] font-black ${r.memenuhi?"bg-[var(--neo-mint)]":r.total_kalori>0?"bg-white":"bg-slate-100 opacity-60"}`} title={`${r.tanggal}: ${r.total_kalori} kkal`}>{r.tanggal.slice(3)}</span>
        ))}
      </div>
      <div className="mt-2 flex gap-2 text-[10px] font-black uppercase tracking-wide">
        <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-[var(--neo-mint)] border border-[#0f172a]" /> Memenuhi</span>
        <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-white border border-[#0f172a]" /> Terisi</span>
        <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-slate-100 border border-[#0f172a]" /> Kosong</span>
      </div>
    </div>

    <div className="grid gap-3 md:grid-cols-2">
      <button type="button" onClick={pdf} className="neo-btn bg-[var(--primary)] text-white !rounded-full min-h-[56px] inline-flex items-center justify-center gap-2"><Download className="h-4 w-4" /> Export PDF</button>
      <Link href="/history" className="neo-btn bg-white !rounded-full min-h-[56px] grid place-items-center">Lihat Riwayat</Link>
    </div>
  </div>;
}
