"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { calcAll } from "@/lib/calculations";
import Link from "next/link";
import { User, Scale, Ruler, Flame, Award, LogOut, HelpCircle } from "lucide-react";

const fmt = (n: number) => new Intl.NumberFormat("id-ID").format(n);

export default function ProfilPage(){
  const [p,setP]=useState<any>(null); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [msg,setMsg]=useState("");
  const [form,setForm]=useState({nama:"",usia:25,gender:"pria",bb:60,tb:165,tujuan:"stabilkan"});
  useEffect(()=>{(async()=>{
    const s=createClient(); const {data:{user}}=await s.auth.getUser(); if(!user){location.href="/login";return;}
    const {data,error}=await s.from("profiles").select("*").eq("id",user.id).single();
    if(error){ setMsg(error.message); setLoading(false); return; }
    if(data){ setP(data); setForm({nama:data.nama,usia:data.usia,gender:data.gender,bb:data.bb,tb:data.tb,tujuan:data.tujuan});}
    setLoading(false);
  })();},[]);
  async function save(e:React.FormEvent){
    e.preventDefault(); setSaving(true); setMsg("");
    const s=createClient(); const {data:{user}}=await s.auth.getUser();
    const calc=calcAll(Number(form.bb),Number(form.tb),Number(form.usia),form.gender as any,form.tujuan as any);
    const {error}=await s.from("profiles").update({nama:form.nama,usia:Number(form.usia),gender:form.gender,bb:Number(form.bb),tb:Number(form.tb),tujuan:form.tujuan,bmi:calc.bmi,status_bmi:calc.status_bmi,bmr:calc.bmr,tdee:calc.tdee,target_kalori:calc.target_kalori}).eq("id",user!.id);
    if(error) setMsg(error.message); else { setMsg("Tersimpan ✓"); setTimeout(()=>location.reload(),600); }
    setSaving(false);
  }
  async function logout(){ const s=createClient(); await s.auth.signOut(); location.href="/login"; }
  if(loading) return <div className="mx-auto max-w-5xl p-6 font-black">Memuat...</div>;
  if(!p) return <div className="mx-auto max-w-5xl p-4"><div className="neo-card p-6 bg-white">Tidak ada profil. {msg}</div></div>;
  const bmiLabel = p.status_bmi==="kurus"?"Kurus":p.status_bmi==="normal"?"Normal (Ideal)":p.status_bmi==="overweight"?"Overweight":"Obesitas";
  const bmiDesc = p.status_bmi==="normal"?"Berat badan kamu ideal. Pertahankan pola makan seimbang dan aktivitas fisik!":p.status_bmi==="kurus"?"Tambah asupan bergizi seimbang.":p.status_bmi==="overweight"?"Atur porsi & tingkatkan aktivitas harian.":"Konsultasi pola makan sehat.";
  const bmiBg = p.status_bmi==="normal"?"bg-[var(--neo-mint)]":p.status_bmi==="kurus"?"bg-[var(--neo-peach)]":"bg-[var(--neo-coral)]";
  const tujuanLabel = p.tujuan==="stabilkan"?"Stabilkan Berat Badan":p.tujuan==="turunkan"?"Turunkan Berat Badan":"Naikkan Berat Badan";
  const targetExtra = p.target_bb ? ` (Target ${p.target_bb} kg)` : ` (Target ${p.bb} kg)`;
  return <div className="mx-auto max-w-5xl p-4 pb-28 space-y-4">
    <div className="flex items-center justify-between gap-3">
      <span className="neo-badge bg-[var(--neo-lavender)] inline-flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Profil</span>
      <button onClick={logout} className="neo-badge bg-white inline-flex items-center gap-1.5"><LogOut className="h-3.5 w-3.5" /> Logout</button>
    </div>

    <div className="neo-card bg-white p-6 md:p-7">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-black uppercase tracking-widest">Target Harian</h2>
        <span className="neo-badge bg-[var(--neo-lavender)] inline-flex items-center gap-1"><Flame className="h-3 w-3" /> {p.current_streak||0} streak</span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-4xl md:text-5xl font-black tracking-tight">{fmt(p.target_kalori)}</span>
        <span className="text-sm font-black">kalori / hari</span>
      </div>
      <p className="mt-1 text-xs font-semibold text-slate-600 leading-relaxed">Rekomendasi asupan kalori optimal berdasarkan target tubuhmu.</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="neo-card-soft p-4 bg-[var(--muted)]">
          <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">BMR (Metabolisme Basal)</div>
          <div className="mt-1 flex items-baseline gap-1"><span className="text-xl font-black">{fmt(p.bmr)}</span><span className="text-xs font-black">kalori</span></div>
        </div>
        <div className="neo-card-soft p-4 bg-[var(--primary)] text-white border-[#0f172a]">
          <div className="text-[11px] font-black uppercase tracking-widest opacity-80">Kebutuhan Normal</div>
          <div className="mt-1 flex items-baseline gap-1"><span className="text-xl font-black">{fmt(p.tdee)}</span><span className="text-xs font-black">kalori</span></div>
          <div className="text-[10px] font-bold opacity-70">×1.55 aktivitas</div>
        </div>
      </div>

      <div className="mt-5 neo-card-soft p-4 bg-white">
        <div className="flex items-center gap-2 text-sm font-black"><HelpCircle className="h-4 w-4 text-[var(--primary)]" /> Metode Perhitungan Hitcal</div>
        <ul className="mt-2 space-y-1.5 text-xs font-semibold text-slate-700">
          <li className="flex gap-2"><span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[#0f172a] shrink-0" /> BMR dihitung dengan formula baku Mifflin–St Jeor.</li>
          <li className="flex gap-2"><span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[#0f172a] shrink-0" /> Kebutuhan harian disesuaikan faktor aktivitas harian (1.55x).</li>
          <li className="flex gap-2"><span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[#0f172a] shrink-0" /> Defisit / Surplus sehat berkisar ±500 kalori per hari.</li>
        </ul>
      </div>
    </div>

    <div className="neo-card bg-white p-6 md:p-7">
      <div className="flex items-center gap-2 text-sm font-black"><User className="h-4 w-4 text-[var(--primary)]" /> Profil Pengguna</div>
      <div className="mt-1 text-lg font-black">{p.nama}</div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="neo-card-soft p-4 bg-[var(--muted)]">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-500"><User className="h-3.5 w-3.5" /> Kondisi</div>
          <div className="mt-1 text-sm font-black">{p.usia} th · {p.gender==="pria"?"Pria":"Wanita"}</div>
        </div>
        <div className="neo-card-soft p-4 bg-[var(--muted)]">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-500"><Ruler className="h-3.5 w-3.5" /> Postur</div>
          <div className="mt-1 text-sm font-black">{p.bb} kg · {p.tb} cm</div>
        </div>
      </div>

      <div className={`mt-3 neo-card-soft p-4 ${bmiBg}`}>
        <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest opacity-70"><Scale className="h-3.5 w-3.5" /> Status BMI (Body Mass Index)</div>
        <div className="mt-1 flex items-baseline gap-2"><span className="text-lg font-black">{bmiLabel}</span><span className="text-xs font-black">({p.bmi})</span></div>
        <p className="mt-1 text-xs font-bold leading-relaxed">{bmiDesc}</p>
      </div>

      <div className="mt-3 neo-card-soft p-4 bg-[var(--neo-lavender)]">
        <div className="text-[11px] font-black uppercase tracking-widest opacity-70">Tujuan Utama</div>
        <div className="mt-1 text-sm font-black">{tujuanLabel}{targetExtra}</div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="neo-card-soft p-3 text-center bg-[#0f172a] text-white"><div className="inline-flex items-center gap-1 text-sm font-black"><Flame className="h-4 w-4" /> {p.current_streak||0}</div><div className="text-[10px] font-black uppercase tracking-widest opacity-70">Current Streak</div></div>
        <div className="neo-card-soft p-3 text-center"><div className="inline-flex items-center gap-1 text-sm font-black"><Award className="h-4 w-4" /> {p.longest_streak||0}</div><div className="text-[10px] font-black uppercase tracking-widest opacity-60">Longest</div></div>
      </div>
    </div>

    <div className="neo-card p-6 md:p-8 bg-white">
      <div className="neo-badge bg-[var(--neo-mint)] inline-block">Edit Profil</div>
      <h2 className="mt-3 text-xl font-black leading-tight">Perbarui datamu</h2>
      <form onSubmit={save} className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Nama</span><input className="neo-input" value={form.nama} onChange={e=>setForm(s=>({...s,nama:e.target.value}))} required/></label>
        <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Usia</span><input className="neo-input" type="number" value={form.usia} onChange={e=>setForm(s=>({...s,usia:parseInt(e.target.value)||0}))} /></label>
        <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Gender</span>
          <div className="flex gap-2">
            <button type="button" onClick={()=>setForm(s=>({...s,gender:"pria"}))} className={`neo-btn flex-1 !p-2 text-xs font-black ${form.gender==="pria"?"!bg-[var(--neo-lavender)]":"bg-white"}`}>Pria</button>
            <button type="button" onClick={()=>setForm(s=>({...s,gender:"wanita"}))} className={`neo-btn flex-1 !p-2 text-xs font-black ${form.gender==="wanita"?"!bg-[var(--neo-lavender)]":"bg-white"}`}>Wanita</button>
          </div>
        </label>
        <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">BB (kg)</span><input className="neo-input" type="number" step="0.1" value={form.bb} onChange={e=>setForm(s=>({...s,bb:parseFloat(e.target.value)||0}))}/></label>
        <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">TB (cm)</span><input className="neo-input" type="number" value={form.tb} onChange={e=>setForm(s=>({...s,tb:parseInt(e.target.value)||0}))}/></label>
        <label className="block sm:col-span-2"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Tujuan</span>
          <div className="grid grid-cols-3 gap-2">
            {(["stabilkan","turunkan","naikkan"] as const).map(v=>(
              <button key={v} type="button" onClick={()=>setForm(s=>({...s,tujuan:v}))} className={`neo-btn !py-2.5 text-xs font-black capitalize ${form.tujuan===v?"!bg-[#0f172a] !text-white":"bg-white"}`}>{v}</button>
            ))}
          </div>
        </label>
        {msg && <div className="sm:col-span-2 neo-card-soft bg-[#0f172a] text-white p-3 text-xs font-black">{msg}</div>}
        <div className="sm:col-span-2"><button type="submit" disabled={saving} className="neo-btn w-full bg-[var(--primary)] text-white !rounded-full min-h-[56px] text-base">{saving?"Menyimpan...":"Simpan →"}</button></div>
      </form>
    </div>
    <Link href="/foto" className="neo-btn flex w-full justify-center bg-[var(--primary)] text-white !rounded-full min-h-[56px]">Snap Foto →</Link>
  </div>;
}
