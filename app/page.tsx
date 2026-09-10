import Link from "next/link";
import { User, Camera, CodeXml, Flame, HelpCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white">
      <div className="flex min-h-dvh flex-col relative overflow-x-hidden pb-28">
        <main className="mx-auto mt-6 flex-1 w-full max-w-5xl grid gap-6 px-4 md:grid-cols-2">
          <section className="space-y-5 order-1 md:order-2">
            <div className="neo-card relative overflow-hidden p-7 bg-[var(--neo-lavender)]">
              <div className="neo-badge inline-flex items-center gap-1.5 bg-white text-[#0f172a] mb-3"><Flame className="h-3.5 w-3.5" /> Mulai PorsiSnap</div>
              <div className="text-2xl md:text-3xl font-black leading-tight text-[#0f172a]">Isi datamu dulu ya!</div>
              <p className="mt-2 text-sm font-semibold text-[#0f172a] leading-relaxed">
                Rekomendasi kalori &amp; fitur foto makanan AI akan otomatis terbuka setelah kamu menyimpan profil di samping.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="neo-badge bg-white text-[#0f172a] !text-[10px]">Gratis</span>
                <span className="neo-badge bg-[var(--neo-mint)] text-[#0f172a] !text-[10px]">WebP 80KB</span>
                <span className="neo-badge bg-[var(--neo-peach)] text-[#0f172a] !text-[10px] inline-flex items-center gap-1"><Flame className="h-3 w-3" /> Streak</span>
              </div>
            </div>
            <div className="neo-card p-6 bg-white">
              <div className="flex items-center gap-2 text-base font-black text-[#0f172a]">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#0f172a] text-white"><HelpCircle className="h-3 w-3" /></span>
                <span>Metode Perhitungan PorsiSnap</span>
              </div>
              <ul className="mt-3 space-y-2 text-xs md:text-sm font-semibold text-slate-700">
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#0f172a] shrink-0" /><span>BMR dihitung dengan formula baku Mifflin–St Jeor.</span></li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#0f172a] shrink-0" /><span>Kebutuhan harian disesuaikan faktor aktivitas harian (1.55x).</span></li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#0f172a] shrink-0" /><span>Defisit / Surplus sehat berkisar ±500 kalori per hari.</span></li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#0f172a] shrink-0" /><span>Streak +1 jika 85–105% target (turunkan) / ≥95% (naikkan).</span></li>
              </ul>
            </div>
          </section>

          <section className="neo-card p-6 md:p-8 h-fit order-2 md:order-1 bg-white">
            <div className="neo-badge inline-flex items-center gap-1.5 bg-[var(--neo-mint)] text-[#0f172a] mb-3">Langkah Awal</div>
            <h1 className="text-2xl sm:text-3xl font-black leading-tight text-[#0f172a]">
              Kenalan dulu, yuk! <br /><span className="text-[var(--primary)]">Biar kalorimu pas.</span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm font-medium text-slate-600">
              Isi datamu untuk membuka fitur foto makanan &amp; rekomendasi kalori harian yang dipersonalisasi.
            </p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[1rem] border-2 border-dashed border-[#0f172a]/20 p-4 bg-[var(--muted)]">
                <div className="text-xs font-black uppercase tracking-wider text-[#0f172a]">PorsiSnap • Neobrutalism rapi</div>
                <div className="mt-1 text-sm font-bold leading-5 text-slate-600">Lengkapi profil di halaman Daftar — BMI/BMR/TDEE hitung otomatis, lalu Snap foto makanan di <span className="font-black text-[#0f172a]">/foto</span>.</div>
                <Link href="/register" className="neo-btn mt-3 inline-flex w-full justify-center bg-[var(--primary)] text-white !rounded-full">Mulai PorsiSnap →</Link>
                <Link href="/login" className="neo-btn mt-2 inline-flex w-full justify-center bg-white text-[#0f172a] !rounded-full">Sudah punya akun? Masuk</Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <div className="mb-1 text-xs font-black uppercase tracking-wider text-[#0f172a]">Nama Lengkap / Panggilan</div>
                  <input className="neo-input" placeholder="Contoh: Budi" disabled />
                </label>
                <label className="block">
                  <div className="mb-1 text-xs font-black uppercase tracking-wider text-[#0f172a]">Usia</div>
                  <input className="neo-input" placeholder="20" disabled />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <div className="mb-1 text-xs font-black uppercase tracking-wider text-[#0f172a]">Berat Badan (kg)</div>
                  <input className="neo-input" placeholder="60" disabled />
                </label>
                <label className="block">
                  <div className="mb-1 text-xs font-black uppercase tracking-wider text-[#0f172a]">Tinggi Badan (cm)</div>
                  <input className="neo-input" placeholder="170" disabled />
                </label>
              </div>
              <div className="neo-card-soft p-3.5 bg-[var(--neo-mint)]">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#0f172a]/70">Pratinjau Status BMI Anda</div>
                <div className="mt-1 flex items-baseline gap-2"><span className="text-lg font-black text-[#0f172a]">Normal (Ideal)</span><span className="text-xs font-black text-[#0f172a]">(22)</span></div>
                <p className="mt-1 text-[11px] font-bold text-[#0f172a] leading-relaxed">Berat badan kamu ideal. Pertahankan pola makan seimbang dan aktivitas fisik!</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="neo-btn flex flex-col items-center gap-1 !py-2.5 !px-1 text-xs font-black !bg-[#0f172a] !text-white">Stabilkan</div>
                <div className="neo-btn flex flex-col items-center gap-1 !py-2.5 !px-1 text-xs font-black bg-white text-[#0f172a]">Turunkan</div>
                <div className="neo-btn flex flex-col items-center gap-1 !py-2.5 !px-1 text-xs font-black bg-white text-[#0f172a]">Naikkan</div>
              </div>
              <Link href="/register" className="neo-btn mt-2 flex w-full justify-center bg-[var(--primary)] text-white font-extrabold tracking-wide !rounded-full">Mulai Hitung →</Link>
            </div>
            <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-wide text-slate-500">Mobile-first • Tap target 44px • Safe-area • No horizontal scroll</p>
          </section>
        </main>
      </div>

      <div className="fixed bottom-0 sm:bottom-6 left-0 right-0 mx-auto w-full sm:w-[92%] sm:max-w-[460px] z-40 pointer-events-none px-0 sm:px-2">
        <nav className="pointer-events-auto relative grid h-[68px] sm:h-[66px] w-full items-center rounded-none sm:rounded-full border-t-[2.5px] sm:border-[2.5px] border-[#0f172a] bg-white/98 sm:bg-white/95 px-2 pb-1 sm:pb-0 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:shadow-[0_10px_30px_rgba(0,0,0,0.15),4px_4px_0px_#0f172a] backdrop-blur-xl grid-cols-3">
          <Link href="/profil" className="relative flex flex-col items-center justify-center h-full z-10 w-full py-1">
            <User className="h-5 w-5 text-slate-600" /><span className="text-[9px] font-black uppercase tracking-wider text-slate-600">Profil</span>
          </Link>
          <div className="relative flex h-full flex-col items-center justify-end pb-1.5">
            <Link href="/foto" className="-top-7 absolute z-20"><div className="flex h-[58px] w-[58px] items-center justify-center rounded-full border-[2.5px] border-[#0f172a] bg-[var(--primary)] text-white shadow-[0_6px_16px_rgba(37,99,235,0.35),3px_3px_0px_#0f172a]"><Camera className="h-6 w-6 stroke-[2.5]" /></div></Link>
            <span className="pt-1 text-[9px] uppercase tracking-wider font-black text-slate-500">Foto</span>
          </div>
          <Link href="/dev" className="relative flex flex-col items-center justify-center h-full z-10 w-full py-1">
            <CodeXml className="h-5 w-5 text-slate-600" /><span className="text-[9px] font-black uppercase tracking-wider text-slate-600">Dev</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
