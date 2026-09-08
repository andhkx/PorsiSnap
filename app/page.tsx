import Link from "next/link";
import Button from "@/components/UI/Button";
import Card from "@/components/UI/Card";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] text-black">
      <header className="sticky top-0 z-40 bg-white border-b-[4px] border-black">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF6B35] border-[3px] border-black flex items-center justify-center font-black text-white">P</div>
            <span className="font-black uppercase tracking-tight text-lg">PorsiSnap</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-black uppercase">
            <span className="border-b-[3px] border-black">Beranda</span>
            <a href="#fitur" className="hover:text-[#FF6B35]">Fitur</a>
            <a href="#cara" className="hover:text-[#FF6B35]">Cara Kerja</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden md:inline-flex border-[3px] border-black px-4 py-2 font-black uppercase text-sm bg-white hover:bg-[#FFBE0B]">Masuk</Link>
            <Link href="/register"><Button size="sm">Mulai</Button></Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8 md:py-12 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <div className="inline-flex bg-[#FFBE0B] border-[3px] border-black px-3 py-1 font-black uppercase text-xs shadow-[3px_3px_0px_#000]">AI Photo Recognition • Neobrutalism</div>
          <h1 className="mt-4 font-black uppercase leading-[0.9] text-4xl md:text-5xl">
            SNAP<br/>CALORIES<br/><span className="bg-[#FF6B35] text-white px-2 border-[3px] border-black shadow-[4px_4px_0px_#000]">WITH</span><br/>PRECISION
          </h1>
          <p className="mt-4 font-semibold text-sm md:text-base max-w-xl">Foto makanan → AI Gemini hitung kalori otomatis. Track harian vs target BMR/TDEE. Streak harian kalau penuhi target.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/register" className="flex-1 md:flex-none"><Button size="lg">Mulai Tracking →</Button></Link>
            <Link href="/login" className="hidden md:inline-flex border-[3px] border-black px-6 py-3 font-black uppercase bg-white shadow-[4px_4px_0px_#000]">Lihat Demo</Link>
          </div>
          <div className="mt-4 flex gap-2 text-xs font-black uppercase">
            <span className="bg-[#00D9A3] border-[3px] border-black px-2 py-1">Gratis</span>
            <span className="bg-white border-[3px] border-black px-2 py-1">No CC</span>
            <span className="bg-[#004E89] text-white border-[3px] border-black px-2 py-1">Gemini Pro</span>
          </div>
        </div>
        <div className="relative">
          <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] p-4">
            <div className="bg-[#F5F5F5] border-[3px] border-black p-3 flex items-center justify-between">
              <span className="font-black uppercase text-xs">Preview PorsiSnap</span>
              <span className="bg-[#FF6B35] text-white border-[2px] border-black px-2 py-1 font-black text-xs">1.850 / 2.100 KCAL</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="bg-[#FFBE0B] border-[3px] border-black p-3 text-center shadow-[3px_3px_0px_#000]">
                <div className="font-black text-2xl">1.250</div><div className="font-bold uppercase text-[10px]">Sarapan</div>
              </div>
              <div className="bg-[#00D9A3] border-[3px] border-black p-3 text-center shadow-[3px_3px_0px_#000]">
                <div className="font-black text-2xl">420</div><div className="font-bold uppercase text-[10px]">Makan Siang</div>
              </div>
              <div className="bg-[#004E89] text-white border-[3px] border-black p-3 text-center shadow-[3px_3px_0px_#000]">
                <div className="font-black text-2xl">7</div><div className="font-bold uppercase text-[10px]">Streak</div>
              </div>
            </div>
            <div className="mt-3 border-[3px] border-black bg-white p-3 flex gap-3 items-center">
              <div className="w-14 h-14 bg-zinc-200 border-[3px] border-black shrink-0 flex items-center justify-center text-xl">🍛</div>
              <div className="flex-1">
                <div className="font-black uppercase text-sm">Nasi Goreng + Telur</div>
                <div className="font-bold text-xs">620 kkal • 12:30 • AI</div>
              </div>
              <span className="bg-black text-white px-2 py-1 font-black text-xs">620</span>
            </div>
            <div className="mt-2 text-[10px] font-bold uppercase text-center">* Kompres WebP 800px ~80KB • Simpan bukti foto di history *</div>
          </div>
        </div>
      </section>

      <section id="fitur" className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-4">
        <Card className="bg-[#FF6B35] text-white !p-5"><div className="text-3xl">📸</div><div className="font-black uppercase mt-2">Snap Photo</div><p className="font-semibold text-sm mt-1">Foto makanan, AI hitung kalori per item otomatis. Kompres WebP hemat storage.</p></Card>
        <Card className="bg-[#004E89] text-white !p-5"><div className="text-3xl">📊</div><div className="font-black uppercase mt-2">Track Intake</div><p className="font-semibold text-sm mt-1">Catat harian, progress vs target kalori (BMR×1.55 ±500).</p></Card>
        <Card className="!p-5"><div className="text-3xl">🔥</div><div className="font-black uppercase mt-2">Streak & History</div><p className="font-semibold text-sm mt-1">Streak nyala kalau penuhi target harian. Lihat history foto kapan saja.</p></Card>
      </section>

      <section id="cara" className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white border-[4px] border-black shadow-[6px_6px_0px_#000] p-6 md:p-8 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="font-black uppercase text-2xl">Log Daily Meals • Stay Consistent</h2>
            <p className="font-semibold text-sm mt-2">Konsistensi &gt; perfeksi. 3 langkah raw &amp; brutalist.</p>
            <div className="mt-4 space-y-3">
              <div className="flex gap-3 border-[3px] border-black p-3 bg-[#F5F5F5]"><span className="bg-black text-white w-7 h-7 flex items-center justify-center font-black shrink-0">1</span><span className="font-bold text-sm">Foto / upload makanan — kompres 800px WebP</span></div>
              <div className="flex gap-3 border-[3px] border-black p-3 bg-[#F5F5F5]"><span className="bg-black text-white w-7 h-7 flex items-center justify-center font-black shrink-0">2</span><span className="font-bold text-sm">Gemini Pro analisis → simpan otomatis + hitung daily_summary</span></div>
              <div className="flex gap-3 border-[3px] border-black p-3 bg-[#F5F5F5]"><span className="bg-[#FF6B35] text-white border-[2px] border-black w-7 h-7 flex items-center justify-center font-black shrink-0">3</span><span className="font-bold text-sm">Cek streak — penuhi 85-105% target = streak +1</span></div>
            </div>
          </div>
          <div className="bg-[#FFBE0B] border-[3px] border-black p-4 shadow-[4px_4px_0px_#000]">
            <div className="font-black uppercase text-sm">Daily Progress</div>
            <div className="mt-2 bg-white border-[3px] border-black p-3">
              <div className="flex justify-between font-black text-xs uppercase"><span>Hari ini</span><span>88%</span></div>
              <div className="mt-2 h-4 bg-zinc-200 border-[3px] border-black"><div className="h-full bg-[#00D9A3] border-r-[3px] border-black" style={{width:"88%"}} /></div>
              <div className="mt-2 font-bold text-xs">1.850 / 2.100 kkal — SISA 250 • STREAK 7 🔥</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t-[4px] border-black bg-white mt-6">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center font-black uppercase text-xs">
          <span>PorsiSnap © 2026 • Scientific. Brutalist. Effective.</span>
          <Link href="/login" className="bg-black text-white px-3 py-2 border-[3px] border-black">Masuk →</Link>
        </div>
      </footer>
    </div>
  );
}
