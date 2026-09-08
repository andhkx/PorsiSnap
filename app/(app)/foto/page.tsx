"use client";
import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { compressToWebp } from "@/lib/compress";
import Button from "@/components/UI/Button";
import Card from "@/components/UI/Card";
import Link from "next/link";
type Food = { name: string; calories: number; portion?: string };
export default function FotoPage(){
  const [preview,setPreview]=useState<string|null>(null);
  const [blob,setBlob]=useState<Blob|null>(null);
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState<{foods:Food[];total_calories:number;notes?:string}|null>(null);
  const [fotoUrl,setFotoUrl]=useState<string|null>(null);
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState("");
  const [tanggal,setTanggal]=useState(()=>new Date().toISOString().slice(0,10));
  const ref=useRef<HTMLInputElement>(null);
  async function onFile(e:React.ChangeEvent<HTMLInputElement>){
    const f=e.target.files?.[0]; if(!f) return;
    setMsg(""); setResult(null); setFotoUrl(null);
    const c=await compressToWebp(f,800,0.7); setBlob(c); setPreview(URL.createObjectURL(c));
  }
  async function analyze(){
    if(!blob) return; setLoading(true); setMsg("");
    try{
      const s=createClient(); const {data:{user}}=await s.auth.getUser(); if(!user) throw new Error("belum login");
      const path=`${user.id}/${Date.now()}.webp`;
      const {error:upErr}=await s.storage.from("food-photos").upload(path,blob,{contentType:"image/webp",upsert:false});
      if(upErr) throw upErr;
      const {data:pub}=s.storage.from("food-photos").getPublicUrl(path); setFotoUrl(pub.publicUrl);
      const fd=new FormData(); fd.append("file", new File([blob],"food.webp",{type:"image/webp"}));
      const r=await fetch("/api/gemini/analyze",{method:"POST",body:fd}); const j=await r.json();
      if(!r.ok) throw new Error(j.error||"gagal analisis");
      setResult({foods:j.foods||[],total_calories:j.total_calories||0,notes:j.notes});
    }catch(e:any){ setMsg(e.message||"error"); }
    setLoading(false);
  }
  async function save(){
    if(!result) return; setSaving(true); setMsg("");
    try{
      const s=createClient(); const {data:{user}}=await s.auth.getUser();
      const waktu=new Date().toTimeString().slice(0,8);
      for(const f of result.foods){
        const {error}=await s.from("kalori_intake").insert({user_id:user!.id,tanggal,waktu,nama_makanan:f.name,kalori:Math.round(f.calories),sumber:"ai",foto_url:fotoUrl});
        if(error) throw error;
      }
      setMsg(`Tersimpan ${result.foods.length} item • ${result.total_calories} kkal ✓`);
      setTimeout(()=>location.href="/history",800);
    }catch(e:any){ setMsg(e.message); }
    setSaving(false);
  }
  function edit(i:number,k:"name"|"calories",v:string){
    if(!result) return; const foods=[...result.foods];
    if(k==="name") foods[i].name=v; else foods[i].calories=parseInt(v)||0;
    setResult({...result,foods,total_calories:foods.reduce((a,b)=>a+(b.calories||0),0)});
  }
  return <div className="mx-auto max-w-[480px] md:max-w-3xl p-4 space-y-4">
    <div className="flex items-center justify-between gap-3">
      <h1 className="text-2xl font-black uppercase tracking-tight">Snap Foto</h1>
      <Link href="/history" className="rounded-[9999px] border-[3px] border-[#0f172a] bg-white px-4 py-2 text-xs font-black uppercase">Riwayat →</Link>
    </div>
    <Card className="rounded-[24px]">
      <label className="text-[11px] font-black uppercase tracking-widest">Tanggal</label>
      <input type="date" value={tanggal} onChange={e=>setTanggal(e.target.value)} className="mt-1 w-full rounded-[16px] border-[3px] border-[#0f172a] bg-white px-4 py-3 text-sm font-black" />
      <div className="mt-3 grid gap-3">
        <input ref={ref} type="file" accept="image/*" capture="environment" onChange={onFile} className="hidden" />
        <button onClick={()=>ref.current?.click()} className="w-full rounded-[20px] border-[3px] border-[#0f172a] bg-[#FFBE0B] px-6 py-4 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0px_#0f172a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">📸 Pilih / Foto Makanan</button>
        {preview && <img src={preview} alt="preview" className="w-full rounded-[20px] border-[3px] border-[#0f172a] max-h-[360px] object-cover" />}
        <Button onClick={analyze} disabled={!blob||loading} size="lg">{loading?"Menganalisis...":"Analisis dengan Gemini →"}</Button>
      </div>
      {msg && <div className="mt-3 rounded-[16px] bg-[#0f172a] text-white p-3 text-xs font-black">{msg}</div>}
    </Card>
    {result && <Card className="rounded-[24px] bg-white">
      <h2 className="text-sm font-black uppercase tracking-widest">Hasil • {result.total_calories} kkal</h2>
      {result.notes && <p className="mt-1 text-xs font-bold opacity-60">{result.notes}</p>}
      <div className="mt-3 space-y-2">
        {result.foods.map((f,i)=>(
          <div key={i} className="flex items-center gap-2 rounded-[16px] border-[3px] border-[#0f172a] bg-[#f8fafc] p-2">
            <input value={f.name} onChange={e=>edit(i,"name",e.target.value)} className="flex-1 rounded-[12px] border-[3px] border-[#0f172a] bg-white px-3 py-2 text-sm font-black" />
            <input type="number" value={f.calories} onChange={e=>edit(i,"calories",e.target.value)} className="w-24 rounded-[12px] border-[3px] border-[#0f172a] bg-white px-2 py-2 text-center text-sm font-black" />
            <span className="text-xs font-black">kkal</span>
          </div>
        ))}
      </div>
      <div className="mt-3"><Button onClick={save} disabled={saving} size="lg">{saving?"Menyimpan...":`Simpan ${result.foods.length} Item → History`}</Button></div>
    </Card>}
  </div>;
}
