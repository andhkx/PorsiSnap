"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/UI/Card";
import Button from "@/components/UI/Button";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import jsPDF from "jspdf";

type Row = { tanggal: string; total_kalori: number; memenuhi: boolean };

export default function StatsPage() {
  const [periode, setPeriode] = useState<7 | 30>(7);
  const [rows, setRows] = useState<Row[]>([]);
  const [target, setTarget] = useState(0);
  const [streak, setStreak] = useState(0);
  const [longest, setLongest] = useState(0);
  const [loading, setLoading] = useState(true);

  async function load(p: 7 | 30) {
    setLoading(true);
    const s = createClient();
    const { data: { user } } = await s.auth.getUser();
    if (!user) { location.href = "/login"; return; }
    const { data: prof } = await s.from("profiles").select("target_kalori,current_streak,longest_streak").eq("id", user.id).single();
    if (prof) { setTarget(prof.target_kalori || 0); setStreak(prof.current_streak || 0); setLongest(prof.longest_streak || 0); }
    const from = new Date(); from.setDate(from.getDate() - p + 1);
    const fromStr = from.toISOString().slice(0, 10);
    const { data } = await s.from("daily_summary").select("tanggal,total_kalori,memenuhi").eq("user_id", user.id).gte("tanggal", fromStr).order("tanggal", { ascending: true });
    const map = new Map((data as any[] || []).map(r => [r.tanggal, r]));
    const filled: Row[] = [];
    for (let i = 0; i < p; i++) {
      const d = new Date(from); d.setDate(from.getDate() + i);
      const t = d.toISOString().slice(0, 10);
      const r = map.get(t);
      filled.push({ tanggal: t.slice(5), total_kalori: r?.total_kalori ?? 0, memenuhi: !!r?.memenuhi });
    }
    setRows(filled);
    setLoading(false);
  }
  useEffect(() => { load(periode); }, [periode]);

  const total = rows.reduce((a, b) => a + b.total_kalori, 0);
  const avg = rows.length ? Math.round(total / rows.length) : 0;
  const hariAktif = rows.filter(r => r.total_kalori > 0).length;
  const memenuhiCount = rows.filter(r => r.memenuhi).length;
  const pctVsTarget = target ? Math.round((avg / target) * 100) : 0;

  function exportPdf() {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold"); doc.setFontSize(16);
    doc.text("PorsiSnap — Laporan", 10, 15);
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.text(`Periode: ${periode} hari • Target: ${target} kkal • Streak: ${streak} (longest ${longest})`, 10, 22);
    doc.text(`Total: ${total} | Rata-rata: ${avg} | Hari aktif: ${hariAktif}/${periode} | Memenuhi: ${memenuhiCount}/${periode} | ${pctVsTarget}% vs target`, 10, 28);
    let y = 36;
    doc.setFont("helvetica", "bold"); doc.text("Tanggal | Total | Memenuhi", 10, y); y += 6;
    doc.setFont("helvetica", "normal");
    rows.forEach(r => { doc.text(`${r.tanggal} | ${r.total_kalori} kkal | ${r.memenuhi ? "Ya" : "Tidak"}`, 10, y); y += 6; if (y > 280) { doc.addPage(); y = 15; } });
    doc.save(`porsisnap-${periode}hari.pdf`);
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="font-black uppercase text-2xl">Statistik</h1>
        <div className="flex gap-2">
          <button onClick={() => setPeriode(7)} className={`border-[3px] border-black px-3 py-2 font-black uppercase text-xs ${periode === 7 ? "bg-[#FF6B35] text-white" : "bg-white"}`}>7 Hari</button>
          <button onClick={() => setPeriode(30)} className={`border-[3px] border-black px-3 py-2 font-black uppercase text-xs ${periode === 30 ? "bg-[#FF6B35] text-white" : "bg-white"}`}>30 Hari</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="!p-4 text-center bg-[#FFBE0B]"><div className="font-black text-3xl">{avg}</div><div className="font-black uppercase text-[10px]">Rata-rata kkal</div></Card>
        <Card className="!p-4 text-center bg-[#00D9A3]"><div className="font-black text-3xl">{total}</div><div className="font-black uppercase text-[10px]">Total kkal</div></Card>
        <Card className="!p-4 text-center"><div className="font-black text-3xl">{hariAktif}/{periode}</div><div className="font-black uppercase text-[10px]">Hari Aktif</div></Card>
        <Card className="!p-4 text-center bg-black text-white border-white"><div className="font-black text-3xl">🔥 {streak}</div><div className="font-black uppercase text-[10px]">Streak • Best {longest}</div></Card>
      </div>

      <Card>
        <div className="flex justify-between items-center">
          <h2 className="font-black uppercase text-sm">Grafik Harian • Target {target} kkal</h2>
          <span className="bg-[#004E89] text-white border-[2px] border-black px-2 py-1 font-black text-xs">{pctVsTarget}% vs target • Memenuhi {memenuhiCount}/{periode}</span>
        </div>
        <div className="mt-4 h-[260px] border-[3px] border-black bg-white p-2">
          {loading ? <div className="font-bold text-sm p-4">Memuat...</div> : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000" />
                <XAxis dataKey="tanggal" tick={{ fontSize: 10, fontWeight: 900 }} stroke="#000" />
                <YAxis tick={{ fontSize: 10, fontWeight: 900 }} stroke="#000" />
                <Tooltip contentStyle={{ border: "3px solid #000", fontWeight: 900 }} />
                <Line type="monotone" dataKey="total_kalori" stroke="#FF6B35" strokeWidth={3} dot={{ stroke: "#000", strokeWidth: 2, r: 4, fill: "#FFBE0B" }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card>
        <h2 className="font-black uppercase text-sm">Hari Memenuhi Target</h2>
        <div className="mt-3 h-[180px] border-[3px] border-black bg-white p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" stroke="#000" />
              <XAxis dataKey="tanggal" tick={{ fontSize: 10, fontWeight: 900 }} stroke="#000" />
              <YAxis tick={{ fontSize: 10, fontWeight: 900 }} stroke="#000" />
              <Tooltip contentStyle={{ border: "3px solid #000", fontWeight: 900 }} />
              <Bar dataKey="total_kalori" fill="#004E89" stroke="#000" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-3">
        <Button onClick={exportPdf} variant="secondary" size="lg">Export PDF →</Button>
        <Link href="/history"><Button variant="outline" size="lg">Lihat Riwayat</Button></Link>
      </div>
    </div>
  );
}
