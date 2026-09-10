"use client";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { compressToWebp } from "@/lib/compress";
import Link from "next/link";
import { Camera, ImageIcon, Sparkles, Utensils, Trash2, Save, Calendar } from "lucide-react";

type Food = { name: string; calories: number; portion?: string };
const STEPS = ["Mengompres foto...", "Mengunggah foto...", "Menganalisis foto dengan AI...", "Mendeteksi makanan...", "Menghitung kalori..."];

export default function FotoPage(){
  const [preview,setPreview]=useState<string|null>(null);
  const [blob,setBlob]=useState<Blob|null>(null);
  const [loading,setLoading]=useState(false);
  const [step,setStep]=useState(0);
  const [result,setResult]=useState<{foods:Food[];total_calories:number;notes?:string}|null>(null);
  const [fotoUrl,setFotoUrl]=useState<string|null>(null);
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState("");
  const [tanggal,setTanggal]=useState(()=>new Date().toISOString().slice(0,10));
  const camRef=useRef<HTMLInputElement>(null);
  const galRef=useRef<HTMLInputElement>(null);

  useEffect(()=>{
    if(!loading) return;
    const id=setInterval(()=> setStep(s=> (s+1)%STEPS.length), 700);
    return ()=> clearInterval(id);
  },[loading]);

  async function analyzeWithBlob(b: Blob){
    setLoading(true); setStep(0); setMsg(""); setResult(null);
    try{
      const s=createClient(); const {data:{user}}=await s.auth.getUser(); if(!user) throw new Error("belum login — silakan Masuk dulu");
      setStep(1);
      const path=`${user.id}/${Date.now()}.webp`;
      const {error:upErr}=await s.storage.from("food-photos").upload(path,b,{contentType:"image/webp",upsert:false});
      if(upErr) throw new Error("upload gagal: "+upErr.message);
      const {data:pub}=s.storage.from("food-photos").getPublicUrl(path); setFotoUrl(pub.publicUrl);
      setStep(2);
      const fd=new FormData(); fd.append("file", new File([b],"food.webp",{type:"image/webp"}));
      setStep(3);
      const r=await fetch("/api/gemini/analyze",{method:"POST",body:fd});
      const j=await r.json().catch(()=>({}));
      if(!r.ok) throw new Error(j.error || j.raw || "gagal analisis");
      setStep(4);
      await new Promise(res=> setTimeout(res, 400));
      const foods=(j.foods||[]).map((f:any)=>({name:String(f.name||""), calories:Math.round(Number(f.calories||0)), portion:f.portion}));
      setResult({foods,total_calories:j.total_calories||foods.reduce((a:number,b:any)=>a+b.calories,0),notes:j.notes});
      if(foods.length===0) setMsg("AI tidak mendeteksi makanan — coba foto lebih jelas");
    }catch(e:any){ setMsg(e.message||"error"); }
    setLoading(false);
  }

  async function handleFile(f: File){
    setMsg(""); setResult(null); setFotoUrl(null); setStep(0);
    const c=await compressToWebp(f,800,0.7);
    const url=URL.createObjectURL(c);
    setBlob(c); setPreview(url);
    analyzeWithBlob(c);
  }
  function onCam(e:React.ChangeEvent<HTMLInputElement>){ const f=e.target.files?.[0]; if(f) handleFile(f); e.target.value=""; }
  function onGal(e:React.ChangeEvent<HTMLInputElement>){ const f=e.target.files?.[0]; if(f) handleFile(f); e.target.value=""; }

  async function save(){
    if(!result) return; setSaving(true); setMsg("");
    try{
      const s=createClient(); const {data:{user}}=await s.auth.getUser(); if(!user) throw new Error("belum login");
      const waktu=new Date().toTimeString().slice(0,8);
      for(const f of result.foods){
        const {error}=await s.from("kalori_intake").insert({user_id:user.id,tanggal,waktu,nama_makanan:f.name,kalori:Math.round(f.calories),sumber:"ai",foto_url:fotoUrl});
        if(error) throw error;
      }
      setMsg(`Tersimpan ${result.foods.length} item • ${result.total_calories} kkal ✓`);
      setTimeout(()=>location.href="/history",700);
    }catch(e:any){ setMsg(e.message); }
    setSaving(false);
  }
  function edit(i:number,k:"name"|"calories",v:string){
    if(!result) return; const foods=[...result.foods];
    if(k==="name") foods[i].name=v; else foods[i].calories=parseInt(v)||0;
    setResult({...result,foods,total_calories:foods.reduce((a,b)=>a+(b.calories||0),0)});
  }

  return <div className="mx-auto w-full max-w-xl md:max-w-3xl p-4 pb-28 space-y-4">
    <style>{`@keyframes scanMove{0%{top:0}100%{top:100%}}`}</style>
    <div className="flex items-center justify-between gap-3">
      <span className="neo-badge bg-[var(--neo-lavender)] inline-flex items-center gap-1.5"><Camera className="h-3.5 w-3.5" /> Foto Makanan</span>
      <Link href="/history" className="neo-badge bg-white">Riwayat →</Link>
    </div>

    <div className="neo-card bg-white p-6">
      <label className="block"><span className="mb-1 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider"><Calendar className="h-3.5 w-3.5" /> Tanggal</span>
        <input type="date" value={tanggal} onChange={e=>setTanggal(e.target.value)} className="neo-input" />
      </label>

      <div className="mt-4">
        <input ref={camRef} type="file" accept="image/*" capture="environment" onChange={onCam} className="hidden" />
        <input ref={galRef} type="file" accept="image/*" onChange={onGal} className="hidden" />
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={()=>camRef.current?.click()} className="neo-btn bg-[var(--primary)] text-white flex flex-col items-center gap-1 !py-4">
            <Camera className="h-5 w-5" /><span className="text-xs font-black">Ambil Foto</span>
          </button>
          <button type="button" onClick={()=>galRef.current?.click()} className="neo-btn bg-white flex flex-col items-center gap-1 !py-4">
            <ImageIcon className="h-5 w-5" /><span className="text-xs font-black">Pilih Galeri</span>
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-wide text-slate-500">Upload langsung auto-analisis — efek scan biru dibawah</p>
      </div>

      {preview && (
        <div className="mt-4 space-y-3">
          <div className="relative overflow-hidden rounded-[1.5rem] border-[2.5px] border-[#0f172a]">
            <img src={preview} alt="preview makanan" className="w-full max-h-[360px] object-cover" />
            {loading && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[var(--primary)]/10" />
                <div className="absolute left-0 right-0 h-[3px] bg-[var(--primary)] shadow-[0_0_12px_rgba(37,99,235,0.9)]" style={{animation:"scanMove 1.2s linear infinite"}} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--primary)]/15 to-transparent opacity-60" style={{animation:"scanMove 1.2s linear infinite"}} />
              </div>
            )}
          </div>

          {loading ? (
            <div className="neo-card-soft bg-[#0f172a] text-white p-3 flex items-center gap-3">
              <span className="h-5 w-5 shrink-0 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <div>
                <div className="text-xs font-black">{STEPS[step]}</div>
                <div className="text-[10px] font-bold opacity-70">AI Gemini sedang menghitung — jangan tutup halaman</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="neo-badge bg-[var(--neo-mint)] inline-flex items-center gap-1"><ImageIcon className="h-3 w-3" /> WebP 800px</span>
              <button type="button" onClick={()=>{setPreview(null);setBlob(null);setResult(null);setFotoUrl(null);setMsg("")}} className="neo-badge bg-[var(--neo-coral)] inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> Hapus</button>
            </div>
          )}
        </div>
      )}

      {msg && !loading && <div role="status" className="mt-3 neo-card-soft bg-[#0f172a] text-white p-3 text-xs font-black whitespace-pre-wrap break-words">{msg}</div>}
    </div>

    {result && !loading && <div className="neo-card bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-1.5 text-sm font-black uppercase tracking-wider"><Utensils className="h-4 w-4 text-[var(--primary)]" /> Hasil • {result.total_calories} kkal</h2>
        <span className="neo-badge bg-[var(--neo-peach)]">{result.foods.length} item</span>
      </div>
      {result.notes && <p className="mt-2 text-xs font-semibold text-slate-600">{result.notes}</p>}
      <div className="mt-4 space-y-2">
        {result.foods.map((f,i)=>(
          <div key={i} className="flex items-center gap-2 neo-card-soft !p-2 bg-[var(--muted)]">
            <input aria-label="nama makanan" value={f.name} onChange={e=>edit(i,"name",e.target.value)} className="neo-input !py-2 flex-1" />
            <input aria-label="kalori" type="number" value={f.calories} onChange={e=>edit(i,"calories",e.target.value)} className="neo-input !py-2 w-24 text-center" />
            <span className="text-xs font-black shrink-0">kkal</span>
          </div>
        ))}
      </div>
      <button type="button" onClick={save} disabled={saving} className="neo-btn mt-4 w-full bg-[var(--primary)] text-white !rounded-full min-h-[56px] inline-flex items-center justify-center gap-2"><Save className="h-4 w-4" /> {saving?"Menyimpan...":`Simpan ${result.foods.length} Item → History`}</button>
    </div>}
  </div>;
}
