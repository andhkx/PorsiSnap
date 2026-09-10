"use client";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { compressToWebp } from "@/lib/compress";
import Link from "next/link";
import { Camera, ImageIcon, Sparkles, Trash2, Calendar, Video, Aperture, X } from "lucide-react";
type Food={name:string;calories:number;portion?:string};
const STEPS=["Mengompres foto...","Mengunggah foto...","Menganalisis foto dengan AI...","Mendeteksi makanan...","Menghitung kalori..."];
export default function FotoPage(){
  const [preview,setPreview]=useState<string|null>(null);
  const [loading,setLoading]=useState(false);
  const [step,setStep]=useState(0);
  const [fotoUrl,setFotoUrl]=useState<string|null>(null);
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState("");
  const [tanggal,setTanggal]=useState(()=>new Date().toISOString().slice(0,10));
  const [camOn,setCamOn]=useState(false);
  const [camErr,setCamErr]=useState("");
  const videoRef=useRef<HTMLVideoElement>(null);
  const streamRef=useRef<MediaStream|null>(null);
  const fileRef=useRef<HTMLInputElement>(null);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{ if(!loading) return; const id=setInterval(()=>setStep(s=>(s+1)%STEPS.length),700); return()=>clearInterval(id); },[loading]);
  useEffect(()=>()=>{ streamRef.current?.getTracks().forEach(t=>t.stop()); },[]);
  async function openCamera(){
    setCamErr("");
    try{
      const st=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}},audio:false});
      streamRef.current=st;
      if(videoRef.current){ videoRef.current.srcObject=st; await videoRef.current.play(); }
      setCamOn(true);
    }catch(e:any){ setCamErr(e?.message||"kamera tidak tersedia — pakai Pilih Galeri"); }
  }
  function closeCamera(){ streamRef.current?.getTracks().forEach(t=>t.stop()); streamRef.current=null; setCamOn(false); if(videoRef.current) videoRef.current.srcObject=null; }
  async function autoSave(foods:Food[],total:number,fUrl:string){
    setSaving(true);
    try{
      const s=createClient(); const {data:{user}}=await s.auth.getUser(); if(!user) throw new Error("belum login");
      const waktu=new Date().toTimeString().slice(0,8);
      const nama = foods.length===1 ? foods[0].name : `Menu ${foods.length} item • ${foods[0].name} dkk`;
      const payload:any={user_id:user.id,tanggal,waktu,nama_makanan:nama,kalori:total,sumber:"ai",foto_url:fUrl,rincian:foods};
      let {error}=await s.from("kalori_intake").insert(payload);
      if(error && String(error.message).includes("rincian")){
        const {rincian:_,...fallback}=payload;
        const r2=await s.from("kalori_intake").insert(fallback);
        if(r2.error) throw r2.error;
      } else if(error) throw error;
      setMsg(`Tersimpan • ${total} kkal (${foods.length} makanan) ✓`);
      setTimeout(()=>location.href="/history",700);
    }catch(e:any){ setMsg(e.message); }
    setSaving(false);
  }
  async function analyzeWithBlob(b:Blob){
    setLoading(true); setStep(0); setMsg(""); setCamErr("");
    try{
      const s=createClient(); const {data:{user}}=await s.auth.getUser(); if(!user) throw new Error("belum login — Masuk dulu");
      setStep(1);
      const path=`${user.id}/${Date.now()}.webp`;
      const {error:upErr}=await s.storage.from("food-photos").upload(path,b,{contentType:"image/webp",upsert:false});
      if(upErr) throw new Error("upload gagal: "+upErr.message);
      const {data:pub}=s.storage.from("food-photos").getPublicUrl(path); const fUrl=pub.publicUrl; setFotoUrl(fUrl);
      setStep(2);
      const fd=new FormData(); fd.append("file",new File([b],"food.webp",{type:"image/webp"}));
      setStep(3);
      const r=await fetch("/api/gemini/analyze",{method:"POST",body:fd});
      const j=await r.json().catch(()=>({}));
      if(!r.ok) throw new Error(j.error||j.raw||"gagal analisis");
      setStep(4); await new Promise(res=>setTimeout(res,400));
      const foods:Food[]=(j.foods||[]).map((f:any)=>({name:String(f.name||""),calories:Math.round(Number(f.calories||0)),portion:f.portion})).filter((f:Food)=>f.name && f.calories>0);
      if(foods.length===0) throw new Error("AI tidak mendeteksi makanan — coba foto lebih jelas");
      const total=j.total_calories||foods.reduce((a:number,b:Food)=>a+b.calories,0);
      setMsg(`Terdeteksi ${foods.length} makanan • ${total} kkal — menyimpan...`);
      await autoSave(foods,total,fUrl);
    }catch(e:any){ setMsg(e.message||"error"); }
    setLoading(false);
  }
  async function handleFile(f:File){
    setMsg(""); setFotoUrl(null); setStep(0);
    const c=await compressToWebp(f,800,0.7);
    const url=URL.createObjectURL(c);
    setPreview(url);
    closeCamera();
    analyzeWithBlob(c);
  }
  async function capture(){
    if(!videoRef.current) return;
    const v=videoRef.current; const canvas=canvasRef.current||document.createElement("canvas");
    canvas.width=v.videoWidth||1280; canvas.height=v.videoHeight||720;
    const ctx=canvas.getContext("2d")!; ctx.drawImage(v,0,0,canvas.width,canvas.height);
    const blob:Blob=await new Promise(res=>canvas.toBlob(b=>res(b!),"image/webp",0.7));
    const url=URL.createObjectURL(blob);
    setPreview(url);
    analyzeWithBlob(blob);
  }
  return <div className="mx-auto w-full max-w-xl md:max-w-3xl p-4 pb-28 space-y-4">
    <style>{`@keyframes scanMove{0%{top:0}100%{top:100%}} @keyframes pulseGlow{0%,100%{opacity:.7}50%{opacity:1}}`}</style>
    <div className="flex items-center justify-between gap-3">
      <span className="neo-badge bg-[var(--neo-lavender)] inline-flex items-center gap-1.5"><Camera className="h-3.5 w-3.5"/> Foto Makanan</span>
      <Link href="/history" className="neo-badge bg-white">Riwayat →</Link>
    </div>
    <div className="neo-card bg-[var(--neo-mint)] p-6">
      <label className="block"><span className="mb-1 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider"><Calendar className="h-3.5 w-3.5"/> Tanggal</span>
        <input type="date" value={tanggal} onChange={e=>setTanggal(e.target.value)} className="neo-input"/>
      </label>
      <div className="mt-4">
        <input ref={fileRef} type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0]; if(f) handleFile(f); e.target.value="";}} className="hidden"/>
        <div className="grid grid-cols-2 gap-3">
          {!camOn ? <button type="button" onClick={openCamera} className="neo-btn bg-[#0f172a] text-white flex flex-col items-center gap-1 !py-4"><Video className="h-5 w-5"/><span className="text-xs font-black">Buka Kamera</span><span className="text-[10px] font-bold opacity-60">browser</span></button>
          : <button type="button" onClick={closeCamera} className="neo-btn bg-white flex flex-col items-center gap-1 !py-4"><X className="h-5 w-5"/><span className="text-xs font-black">Tutup Kamera</span></button>}
          <button type="button" onClick={()=>fileRef.current?.click()} className="neo-btn bg-white flex flex-col items-center gap-1 !py-4"><ImageIcon className="h-5 w-5"/><span className="text-xs font-black">Pilih Galeri</span></button>
        </div>
        <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-wide text-slate-500">Kamera browser — auto-analisis + scan biru, auto-save 1 foto = 1 menu</p>
        {camErr && <div className="mt-2 neo-card-soft bg-[var(--neo-coral)] p-2 text-xs font-black">{camErr}</div>}
      </div>
      {camOn && !preview && (
        <div className="mt-4 space-y-3">
          <div className="relative overflow-hidden rounded-[1.5rem] border-[2.5px] border-[#0f172a] bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full max-h-[420px] object-cover"/>
            <div className="pointer-events-none absolute inset-3 rounded-[1.2rem] border-2 border-white/80 shadow-[0_0_0_2px_rgba(15,23,42,.6)]">
              <span className="absolute -top-1 -left-1 h-4 w-4 border-l-[3px] border-t-[3px] border-white rounded-tl-lg"/><span className="absolute -top-1 -right-1 h-4 w-4 border-r-[3px] border-t-[3px] border-white rounded-tr-lg"/><span className="absolute -bottom-1 -left-1 h-4 w-4 border-l-[3px] border-b-[3px] border-white rounded-bl-lg"/><span className="absolute -bottom-1 -right-1 h-4 w-4 border-r-[3px] border-b-[3px] border-white rounded-br-lg"/>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 neo-badge bg-[#0f172a] text-white text-[10px]">Arahkan ke makanan • cahaya terang</div>
          </div>
          <button type="button" onClick={capture} disabled={loading} className="neo-btn w-full bg-[var(--primary)] text-white !rounded-full min-h-[56px] inline-flex items-center justify-center gap-2"><Aperture className="h-5 w-5"/> Ambil Foto</button>
          <canvas ref={canvasRef} className="hidden"/>
        </div>
      )}
      {preview && (
        <div className="mt-4 space-y-3">
          <div className="relative overflow-hidden rounded-[1.5rem] border-[2.5px] border-[#0f172a]">
            <img src={preview} alt="preview" className="w-full max-h-[360px] object-cover"/>
            {loading && <div className="absolute inset-0 pointer-events-none"><div className="absolute inset-0 bg-[var(--primary)]/10"/><div className="absolute left-0 right-0 h-[3px] bg-[var(--primary)] shadow-[0_0_12px_rgba(37,99,235,0.9)]" style={{animation:"scanMove 1.2s linear infinite"}}/><div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--primary)]/15 to-transparent opacity-60" style={{animation:"scanMove 1.2s linear infinite"}}/></div>}
            {!loading && !saving && <button type="button" onClick={()=>{setPreview(null);setFotoUrl(null);setMsg("");}} className="absolute right-2 top-2 neo-badge bg-white inline-flex items-center gap-1"><Trash2 className="h-3 w-3"/> Ganti</button>}
          </div>
          {loading ? (
            <div className="space-y-2">
              <div className="neo-card-soft bg-[#0f172a] text-white p-3 flex items-center gap-3"><span className="h-5 w-5 shrink-0 rounded-full border-2 border-white/30 border-t-white animate-spin"/><div><div className="text-xs font-black">{STEPS[step]}</div><div className="text-[10px] font-bold opacity-70">AI Gemini menghitung — jangan tutup halaman</div></div><span className="ml-auto text-[10px] font-black opacity-60">{step+1}/5</span></div>
              <div className="h-2 overflow-hidden rounded-full border-2 border-[#0f172a] bg-white"><div className="h-full bg-[var(--primary)] transition-all" style={{width:((step+1)/STEPS.length*100)+"%",animation:"pulseGlow 1s ease infinite"}}/></div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-wide opacity-60"><span>Scan biru aktif</span><span>{Math.round((step+1)/STEPS.length*100)}%</span></div>
            </div>
          ) : saving ? (
            <div className="neo-card-soft bg-[var(--neo-sky)] p-3 flex items-center gap-2 text-xs font-black"><span className="h-4 w-4 rounded-full border-2 border-[#0f172a]/30 border-t-[#0f172a] animate-spin"/><span>Menyimpan ke History...</span></div>
          ) : (
            <div className="flex items-center justify-between"><span className="neo-badge bg-[var(--neo-mint)] inline-flex items-center gap-1"><Sparkles className="h-3 w-3"/> WebP 800px</span><span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Auto-save aktif</span></div>
          )}
        </div>
      )}
      {msg && <div role="status" className="mt-3 neo-card-soft bg-[#0f172a] text-white p-3 text-xs font-black whitespace-pre-wrap break-words">{msg}</div>}
    </div>
  </div>;
}
