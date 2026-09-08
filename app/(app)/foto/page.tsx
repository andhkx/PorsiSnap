"use client";
import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { compressToWebp } from "@/lib/compress";
import Button from "@/components/UI/Button";
import Card from "@/components/UI/Card";
import Link from "next/link";

type Food = { name: string; calories: number; portion?: string };

export default function FotoPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ foods: Food[]; total_calories: number; notes?: string } | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [tanggal, setTanggal] = useState(() => new Date().toISOString().slice(0, 10));
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setMsg(""); setResult(null); setFotoUrl(null);
    const c = await compressToWebp(f, 800, 0.7);
    setBlob(c);
    setPreview(URL.createObjectURL(c));
  }

  async function analyze() {
    if (!blob) return;
    setLoading(true); setMsg("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("belum login");
      const path = `${user.id}/${Date.now()}.webp`;
      const { error: upErr } = await supabase.storage.from("food-photos").upload(path, blob, { contentType: "image/webp", upsert: false });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("food-photos").getPublicUrl(path);
      setFotoUrl(pub.publicUrl);
      const fd = new FormData();
      fd.append("file", new File([blob], "food.webp", { type: "image/webp" }));
      const r = await fetch("/api/gemini/analyze", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "gagal analisis");
      setResult({ foods: j.foods || [], total_calories: j.total_calories || 0, notes: j.notes });
    } catch (e: any) { setMsg(e.message || "error"); }
    setLoading(false);
  }

  async function save() {
    if (!result) return;
    setSaving(true); setMsg("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const waktu = new Date().toTimeString().slice(0, 8);
      for (const f of result.foods) {
        const { error } = await supabase.from("kalori_intake").insert({
          user_id: user!.id, tanggal, waktu, nama_makanan: f.name, kalori: Math.round(f.calories), sumber: "ai", foto_url: fotoUrl,
        });
        if (error) throw error;
      }
      setMsg(`Tersimpan ${result.foods.length} item • ${result.total_calories} kkal`);
      setTimeout(() => { location.href = "/history"; }, 800);
    } catch (e: any) { setMsg(e.message); }
    setSaving(false);
  }

  function editFood(i: number, k: "name" | "calories", v: string) {
    if (!result) return;
    const foods = [...result.foods];
    if (k === "name") foods[i].name = v; else foods[i].calories = parseInt(v) || 0;
    const total = foods.reduce((a, b) => a + (b.calories || 0), 0);
    setResult({ ...result, foods, total_calories: total });
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="font-black uppercase text-2xl">Snap Foto</h1>
        <Link href="/history" className="border-[3px] border-black bg-white px-3 py-2 font-black uppercase text-xs">Riwayat →</Link>
      </div>
      <Card>
        <label className="font-black uppercase text-xs">Tanggal</label>
        <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} className="w-full border-[3px] border-black bg-white px-4 py-3 font-bold text-sm" />
        <div className="mt-3 grid gap-3">
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} className="hidden" />
          <button onClick={() => fileRef.current?.click()} className="w-full border-[3px] border-black bg-[#FFBE0B] px-6 py-4 font-black uppercase text-sm shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1">📸 Pilih / Foto Makanan</button>
          {preview && <img src={preview} alt="preview" className="w-full border-[3px] border-black max-h-[360px] object-cover" />}
          <Button onClick={analyze} disabled={!blob || loading} size="lg">{loading ? "Menganalisis..." : "Analisis dengan Gemini →"}</Button>
        </div>
        {msg && <div className="mt-3 bg-black text-white border-[3px] border-black p-2 font-bold text-xs">{msg}</div>}
      </Card>

      {result && (
        <Card className="bg-white">
          <h2 className="font-black uppercase">Hasil Analisis • {result.total_calories} kkal</h2>
          {result.notes && <p className="font-semibold text-xs mt-1">{result.notes}</p>}
          <div className="mt-3 space-y-2">
            {result.foods.map((f, i) => (
              <div key={i} className="flex gap-2 border-[3px] border-black p-2 bg-[#F5F5F5] items-center">
                <input value={f.name} onChange={e => editFood(i, "name", e.target.value)} className="flex-1 border-[2px] border-black px-2 py-2 font-bold text-sm" />
                <input type="number" value={f.calories} onChange={e => editFood(i, "calories", e.target.value)} className="w-24 border-[2px] border-black px-2 py-2 font-black text-sm text-center" />
                <span className="font-black text-xs">kkal</span>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Button onClick={save} disabled={saving} size="lg">{saving ? "Menyimpan..." : `Simpan ${result.foods.length} Item → History`}</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
