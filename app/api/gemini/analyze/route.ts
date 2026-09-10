import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauth — silakan login dulu" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "file tidak ada" }, { status: 400 });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ error: "GEMINI_API_KEY belum di-set di .env.local / Vercel Env" }, { status: 500 });

  let bytes: ArrayBuffer;
  try { bytes = await file.arrayBuffer(); } catch { return NextResponse.json({ error: "gagal baca file" }, { status: 400 }); }
  const base64 = Buffer.from(bytes).toString("base64");
  const mime = file.type || "image/webp";

  const prompt = `Analisis foto makanan ini untuk PorsiSnap. Identifikasi SEMUA makanan/minuman dan estimasi kalori AKURAT.
Format response HANYA JSON valid tanpa markdown:
{"foods":[{"name":"nama makanan","calories":250,"portion":"1 piring"}],"total_calories":350,"notes":"catatan singkat","confidence":"high"}
Aturan: porsi standar Indonesia, estimasi konservatif jangan underestimate, hanya JSON.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
  let r: Response;
  try {
    r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }, { inlineData: { mimeType: mime, data: base64 } }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024, responseMimeType: "application/json" },
      }),
    });
  } catch (e: any) {
    return NextResponse.json({ error: "gagal hubungi Gemini: " + String(e?.message || e) }, { status: 500 });
  }

  const j = await r.json().catch(() => ({} as any));
  if (!r.ok) {
    const msg = j?.error?.message || j?.error || "gemini error";
    return NextResponse.json({ error: String(msg), raw: j, status: r.status }, { status: 500 });
  }

  let text: string = j?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  if (!text && j?.candidates?.[0]?.content?.parts) {
    text = j.candidates[0].content.parts.map((p: any) => p.text || "").join("");
  }
  text = String(text).replace(/```json|```/g, "").trim();
  const s = text.indexOf("{"), e = text.lastIndexOf("}");
  if (s !== -1 && e !== -1 && e > s) text = text.slice(s, e + 1);

  let parsed: any;
  try { parsed = JSON.parse(text); } catch (err: any) {
    return NextResponse.json({ error: "parse fail — Gemini tidak return JSON valid", raw: String(text).slice(0, 800) }, { status: 500 });
  }
  if (!Array.isArray(parsed.foods)) parsed.foods = [];
  parsed.foods = parsed.foods.map((f: any) => ({
    name: String(f.name || f.nama || "Makanan").trim(),
    calories: Math.max(1, Math.round(Number(f.calories || f.kalori || 0) || 0)),
    portion: f.portion ? String(f.portion) : undefined,
  })).filter((f: any) => f.calories > 0 && f.name.length > 1);
  if (parsed.foods.length === 0) return NextResponse.json({ error: "Gemini tidak mendeteksi makanan — coba foto lebih jelas", raw: parsed }, { status: 422 });
  if (typeof parsed.total_calories !== "number" || parsed.total_calories <= 0) {
    parsed.total_calories = parsed.foods.reduce((a: number, b: any) => a + (b.calories || 0), 0);
  }
  return NextResponse.json(parsed);
}
