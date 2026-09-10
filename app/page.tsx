"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { calcAll } from "@/lib/calculations";
import Link from "next/link";
import { User, Camera, CodeXml, Flame, HelpCircle, Eye, EyeOff } from "lucide-react";

export default function Home() {
  const r = useRouter();
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const s = createClient();
    s.auth.getUser().then(({ data: { user } }) => {
      if (user) r.replace("/profil");
      else setChecked(true);
    });
  }, [r]);

  const [form, setForm] = useState({
    nama: "",
    usia: "",
    gender: "pria" as "pria" | "wanita",
    bb: "",
    tb: "",
    tujuan: "stabilkan" as "stabilkan" | "turunkan" | "naikkan",
    targetBb: "",
    email: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const upd = (k: string, v: any) => setForm((s) => ({ ...s, [k]: v }));

  const nums = {
    usia: Number(form.usia) || 0,
    bb: Number(form.bb) || 0,
    tb: Number(form.tb) || 0,
  };
  const hasNums = nums.usia >= 13 && nums.bb > 0 && nums.tb > 0;
  const preview = useMemo(() => {
    if (!hasNums) return null;
    try { return calcAll(nums.bb, nums.tb, nums.usia, form.gender, form.tujuan); } catch { return null; }
  }, [nums.bb, nums.tb, nums.usia, form.gender, form.tujuan, hasNums]);
  const bmiLabel = !preview ? "—" : preview.status_bmi === "kurus" ? "Kurus" : preview.status_bmi === "normal" ? "Normal (Ideal)" : preview.status_bmi === "overweight" ? "Overweight" : "Obesitas";
  const bmiBg = !preview ? "bg-white" : preview.status_bmi === "kurus" ? "bg-[var(--neo-sky)]" : preview.status_bmi === "normal" ? "bg-[var(--neo-mint)]" : "bg-[var(--neo-coral)]";
  const bmiDesc = !preview ? "Isi usia, berat & tinggi untuk melihat pratinjau BMI." : preview.status_bmi === "normal" ? "Berat badan kamu ideal. Pertahankan pola makan seimbang dan aktivitas fisik!" : preview.status_bmi === "kurus" ? "Berat badan di bawah ideal — tambah asupan bergizi seimbang." : preview.status_bmi === "overweight" ? "Kelebihan berat — atur porsi & tingkatkan aktivitas." : "Obesitas — konsultasi pola makan sehat.";
  const showTargetBb = form.tujuan === "turunkan" || form.tujuan === "naikkan";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setLoading(true);
    if (!hasNums) { setErr("Usia (≥13), BB & TB wajib diisi dengan angka valid."); setLoading(false); return; }
    if (showTargetBb && !form.targetBb) { setErr("Target BB wajib diisi untuk tujuan naikkan/turunkan."); setLoading(false); return; }
    const supabase = createClient();
    try {
      const calc = calcAll(nums.bb, nums.tb, nums.usia, form.gender, form.tujuan);
      const { data, error } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { nama: form.nama, usia: String(nums.usia), gender: form.gender, bb: String(nums.bb), tb: String(nums.tb), tujuan: form.tujuan, target_bb: form.targetBb || String(nums.bb) } },
      });
      if (error) throw new Error(error.message);
      if (!data.user) throw new Error("signUp tidak mengembalikan user");
      if (!data.session) throw new Error("Akun dibuat tapi belum ada session — matikan Confirm email di Supabase Dashboard → Authentication → Providers → Email, atau cek inbox/spam lalu Login di /login.");
      const payload: any = { id: data.user.id, nama: form.nama, usia: nums.usia, gender: form.gender, bb: nums.bb, tb: nums.tb, tujuan: form.tujuan, bmi: calc.bmi, status_bmi: calc.status_bmi, bmr: calc.bmr, tdee: calc.tdee, target_kalori: calc.target_kalori };
      if (form.targetBb) payload.target_bb = Number(form.targetBb);
      const { error: upErr } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
      if (upErr) {
        const m = upErr.message.toLowerCase();
        if (m.includes("schema cache") || m.includes("could not find")) throw new Error(`${upErr.message} — Reload schema: jalankan SQL NOTIFY pgrst, 'reload schema' di Supabase SQL Editor project zxgegw... lalu rm -rf .next && npm run dev.`);
        throw new Error(upErr.message);
      }
      r.push("/profil");
    } catch (e: any) { setErr(String(e.message || e)); }
    setLoading(false);
  }

  if (!checked) return <div className="min-h-dvh grid place-items-center bg-white p-6"><div className="neo-card bg-white p-6 font-black text-sm">Memuat sesi...</div></div>;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#f8fafc]">
      <div className="flex min-h-dvh flex-col relative overflow-x-hidden pb-28">
        <main className="mx-auto mt-6 flex-1 w-full max-w-5xl grid gap-6 px-4 md:grid-cols-2">
          <section className="space-y-5 order-1 md:order-2">
            <div className="neo-card relative overflow-hidden p-7 bg-[var(--neo-lavender)]">
              <div className="neo-badge inline-flex items-center gap-1.5 bg-white text-[#0f172a] mb-3"><Flame className="h-3.5 w-3.5" /> Mulai PorsiSnap</div>
              <div className="text-2xl md:text-3xl font-black leading-tight text-[#0f172a]">Isi datamu dulu ya!</div>
              <p className="mt-2 text-sm font-semibold text-[#0f172a] leading-relaxed">Rekomendasi kalori & fitur foto makanan AI akan otomatis terbuka setelah kamu menyimpan profil di samping.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="neo-badge bg-white text-[#0f172a] !text-[10px]">Gratis</span>
                <span className="neo-badge bg-[var(--neo-mint)] text-[#0f172a] !text-[10px]">WebP 80KB</span>
                <span className="neo-badge bg-[var(--neo-peach)] text-[#0f172a] !text-[10px] inline-flex items-center gap-1"><Flame className="h-3 w-3" /> Streak</span>
              </div>
            </div>
            <div className="neo-card p-6 bg-[var(--neo-peach)]">
              <div className="flex items-center gap-2 text-base font-black text-[#0f172a]"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#0f172a] text-white"><HelpCircle className="h-3 w-3" /></span><span>Metode Perhitungan PorsiSnap</span></div>
              <ul className="mt-3 space-y-2 text-xs md:text-sm font-semibold text-slate-800">
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#0f172a] shrink-0" /><span>BMR dihitung dengan formula baku Mifflin–St Jeor.</span></li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#0f172a] shrink-0" /><span>Kebutuhan harian disesuaikan faktor aktivitas harian (1.55x).</span></li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#0f172a] shrink-0" /><span>Defisit / Surplus sehat berkisar ±500 kalori per hari.</span></li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#0f172a] shrink-0" /><span>Contoh: 18th • 53kg • 181cm • Pria → BMR 1576 • TDEE 2443 • Target 2943 (naikkan).</span></li>
              </ul>
            </div>
          </section>

          <section className="neo-card p-6 md:p-8 h-fit order-2 md:order-1 bg-white">
            <div className="neo-badge inline-flex items-center gap-1.5 bg-[var(--neo-mint)] text-[#0f172a] mb-3">Langkah Awal</div>
            <h1 className="text-2xl sm:text-3xl font-black leading-tight text-[#0f172a]">Kenalan dulu, yuk! <br /><span className="text-[var(--primary)]">Biar kalorimu pas.</span></h1>
            <p className="mt-2 text-xs sm:text-sm font-medium text-slate-600">Isi datamu untuk membuka fitur foto makanan & rekomendasi kalori harian yang dipersonalisasi.</p>

            <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
              <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Nama Lengkap / Panggilan</span><input className="neo-input" placeholder="Contoh: Budi" required value={form.nama} onChange={(e) => upd("nama", e.target.value)} /></label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Usia</span><input className="neo-input" type="number" min={13} max={100} required placeholder="Contoh: 18" value={form.usia} onChange={(e) => upd("usia", e.target.value)} /></label>
                <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Jenis Kelamin</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => upd("gender", "wanita")} className={`neo-btn flex-1 !p-2 text-xs font-extrabold ${form.gender === "wanita" ? "!bg-[var(--neo-lavender)] text-[#0f172a]" : "bg-white"}`}>Wanita</button>
                    <button type="button" onClick={() => upd("gender", "pria")} className={`neo-btn flex-1 !p-2 text-xs font-extrabold ${form.gender === "pria" ? "!bg-[var(--neo-lavender)] text-[#0f172a]" : "bg-white"}`}>Pria</button>
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Berat Badan (kg)</span><input className="neo-input" type="number" min={20} max={300} step="0.1" required placeholder="Contoh: 53" value={form.bb} onChange={(e) => upd("bb", e.target.value)} /></label>
                <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Tinggi Badan (cm)</span><input className="neo-input" type="number" min={100} max={250} required placeholder="Contoh: 181" value={form.tb} onChange={(e) => upd("tb", e.target.value)} /></label>
              </div>

              <div className={`neo-card-soft p-3.5 ${bmiBg} transition-colors`}>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Pratinjau Status BMI Anda</div>
                <div className="mt-1 flex items-baseline gap-2"><span className="text-lg font-black">{bmiLabel}</span><span className="text-xs font-black">{preview ? `(${preview.bmi})` : ""}</span></div>
                <p className="mt-1 text-[11px] font-bold leading-relaxed">{bmiDesc}{preview ? ` • Target ${preview.target_kalori} kkal` : ""}</p>
              </div>

              <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Tujuan Kalori</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["stabilkan", "turunkan", "naikkan"] as const).map((v) => (
                    <button key={v} type="button" onClick={() => upd("tujuan", v)} className={`neo-btn !py-2.5 !px-1 text-xs font-black capitalize ${form.tujuan === v ? "!bg-[#0f172a] !text-white" : "bg-white"}`}>{v}</button>
                  ))}
                </div>
              </label>

              {showTargetBb && (
                <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Target BB (kg) • wajib jika naikkan/turunkan</span><input className="neo-input" type="number" min={20} max={300} step="0.1" required placeholder={form.tujuan === "naikkan" ? "Contoh: 60" : "Contoh: 50"} value={form.targetBb} onChange={(e) => upd("targetBb", e.target.value)} /></label>
              )}

              <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Email</span><input className="neo-input" type="email" required placeholder="kamu@email.com" value={form.email} onChange={(e) => upd("email", e.target.value)} /></label>

              <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Password</span>
                <div className="relative">
                  <input className="neo-input !pr-12" type={showPass ? "text" : "password"} required placeholder="••••••••" value={form.password} onChange={(e) => upd("password", e.target.value)} />
                  <button type="button" aria-label={showPass ? "sembunyikan password" : "lihat password"} onClick={() => setShowPass((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full border-2 border-[#0f172a] bg-white">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {err && <div role="alert" className="neo-card-soft bg-[var(--neo-coral)] p-3 text-xs font-black whitespace-pre-wrap break-words">{err}</div>}
              <button type="submit" disabled={loading} className="neo-btn w-full bg-[var(--primary)] text-white !rounded-full min-h-[56px] text-base disabled:opacity-60">{loading ? "Memproses..." : "Mulai PorsiSnap →"}</button>
              <p className="text-center text-xs font-bold">Sudah punya akun? <Link href="/login" className="font-black underline decoration-2 underline-offset-4">Masuk</Link></p>
            </form>
          </section>
        </main>
      </div>
      <div className="fixed bottom-0 sm:bottom-6 left-0 right-0 mx-auto w-full sm:w-[92%] sm:max-w-[460px] z-40 pointer-events-none px-0 sm:px-2">
        <nav className="pointer-events-auto relative grid h-[68px] sm:h-[66px] w-full items-center rounded-none sm:rounded-full border-t-[2.5px] sm:border-[2.5px] border-[#0f172a] bg-white/98 sm:bg-white/95 px-2 pb-1 sm:pb-0 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:shadow-[0_10px_30px_rgba(0,0,0,0.15),4px_4px_0px_#0f172a] backdrop-blur-xl grid-cols-3">
          <Link href="/profil" className="relative flex flex-col items-center justify-center h-full z-10 w-full py-1"><User className="h-5 w-5 text-slate-600" /><span className="text-[9px] font-black uppercase tracking-wider text-slate-600">Profil</span></Link>
          <div className="relative flex h-full flex-col items-center justify-end pb-1.5"><Link href="/foto" className="-top-7 absolute z-20"><div className="flex h-[58px] w-[58px] items-center justify-center rounded-full border-[2.5px] border-[#0f172a] bg-[var(--primary)] text-white shadow-[0_6px_16px_rgba(37,99,235,0.35),3px_3px_0px_#0f172a]"><Camera className="h-6 w-6 stroke-[2.5]" /></div></Link><span className="pt-1 text-[9px] uppercase tracking-wider font-black text-slate-500">Foto</span></div>
          <Link href="/dev" className="relative flex flex-col items-center justify-center h-full z-10 w-full py-1"><CodeXml className="h-5 w-5 text-slate-600" /><span className="text-[9px] font-black uppercase tracking-wider text-slate-600">Dev</span></Link>
        </nav>
      </div>
    </div>
  );
}
