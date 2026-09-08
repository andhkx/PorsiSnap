import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });
  const key = process.env.GEMINI_API_KEY!;
  if (!key) return NextResponse.json({ error: "no gemini key" }, { status: 500 });
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const mime = file.type || "image/webp";
  const prompt = `Analisis foto makanan ini untuk PorsiSnap. Identifikasi SEMUA makanan/minuman dan estimasi kalori AKURAT.
Format response HANYA JSON (no markdown, no text): { "foods": [ {"name": "nama makanan", "calories": 250, "portion": "1 piring"} ], "total_calories": 350, "notes": "catatan", "confidence": "high" }
PENTING: Gunakan porsi standar Indonesia. Estimasi konservatif (jangan underestimate). Hanya JSON, tidak ada text lain!`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: mime, data: base64 } }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
    }),
  });
  const j = await r.json();
  if (!r.ok) return NextResponse.json({ error: j.error?.message || "gemini error", raw: j }, { status: 500 });
  let text: string = j.candidates?.[0]?.content?.parts?.[0]?.text || "";
  text = text.replace(/```json|```/g, "").trim();
  const s = text.indexOf("{"), e = text.lastIndexOf("}");
  if (s !== -1 && e !== -1) text = text.slice(s, e + 1);
  let parsed: any;
  try { parsed = JSON.parse(text); } catch { return NextResponse.json({ error: "parse fail", raw: text }, { status: 500 }); }
  if (!Array.isArray(parsed.foods)) parsed.foods = [];
  if (typeof parsed.total_calories !== "number") parsed.total_calories = parsed.foods.reduce((a:number,b:any)=>a+(b.calories||0),0);
  return NextResponse.json(parsed);
}
