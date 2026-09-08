"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/UI/Card";
import Button from "@/components/UI/Button";
import Link from "next/link";
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
  return <div className="mx-auto max-w-[480px] md:max-w-5xl p-4 space-y-4">
    <div className="flex items-center justify-between gap-3">
      <h1 className="text-2xl font-black uppercase tracking-tight">Statistik</h1>
      <div className="flex gap-2">
        <button onClick={()=>setPeriode(7)} className={`rounded-[9999px] border-[3px] border-[#0f172a] px-4 py-2 text-xs font-black uppercase ${periode===7?"bg-[#2563eb] text-white":"bg-white"}`}>7 Hari</button>
        <button onClick={()=>setPeriode(30)} className={`rounded-[9999px] border-[3px] border-[#0f172a] px-4 py-2 text-xs font-black uppercase ${periode===30?"bg-[#2563eb] text-white":"bg-white"}`}>30 Hari</button>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Card className="!p-4 text-center rounded-[20px] bg-[#2563eb] text-white"><div className="text-3xl font-black leading-none">{avg}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest opacity-90">Rata-rata</div></Card>
      <Card className="!p-4 text-center rounded-[20px] bg-[#FFBE0B]"><div className="text-3xl font-black leading-none">{total}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest">Total kkal</div></Card>
      <Card className="!p-4 text-center rounded-[20px]"><div className="text-3xl font-black leading-none">{aktif}/{periode}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest opacity-60">Hari Aktif</div></Card>
      <Card className="!p-4 text-center rounded-[20px] bg-[#0f172a] text-white border-[#0f172a]"><div className="text-2xl font-black">🔥 {streak}</div><div className="mt-1 text-[10px] font-black uppercase tracking-widest opacity-70">Best {longest}</div></Card>
    </div>
    <Card className="rounded-[24px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xs font-black uppercase tracking-widest">Grafik Harian • Target {target}</h2>
        <span className="rounded-[9999px] bg-[#0f172a] px-3 py-1 text-xs font-black text-white">{pct}% vs target • {ok}/{periode} ok</span>
      </div>
      <div className="mt-4 h-[240px] rounded-[20px] border-[3px] border-[#0f172a] bg-white p-2">
        {loading? <div className="p-4 text-sm font-black">Memuat...</div> : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" opacity={0.2} />
              <XAxis dataKey="tanggal" tick={{fontSize:10,fontWeight:900}} stroke="#0f172a" />
              <YAxis tick={{fontSize:10,fontWeight:900}} stroke="#0f172a" />
              <Tooltip contentStyle={{border:"3px solid #0f172a",borderRadius:16,fontWeight:900}} />
              <Line type="monotone" dataKey="total_kalori" stroke="#2563eb" strokeWidth={3} dot={{stroke:"#0f172a",strokeWidth:2,r:4,fill:"#FFBE0B"}} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
    <Card className="rounded-[24px]">
      <h2 className="text-xs font-black uppercase tracking-widest">Bar Harian</h2>
      <div className="mt-3 h-[180px] rounded-[20px] border-[3px] border-[#0f172a] bg-white p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" opacity={0.2} />
            <XAxis dataKey="tanggal" tick={{fontSize:10,fontWeight:900}} stroke="#0f172a" />
            <YAxis tick={{fontSize:10,fontWeight:900}} stroke="#0f172a" />
            <Tooltip contentStyle={{border:"3px solid #0f172a",borderRadius:16,fontWeight:900}} />
            <Bar dataKey="total_kalori" fill="#2563eb" stroke="#0f172a" strokeWidth={2} radius={[12,12,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
    <div className="grid gap-3 md:grid-cols-2">
      <Button onClick={pdf} variant="primary" size="lg">Export PDF →</Button>
      <Link href="/history"><Button variant="secondary" size="lg">Lihat Riwayat</Button></Link>
    </div>
  </div>;
}
