import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getKey() {
  const raw = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "").trim();
  return raw.replace(/^["']|["']$/g, "").trim();
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauth — silakan login dulu di /login" }, { status: 401 });

    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "file tidak ada — pilih foto dulu" }, { status: 400 });
    if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: `file kebesaran ${(file.size/1024/1024).toFixed(1)}MB — max 8MB` }, { status: 400 });

    const key = getKey();
    if (!key) {
      console.error("[gemini] GEMINI_API_KEY kosong — cek Vercel Env Production + redeploy");
      return NextResponse.json({ error: "GEMINI_API_KEY belum di-set di Vercel (Production) — isi di Vercel Dashboard → Settings → Environment Variables → GEMINI_API_KEY lalu Redeploy tanpa cache" }, { status: 500 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mime = file.type || "image/jpeg";

    const prompt = `Analisis foto makanan ini untuk PorsiSnap. Identifikasi SEMUA makanan/minuman dan estimasi kalori AKURAT.
HANYA balas JSON valid tanpa markdown/code fence:
{"foods":[{"name":"nama makanan","calories":250,"portion":"1 piring"}],"total_calories":350,"notes":"catatan singkat"}
Aturan: porsi standar Indonesia, konservatif jangan underestimate, calories integer >0.`;

    const models = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-flash-latest", "gemini-2.5-flash-lite"];
    let lastErr: any = null;
    let lastStatus = 500;
    let lastRaw: any = null;

    for (const model of models) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      let r: Response;
      try {
        r = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: mime, data: base64 } }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
          }),
        });
      } catch (e: any) {
        lastErr = `fetch ${model} gagal: ${String(e?.message || e)}`;
        lastStatus = 500;
        continue;
      }

      const j: any = await r.json().catch(() => ({}));
      if (!r.ok) {
        const msg = j?.error?.message || j?.error || `HTTP ${r.status}`;
        console.error(`[gemini] ${model} ${r.status}:`, msg);
        lastErr = String(msg);
        lastRaw = j;
        lastStatus = r.status;
        if (r.status === 404) continue;
        if (r.status === 400 && String(msg).toLowerCase().includes("model")) continue;
        if (r.status === 429) {
          return NextResponse.json({ error: "Gemini rate limit — coba lagi 30 detik", raw: j }, { status: 429 });
        }
        if (r.status === 403 || r.status === 401) {
          return NextResponse.json({ error: `API key ditolak (${r.status}): ${msg} — cek Vercel GEMINI_API_KEY benar dan punya akses Generative Language API. Cek di Google AI Studio → Get API key.`, raw: j }, { status: 500 });
        }
        continue;
      }

      let text: string = j?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!text && Array.isArray(j?.candidates?.[0]?.content?.parts)) {
        text = j.candidates[0].content.parts.map((p: any) => p.text || "").join("");
      }
      if (!text) {
        lastErr = "Gemini return kosong — mungkin foto diblok safety filter";
        lastRaw = j;
        continue;
      }

      text = String(text).replace(/```json|```/g, "").trim();
      const s = text.indexOf("{"), e = text.lastIndexOf("}");
      if (s !== -1 && e !== -1 && e > s) text = text.slice(s, e + 1);

      let parsed: any;
      try { parsed = JSON.parse(text); }
      catch {
        console.error("[gemini] parse fail", text.slice(0, 400));
        lastErr = "Gemini tidak mengembalikan JSON valid";
        lastRaw = text.slice(0, 800);
        continue;
      }

      if (!Array.isArray(parsed.foods)) parsed.foods = [];
      parsed.foods = parsed.foods.map((f: any) => ({
        name: String(f.name || f.nama || "").trim() || "Makanan",
        calories: Math.max(1, Math.round(Number(f.calories || f.kalori || 0) || 0)),
        portion: f.portion ? String(f.portion) : undefined,
      })).filter((f: any) => f.calories > 0 && f.name.length > 1);

      if (parsed.foods.length === 0) {
        lastErr = "AI tidak mendeteksi makanan — coba foto lebih jelas, dekat, pencahayaan terang";
        lastRaw = parsed;
        continue;
      }

      if (typeof parsed.total_calories !== "number" || parsed.total_calories <= 0) {
        parsed.total_calories = parsed.foods.reduce((a: number, b: any) => a + (b.calories || 0), 0);
      }
      return NextResponse.json(parsed);
    }

    return NextResponse.json({ error: lastErr || "Gagal analisis foto setelah coba semua model", raw: lastRaw, hint: "Cek Vercel logs (Runtime → /api/gemini/analyze), pastikan GEMINI_API_KEY valid untuk generativelanguage.googleapis.com. Test key di https://aistudio.google.com/app/apikey" }, { status: lastStatus || 500 });
  } catch (e: any) {
    console.error("[gemini] unhandled", e);
    return NextResponse.json({ error: "Server error: " + String(e?.message || e) }, { status: 500 });
  }
}
