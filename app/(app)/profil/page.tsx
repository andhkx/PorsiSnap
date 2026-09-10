"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { calcAll } from "@/lib/calculations";
import Link from "next/link";
import { User, Scale, Ruler, Flame, Award, LogOut, HelpCircle, Pencil } from "lucide-react";

const fmt = (n: number) => new Intl.NumberFormat("id-ID").format(n);

export default function ProfilPage(){
  const [p,setP]=useState<any>(null); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [msg,setMsg]=useState("");
  const [showModal,setShowModal]=useState(false);
  const [form,setForm]=useState({nama:"",usia:"",gender:"pria",bb:"",tb:"",tujuan:"stabilkan",targetBb:""});
  useEffect(()=>{(async()=>{
    const s=createClient(); const {data:{user}}=await s.auth.getUser(); if(!user){location.href="/login";return;}
    const {data,error}=await s.from("profiles").select("*").eq("id",user.id).single();
    if(error){ setMsg(error.message); setLoading(false); return; }
    if(data){
      setP(data);
      setForm({nama:data.nama||"",usia:String(data.usia||""),gender:data.gender||"pria",bb:String(data.bb||""),tb:String(data.tb||""),tujuan:data.tujuan||"stabilkan",targetBb: data.target_bb ? String(data.target_bb) : ""});
    }
    setLoading(false);
  })();},[]);
  async function save(e:React.FormEvent){
    e.preventDefault(); setSaving(true); setMsg("");
    const s=createClient(); const {data:{user}}=await s.auth.getUser();
    const usiaN=Number(form.usia)||0, bbN=Number(form.bb)||0, tbN=Number(form.tb)||0;
    if(!usiaN || !bbN || !tbN){ setMsg("Usia, BB, TB wajib angka valid"); setSaving(false); return; }
    const showTarget = form.tujuan==="naikkan" || form.tujuan==="turunkan";
    if(showTarget && !form.targetBb){ setMsg("Target BB wajib untuk naikkan/turunkan"); setSaving(false); return; }
    const calc=calcAll(bbN,tbN,usiaN,form.gender as any,form.tujuan as any);
    const payload:any={nama:form.nama,usia:usiaN,gender:form.gender,bb:bbN,tb:tbN,tujuan:form.tujuan,bmi:calc.bmi,status_bmi:calc.status_bmi,bmr:calc.bmr,tdee:calc.tdee,target_kalori:calc.target_kalori};
    if(form.targetBb) payload.target_bb=Number(form.targetBb);
    const {error}=await s.from("profiles").update(payload).eq("id",user!.id);
    if(error) setMsg(error.message); else { setMsg("Tersimpan ✓"); setShowModal(false); setTimeout(()=>location.reload(),500); }
    setSaving(false);
  }
  async function logout(){ const s=createClient(); await s.auth.signOut(); location.href="/login"; }
  if(loading) return <div className="mx-auto max-w-5xl p-6 font-black">Memuat...</div>;
  if(!p) return <div className="mx-auto max-w-5xl p-4"><div className="neo-card p-6 bg-white">Tidak ada profil. {msg}</div></div>;
  const fallback = (!p.bmr || !p.tdee || !p.target_kalori) ? calcAll(Number(p.bb||53), Number(p.tb||165), Number(p.usia||18), (p.gender as any)||"pria", (p.tujuan as any)||"stabilkan") : null;
  const bmrVal = p.bmr ?? fallback?.bmr ?? 1576;
  const tdeeVal = p.tdee ?? fallback?.tdee ?? 2443;
  const targetVal = p.target_kalori ?? fallback?.target_kalori ?? 2943;
  const bmiVal = p.bmi ?? fallback?.bmi ?? 0;
  const bmiStatus = p.status_bmi || fallback?.status_bmi || "normal";
  const bmiLabel = bmiStatus==="kurus"?"Kurus":bmiStatus==="normal"?"Normal (Ideal)":bmiStatus==="overweight"?"Overweight":"Obesitas";
  const bmiDesc = bmiStatus==="normal"?"Berat badan kamu ideal. Pertahankan pola makan seimbang dan aktivitas fisik!":bmiStatus==="kurus"?"Berat badan di bawah ideal — tambah asupan bergizi seimbang.":bmiStatus==="overweight"?"Kelebihan berat — atur porsi & tingkatkan aktivitas.":"Obesitas — konsultasi pola makan sehat.";
  const bmiBg = bmiStatus==="kurus"?"bg-[var(--neo-sky)]":bmiStatus==="normal"?"bg-[var(--neo-mint)]":"bg-[var(--neo-coral)]";
  const tujuanLabel = p.tujuan==="stabilkan"?"Stabilkan Berat Badan":p.tujuan==="turunkan"?"Turunkan Berat Badan":"Naikkan Berat Badan";
  const targetExtra = p.target_bb ? ` (Target ${p.target_bb} kg)` : (p.tujuan!=="stabilkan" ? ` (Target ${p.bb} kg)` : "");
  const curStreak = p.current_streak ?? 0;
  const longStreak = p.longest_streak ?? 0;
  const showLongest = longStreak > 0;
  const showTargetBb = form.tujuan==="naikkan" || form.tujuan==="turunkan";
  return <div className="mx-auto max-w-5xl p-4 pb-28 space-y-4">
    <div className="flex items-center justify-between gap-3">
      <span className="neo-badge bg-[var(--neo-lavender)] inline-flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Profil</span>
      <button onClick={logout} className="neo-badge bg-white inline-flex items-center gap-1.5 hover:bg-slate-50"><LogOut className="h-3.5 w-3.5" /> Logout</button>
    </div>

    <div className="neo-card p-6 md:p-7 bg-[var(--neo-lavender)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-black uppercase tracking-widest">Target Harian</h2>
        <span className="neo-badge bg-white inline-flex items-center gap-1"><Flame className="h-3 w-3" /> {curStreak} streak</span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-4xl md:text-5xl font-black tracking-tight">{fmt(targetVal)}</span>
        <span className="text-sm font-black">kalori / hari</span>
      </div>
      <p className="mt-1 text-xs font-semibold text-slate-700 leading-relaxed">Rekomendasi asupan kalori optimal berdasarkan target tubuhmu.</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="neo-card-soft p-4 bg-[var(--neo-sky)]">
          <div className="text-[11px] font-black uppercase tracking-widest text-slate-600">BMR (Metabolisme Basal)</div>
          <div className="mt-1 flex items-baseline gap-1"><span className="text-xl font-black">{fmt(bmrVal)}</span><span className="text-xs font-black">kalori</span></div>
        </div>
        <div className="neo-card-soft p-4 bg-[var(--neo-mint)]">
          <div className="text-[11px] font-black uppercase tracking-widest text-slate-600">Kebutuhan Normal</div>
          <div className="mt-1 flex items-baseline gap-1"><span className="text-xl font-black">{fmt(tdeeVal)}</span><span className="text-xs font-black">kalori</span></div>
          <div className="text-[10px] font-bold text-slate-600">×1.55 aktivitas</div>
        </div>
      </div>

      <div className="mt-5 neo-card-soft p-4 bg-white">
        <div className="flex items-center gap-2 text-sm font-black"><HelpCircle className="h-4 w-4 text-[var(--primary)]" /> Metode Perhitungan Hitcal</div>
        <ul className="mt-2 space-y-1.5 text-xs font-semibold text-slate-700">
          <li className="flex gap-2"><span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[#0f172a] shrink-0" /> BMR dihitung dengan formula baku Mifflin–St Jeor.</li>
          <li className="flex gap-2"><span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[#0f172a] shrink-0" /> Kebutuhan harian disesuaikan faktor aktivitas harian (1.55x).</li>
          <li className="flex gap-2"><span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[#0f172a] shrink-0" /> Defisit / Surplus sehat berkisar ±500 kalori per hari.</li>
          <li className="flex gap-2"><span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[#0f172a] shrink-0" /> Contoh: 18th • 53kg • 181cm • Pria → BMR 1576 • TDEE 2443 • Target 2943</li>
        </ul>
      </div>
    </div>

    <div className="neo-card p-6 md:p-7 bg-[var(--neo-peach)]">
      <div className="flex items-center gap-2 text-sm font-black"><User className="h-4 w-4 text-[var(--primary)]" /> Profil Pengguna</div>
      <div className="mt-1 text-lg font-black">{p.nama}</div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="neo-card-soft p-4 bg-white">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-500"><User className="h-3.5 w-3.5" /> Kondisi</div>
          <div className="mt-1 text-sm font-black">{p.usia} th · {p.gender==="pria"?"Pria":"Wanita"}</div>
        </div>
        <div className="neo-card-soft p-4 bg-white">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-500"><Ruler className="h-3.5 w-3.5" /> Postur</div>
          <div className="mt-1 text-sm font-black">{p.bb} kg · {p.tb} cm</div>
        </div>
      </div>

      <div className={`mt-3 neo-card-soft p-4 ${bmiBg}`}>
        <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest opacity-70"><Scale className="h-3.5 w-3.5" /> Status BMI (Body Mass Index)</div>
        <div className="mt-1 flex items-baseline gap-2"><span className="text-lg font-black">{bmiLabel}</span><span className="text-xs font-black">({bmiVal})</span></div>
        <p className="mt-1 text-xs font-bold leading-relaxed">{bmiDesc}</p>
      </div>

      <div className="mt-3 neo-card-soft p-4 bg-white">
        <div className="text-[11px] font-black uppercase tracking-widest opacity-70">Tujuan Utama</div>
        <div className="mt-1 text-sm font-black">{tujuanLabel}{targetExtra}</div>
      </div>

      <div className={`mt-3 grid gap-3 ${showLongest ? "grid-cols-2" : "grid-cols-1"}`}>
        <div className="neo-card-soft p-4 text-center bg-[#0f172a] text-white"><div className="inline-flex items-center gap-1 text-lg font-black"><Flame className="h-4 w-4" /> {curStreak}</div><div className="text-[10px] font-black uppercase tracking-widest opacity-70">Current Streak</div></div>
        {showLongest && <div className="neo-card-soft p-4 text-center bg-[var(--neo-mint)]"><div className="inline-flex items-center gap-1 text-lg font-black"><Award className="h-4 w-4" /> {longStreak}</div><div className="text-[10px] font-black uppercase tracking-widest">Longest</div></div>}
      </div>
    </div>

    <button type="button" onClick={()=>setShowModal(true)} className="neo-btn w-full bg-[#0f172a] text-white !rounded-full min-h-[56px] inline-flex items-center justify-center gap-2"><Pencil className="h-4 w-4" /> Ubah Data Profil</button>
    <Link href="/foto" className="neo-btn flex w-full justify-center bg-[var(--primary)] text-white !rounded-full min-h-[56px]">Snap Foto →</Link>
    {msg && !showModal && <div className="neo-card-soft bg-[#0f172a] text-white p-3 text-xs font-black">{msg}</div>}

    {showModal && (
      <div className="fixed inset-0 z-50 grid place-items-center bg-[#0f172a]/50 backdrop-blur-sm p-4" onClick={()=>setShowModal(false)}>
        <div className="neo-card w-full max-w-lg max-h-[90vh] overflow-auto bg-white p-6" onClick={e=>e.stopPropagation()}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black">Ubah Data Profil</h2>
            <button type="button" onClick={()=>setShowModal(false)} className="neo-badge bg-white">Tutup</button>
          </div>
          <form onSubmit={save} className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Nama</span><input className="neo-input" placeholder="Budi" value={form.nama} onChange={e=>setForm(s=>({...s,nama:e.target.value}))} required/></label>
            <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Usia</span><input className="neo-input" type="number" placeholder="18" value={form.usia} onChange={e=>setForm(s=>({...s,usia:e.target.value}))} /></label>
            <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Gender</span>
              <div className="flex gap-2">
                <button type="button" onClick={()=>setForm(s=>({...s,gender:"pria"}))} className={`neo-btn flex-1 !p-2 text-xs font-black ${form.gender==="pria"?"!bg-[var(--neo-lavender)]":"bg-white"}`}>Pria</button>
                <button type="button" onClick={()=>setForm(s=>({...s,gender:"wanita"}))} className={`neo-btn flex-1 !p-2 text-xs font-black ${form.gender==="wanita"?"!bg-[var(--neo-lavender)]":"bg-white"}`}>Wanita</button>
              </div>
            </label>
            <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">BB (kg)</span><input className="neo-input" type="number" step="0.1" placeholder="53" value={form.bb} onChange={e=>setForm(s=>({...s,bb:e.target.value}))}/></label>
            <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">TB (cm)</span><input className="neo-input" type="number" placeholder="181" value={form.tb} onChange={e=>setForm(s=>({...s,tb:e.target.value}))}/></label>
            <label className="block sm:col-span-2"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Tujuan</span>
              <div className="grid grid-cols-3 gap-2">
                {(["stabilkan","turunkan","naikkan"] as const).map(v=>(
                  <button key={v} type="button" onClick={()=>setForm(s=>({...s,tujuan:v}))} className={`neo-btn !py-2.5 text-xs font-black capitalize ${form.tujuan===v?"!bg-[#0f172a] !text-white":"bg-white"}`}>{v}</button>
                ))}
              </div>
            </label>
            {showTargetBb && <label className="block sm:col-span-2"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Target BB (kg) • wajib jika naikkan/turunkan</span><input className="neo-input" type="number" step="0.1" placeholder={form.tujuan==="naikkan"?"60":"50"} value={form.targetBb} onChange={e=>setForm(s=>({...s,targetBb:e.target.value}))} required={showTargetBb}/></label>}
            {msg && <div className="sm:col-span-2 neo-card-soft bg-[var(--neo-coral)] p-3 text-xs font-black whitespace-pre-wrap break-words">{msg}</div>}
            <div className="sm:col-span-2 flex gap-2">
              <button type="button" onClick={()=>setShowModal(false)} className="neo-btn flex-1 bg-white !rounded-full">Batal</button>
              <button type="submit" disabled={saving} className="neo-btn flex-1 bg-[var(--primary)] text-white !rounded-full">{saving?"Menyimpan...":"Simpan →"}</button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>;
}
