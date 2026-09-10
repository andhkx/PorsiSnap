"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { calcAll } from "@/lib/calculations";
import Link from "next/link";
import { User, Camera, CodeXml } from "lucide-react";

export default function RegisterPage() {
  const r = useRouter();
  const [form, setForm] = useState({ email:"", password:"", nama:"", usia:25, gender:"pria" as "pria"|"wanita", bb:60, tb:165, tujuan:"stabilkan" as "stabilkan"|"turunkan"|"naikkan" });
  const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);
  const set = (k:string,v:any)=> setForm(s=>({...s,[k]:v}));
  const preview = useMemo(()=> calcAll(Number(form.bb),Number(form.tb),Number(form.usia),form.gender,form.tujuan), [form.bb,form.tb,form.usia,form.gender,form.tujuan]);
  const bmiLabel = preview.status_bmi==="kurus"?"Kurus":preview.status_bmi==="normal"?"Normal (Ideal)":preview.status_bmi==="overweight"?"Overweight":"Obesitas";
  const bmiBg = preview.status_bmi==="normal"?"bg-[var(--neo-mint)]":preview.status_bmi==="kurus"?"bg-[var(--neo-peach)]":"bg-[var(--neo-coral)]";
  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setErr(""); setLoading(true);
    const supabase=createClient();
    try{
      const { data, error } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { nama: form.nama, usia: String(form.usia), gender: form.gender, bb: String(form.bb), tb: String(form.tb), tujuan: form.tujuan } }
      });
      if(error) throw new Error(error.message);
      if(!data.user) throw new Error("signUp tidak mengembalikan user");
      if(!data.session) throw new Error("Akun dibuat tapi belum ada session — matikan Confirm email di Supabase Auth atau cek inbox/spam lalu Login.");
      const payload={ id:data.user.id, nama:form.nama, usia:Number(form.usia), gender:form.gender, bb:Number(form.bb), tb:Number(form.tb), tujuan:form.tujuan, bmi:preview.bmi, status_bmi:preview.status_bmi, bmr:preview.bmr, tdee:preview.tdee, target_kalori:preview.target_kalori };
      const { error: upErr } = await supabase.from("profiles").upsert(payload, { onConflict:"id" });
      if(upErr){
        const m=upErr.message.toLowerCase();
        if(m.includes("schema cache")||m.includes("could not find")) throw new Error(`${upErr.message} — Stop dev server, rm -rf .next, npm run dev. Di Vercel pastikan env pakai zxgegw... lalu Redeploy.`);
        throw new Error(upErr.message);
      }
      r.push("/profil");
    }catch(e:any){ setErr(String(e.message||e)); }
    setLoading(false);
  }
  return (
    <div className="min-h-dvh bg-white">
      <div className="flex min-h-dvh flex-col pb-28">
        <main className="mx-auto mt-6 flex-1 w-full max-w-5xl grid gap-6 px-4 md:grid-cols-2">
          <section className="space-y-5 order-1 md:order-2">
            <div className="neo-card p-7 bg-[var(--neo-lavender)]">
              <div className="neo-badge bg-white inline-block">Mulai PorsiSnap</div>
              <div className="mt-3 text-2xl md:text-3xl font-black leading-tight">Isi datamu dulu ya!</div>
              <p className="mt-2 text-sm font-semibold leading-relaxed">Rekomendasi kalori & fitur foto AI otomatis terbuka setelah kamu menyimpan profil di samping.</p>
            </div>
            <div className="neo-card bg-white p-6">
              <div className="flex items-center gap-2 font-black"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#0f172a] text-[10px] text-white">?</span> Metode Perhitungan PorsiSnap</div>
              <ul className="mt-3 space-y-2 text-xs md:text-sm font-semibold text-slate-700">
                <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-[#0f172a] shrink-0"/><span>BMR formula Mifflin–St Jeor, TDEE ×1.55, ±500 kkal.</span></li>
                <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-[#0f172a] shrink-0"/><span>Streak +1 jika 85–105% target (turunkan) / ≥95% (naikkan).</span></li>
                <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-[#0f172a] shrink-0"/><span>Foto kompres WebP 800px ~80KB hemat storage.</span></li>
              </ul>
            </div>
          </section>
          <section className="neo-card h-fit bg-white p-6 md:p-8 order-2 md:order-1">
            <div className="neo-badge bg-[var(--neo-mint)] inline-block">Langkah Awal</div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-black leading-tight">Kenalan dulu, yuk! <br/><span className="text-[var(--primary)]">Biar kalorimu pas.</span></h1>
            <p className="mt-2 text-xs sm:text-sm font-medium text-slate-600">Isi datamu untuk membuka fitur foto & rekomendasi harian.</p>
            <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
              <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Nama Lengkap / Panggilan</span><input className="neo-input" placeholder="Contoh: Budi" required value={form.nama} onChange={e=>set("nama",e.target.value)} /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Usia</span><input className="neo-input" type="number" min={13} max={100} required value={form.usia} onChange={e=>set("usia",e.target.value)} /></label>
                <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Jenis Kelamin</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={()=>set("gender","wanita")} className={`neo-btn flex-1 !p-2 text-xs font-extrabold ${form.gender==="wanita"?"!bg-[var(--neo-lavender)] text-[#0f172a]":"bg-white"}`}>Wanita</button>
                    <button type="button" onClick={()=>set("gender","pria")} className={`neo-btn flex-1 !p-2 text-xs font-extrabold ${form.gender==="pria"?"!bg-[var(--neo-lavender)] text-[#0f172a]":"bg-white"}`}>Pria</button>
                  </div>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Berat Badan (kg)</span><input className="neo-input" type="number" min={20} max={300} required value={form.bb} onChange={e=>set("bb",e.target.value)} /></label>
                <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Tinggi Badan (cm)</span><input className="neo-input" type="number" min={100} max={250} required value={form.tb} onChange={e=>set("tb",e.target.value)} /></label>
              </div>
              <div className={`neo-card-soft p-3.5 ${bmiBg}`}>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Pratinjau Status BMI Anda</div>
                <div className="mt-1 flex items-baseline gap-2"><span className="text-lg font-black">{bmiLabel}</span><span className="text-xs font-black">({preview.bmi})</span></div>
                <p className="mt-1 text-[11px] font-bold leading-relaxed">{preview.status_bmi==="normal"?"Berat ideal. Pertahankan pola makan seimbang!":preview.status_bmi==="kurus"?"Tambah asupan bergizi.":preview.status_bmi==="overweight"?"Atur porsi & aktivitas harian.":"Konsultasi pola makan sehat."} • Target {preview.target_kalori} kkal</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block sm:col-span-2"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Email</span><input className="neo-input" type="email" required value={form.email} onChange={e=>set("email",e.target.value)} placeholder="kamu@email.com" /></label>
                <label className="block sm:col-span-2"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Password</span><input className="neo-input" type="password" required value={form.password} onChange={e=>set("password",e.target.value)} placeholder="••••••••" /></label>
              </div>
              <label className="block"><span className="mb-1 block text-xs font-black uppercase tracking-wider">Tujuan Kalori</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["stabilkan","turunkan","naikkan"] as const).map(v=>(
                    <button key={v} type="button" onClick={()=>set("tujuan",v)} className={`neo-btn !py-2.5 !px-1 text-xs font-black capitalize ${form.tujuan===v?"!bg-[#0f172a] !text-white":"bg-white"}`}>{v}</button>
                  ))}
                </div>
              </label>
              {err && <div role="alert" className="neo-card-soft bg-[var(--neo-coral)] p-3 text-xs font-black whitespace-pre-wrap break-words">{err}</div>}
              <button type="submit" disabled={loading} className="neo-btn w-full bg-[var(--primary)] text-white !rounded-full min-h-[56px] text-base">{loading?"Memproses...":"Mulai PorsiSnap →"}</button>
              <p className="text-center text-xs font-bold">Sudah punya akun? <Link href="/login" className="font-black underline decoration-2 underline-offset-4">Masuk</Link></p>
            </form>
          </section>
        </main>
      </div>
      <div className="fixed bottom-0 sm:bottom-6 left-0 right-0 mx-auto w-full sm:w-[92%] sm:max-w-[460px] z-40 pointer-events-none px-0 sm:px-2">
        <nav className="pointer-events-auto grid h-[68px] w-full grid-cols-3 items-center rounded-none sm:rounded-full border-t-[2.5px] sm:border-[2.5px] border-[#0f172a] bg-white/98 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-xl">
          <Link href="/profil" className="flex flex-col items-center"><User className="h-5 w-5" /><span className="text-[9px] font-black uppercase">Profil</span></Link>
          <div className="flex flex-col items-center"><Link href="/foto" className="-top-7 absolute"><span className="grid h-[58px] w-[58px] place-items-center rounded-full border-[2.5px] border-[#0f172a] bg-[var(--primary)] text-white shadow-[3px_3px_0px_#0f172a]"><Camera className="h-6 w-6" /></span></Link><span className="pt-6 text-[9px] font-black uppercase text-slate-500">Foto</span></div>
          <Link href="/dev" className="flex flex-col items-center"><CodeXml className="h-5 w-5" /><span className="text-[9px] font-black uppercase">Dev</span></Link>
        </nav>
      </div>
    </div>
  );
}
