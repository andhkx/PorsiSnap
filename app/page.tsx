import Link from "next/link";
import Button from "@/components/UI/Button";
import Card from "@/components/UI/Card";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#0f172a]">
      <header className="sticky top-0 z-40 bg-white border-b-[3px] border-[#0f172a]">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3 gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-[12px] bg-[#2563eb] border-[3px] border-[#0f172a] flex items-center justify-center font-black text-white text-sm shadow-[3px_3px_0px_#0f172a]">P</div>
            <span className="font-black tracking-tight text-[15px] uppercase truncate">PorsiSnap</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-xs font-black uppercase tracking-widest">
            <span className="border-b-[3px] border-[#0f172a] pb-1">Beranda</span>
            <a href="#fitur" className="opacity-70 hover:opacity-100">Fitur</a>
            <a href="#cara" className="opacity-70 hover:opacity-100">Cara Kerja</a>
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/login" className="hidden sm:inline-flex rounded-[9999px] border-[3px] border-[#0f172a] bg-white px-4 py-2 text-xs font-black uppercase tracking-widest">Masuk</Link>
            <Link href="/register" className="inline-flex"><Button size="sm">Mulai</Button></Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4">
        <section className="grid gap-6 py-6 md:grid-cols-2 md:items-center md:py-10 md:gap-8">
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center gap-2 rounded-[9999px] bg-[#0f172a] px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white">
              <span className="h-2 w-2 rounded-full bg-[#2563eb]" /> AI Photo Recognition • Gemini Pro
            </div>
            <h1 className="mt-4 font-black leading-[0.9] tracking-tight text-[36px] sm:text-[44px] md:text-[52px]">
              SNAP<br />CALORIES<br />
              <span className="inline-block rounded-[16px] bg-[#2563eb] px-2.5 py-1 text-white border-[3px] border-[#0f172a] shadow-[4px_4px_0px_#0f172a]">WITH</span><br />PRECISION
            </h1>
            <p className="mt-4 max-w-[36ch] text-sm font-bold leading-6 opacity-70">
              Foto makanan → AI hitung kalori otomatis. Track harian vs target BMR/TDEE. Streak nyala kalau penuhi target harian.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="w-full sm:w-auto"><Button size="lg">Mulai Tracking →</Button></Link>
              <Link href="/login" className="hidden sm:inline-flex w-full sm:w-auto"><Button variant="secondary" size="lg">Lihat Demo</Button></Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-[9999px] bg-[#FFBE0B] border-[3px] border-[#0f172a] px-3 py-1 text-[10px] font-black uppercase tracking-widest">Gratis</span>
              <span className="rounded-[9999px] bg-white border-[3px] border-[#0f172a] px-3 py-1 text-[10px] font-black uppercase tracking-widest">No CC</span>
              <span className="rounded-[9999px] bg-[#00D9A3] border-[3px] border-[#0f172a] px-3 py-1 text-[10px] font-black uppercase tracking-widest">WebP 80KB</span>
            </div>
            <div className="mt-6 hidden md:flex items-center gap-3 text-xs font-black">
              <span className="h-[3px] w-8 bg-[#0f172a]" /> SCIENTIFIC • BRUTALIST • EFFECTIVE
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="rounded-[24px] bg-white border-[3px] border-[#0f172a] shadow-[6px_6px_0px_#0f172a] p-3 sm:p-4">
              <div className="flex items-center justify-between rounded-[16px] bg-[#0f172a] px-3 py-2.5 text-white">
                <span className="text-[11px] font-black uppercase tracking-widest">Preview PorsiSnap</span>
                <span className="rounded-[9999px] bg-[#2563eb] border-2 border-white px-2.5 py-1 text-[11px] font-black">1.850 / 2.100 KCAL</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-[20px] bg-[#2563eb] border-[3px] border-[#0f172a] p-3 text-center text-white shadow-[3px_3px_0px_#0f172a]">
                  <div className="text-xl font-black leading-none">1.250</div><div className="mt-1 text-[9px] font-black uppercase tracking-widest opacity-90">Sarapan</div>
                </div>
                <div className="rounded-[20px] bg-[#FFBE0B] border-[3px] border-[#0f172a] p-3 text-center shadow-[3px_3px_0px_#0f172a]">
                  <div className="text-xl font-black leading-none">420</div><div className="mt-1 text-[9px] font-black uppercase tracking-widest">Makan Siang</div>
                </div>
                <div className="rounded-[20px] bg-white border-[3px] border-[#0f172a] p-3 text-center shadow-[3px_3px_0px_#0f172a]">
                  <div className="text-xl font-black leading-none">🔥 7</div><div className="mt-1 text-[9px] font-black uppercase tracking-widest">Streak</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 rounded-[20px] border-[3px] border-[#0f172a] bg-[#f8fafc] p-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] bg-white border-[3px] border-[#0f172a] text-xl">🍛</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-black uppercase">Nasi Goreng + Telur</div>
                  <div className="text-xs font-bold opacity-60">620 kkal • 12:30 • AI • WebP</div>
                </div>
                <span className="shrink-0 rounded-[12px] bg-[#0f172a] px-2.5 py-1.5 text-xs font-black text-white">620</span>
              </div>
              <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-wide opacity-50">History simpan bukti foto • Kompres 800px WebP ~80KB</p>
            </div>
          </div>
        </section>

        <section id="fitur" className="grid gap-3 md:grid-cols-3 md:gap-4">
          <Card className="bg-[#2563eb] text-white !p-5 rounded-[24px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-white text-lg border-[3px] border-[#0f172a]">📸</div>
            <div className="mt-3 text-sm font-black uppercase tracking-wide">Snap Photo</div>
            <p className="mt-1 text-sm font-bold leading-5 opacity-90">Foto makanan, AI hitung kalori per item. Kompres WebP hemat storage.</p>
          </Card>
          <Card className="bg-[#0f172a] text-white !p-5 rounded-[24px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-[#FFBE0B] text-lg border-[3px] border-white text-[#0f172a]">📊</div>
            <div className="mt-3 text-sm font-black uppercase tracking-wide">Track Intake</div>
            <p className="mt-1 text-sm font-bold leading-5 opacity-90">Catat harian, progress vs target kalori (BMR×1.55 ±500).</p>
          </Card>
          <Card className="!p-5 rounded-[24px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-[#00D9A3] text-lg border-[3px] border-[#0f172a]">🔥</div>
            <div className="mt-3 text-sm font-black uppercase tracking-wide">Streak & History</div>
            <p className="mt-1 text-sm font-bold leading-5 opacity-60">Streak nyala kalau penuhi target harian. Lihat history foto kapan saja.</p>
          </Card>
        </section>

        <section id="cara" className="py-6 md:py-8">
          <div className="rounded-[24px] border-[3px] border-[#0f172a] bg-white shadow-[6px_6px_0px_#0f172a] p-4 md:p-7 grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-black uppercase leading-none tracking-tight">Log Daily Meals<br />Stay Consistent</h2>
              <p className="mt-2 text-sm font-bold opacity-60">Konsistensi &gt; perfeksi. 3 langkah raw &amp; brutalist.</p>
              <div className="mt-4 space-y-3">
                <div className="flex gap-3 rounded-[16px] border-[3px] border-[#0f172a] bg-[#f8fafc] p-3 items-center"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[12px] bg-[#0f172a] text-white text-xs font-black">1</span><span className="text-sm font-black">Foto / upload makanan — kompres 800px WebP</span></div>
                <div className="flex gap-3 rounded-[16px] border-[3px] border-[#0f172a] bg-[#f8fafc] p-3 items-center"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[12px] bg-[#0f172a] text-white text-xs font-black">2</span><span className="text-sm font-black">Gemini Pro analisis → simpan + hitung daily_summary</span></div>
                <div className="flex gap-3 rounded-[16px] border-[3px] border-[#0f172a] bg-[#2563eb] p-3 items-center text-white"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[12px] bg-white text-[#0f172a] text-xs font-black border-2 border-[#0f172a]">3</span><span className="text-sm font-black">Cek streak — 85-105% target = streak +1</span></div>
              </div>
            </div>
            <div className="rounded-[20px] border-[3px] border-[#0f172a] bg-[#f8fafc] p-4 shadow-[4px_4px_0px_#0f172a]">
              <div className="text-xs font-black uppercase tracking-widest">Daily Progress</div>
              <div className="mt-3 rounded-[16px] border-[3px] border-[#0f172a] bg-white p-3">
                <div className="flex justify-between text-xs font-black uppercase tracking-wide"><span>Hari ini</span><span>88%</span></div>
                <div className="mt-2 h-4 overflow-hidden rounded-[9999px] border-[3px] border-[#0f172a] bg-[#e2e8f0]"><div className="h-full bg-[#2563eb]" style={{ width: "88%" }} /></div>
                <div className="mt-2 text-xs font-black">1.850 / 2.100 kkal — SISA 250 • STREAK 7 🔥</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-2 border-t-[3px] border-[#0f172a] bg-[#0f172a] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-xs font-black uppercase tracking-widest sm:flex-row sm:items-center sm:justify-between">
          <span className="opacity-80">PorsiSnap © 2026 • Scientific. Brutalist. Effective.</span>
          <Link href="/login" className="inline-flex rounded-[9999px] bg-white px-4 py-2 text-[#0f172a] border-[3px] border-white">Masuk →</Link>
        </div>
      </footer>
    </div>
  );
}
