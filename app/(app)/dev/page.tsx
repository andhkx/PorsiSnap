"use client";
import Link from "next/link";
import { CodeXml, GitBranch, Phone, Globe, Mail, ExternalLink, AtSign } from "lucide-react";

export default function DevPage(){
  return <div className="flex min-h-dvh flex-col overflow-x-hidden relative pb-28">
    <main className="relative z-10 mx-auto flex-1 w-full max-w-md px-4 pt-6 sm:max-w-lg md:max-w-xl pb-4">
      <div className="neo-card p-6 sm:p-8 bg-white relative overflow-hidden">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 relative">
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl border-[2.5px] border-[#0f172a] bg-[var(--primary)] p-1.5 shadow-[3.5px_3.5px_0px_#0f172a] overflow-hidden grid place-items-center">
              <span className="h-full w-full rounded-2xl bg-white border-[1.5px] border-[#0f172a] grid place-items-center text-3xl font-black text-[#0f172a]">A</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a]">Andhika</h1>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#0f172a] bg-[var(--neo-mint)] px-3.5 py-1 shadow-[1.5px_1.5px_0px_#0f172a]">
            <CodeXml className="h-4 w-4 text-[#0f172a] stroke-[2.5]" />
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0f172a]">Developer • PorsiSnap</span>
          </div>
          <p className="mt-4 text-xs sm:text-sm font-semibold leading-relaxed text-slate-600 max-w-sm text-center">
            Siswa SMKN 2 membangun <span className="font-black text-[#0f172a]">PorsiSnap</span> — Food Calorie Tracker dengan AI Photo Recognition. Neobrutalism rapi ala HitCal, mobile-first, 1:1 kotak & warna.
          </p>

          <div className="mt-6 w-full space-y-2.5">
            <a href="https://github.com/andhkx/PorsiSnap" target="_blank" rel="noopener noreferrer" className="neo-card-soft group flex items-center justify-between p-3.5 bg-white border-2 border-[#0f172a] shadow-[3px_3px_0px_#0f172a] hover:bg-slate-50 transition-colors">
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[1.5px] border-[#0f172a] bg-[#0f172a] text-white shadow-[1.5px_1.5px_0px_#0f172a]"><GitBranch className="h-5 w-5" /></span>
                <span className="text-left">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">GitHub</span>
                  <span className="font-extrabold text-[#0f172a] text-sm">andhkx/PorsiSnap</span>
                </span>
              </span>
              <ExternalLink className="h-4 w-4 text-slate-400" />
            </a>

            <a href="https://wa.me/6280000000000" target="_blank" rel="noopener noreferrer" className="neo-card-soft group flex items-center justify-between p-3.5 bg-white border-2 border-[#0f172a] shadow-[3px_3px_0px_#0f172a] hover:bg-slate-50 transition-colors">
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[1.5px] border-[#0f172a] bg-emerald-500 text-white shadow-[1.5px_1.5px_0px_#0f172a]"><Phone className="h-5 w-5" /></span>
                <span className="text-left">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">WhatsApp</span>
                  <span className="font-extrabold text-[#0f172a] text-sm">Hubungi Andhika</span>
                </span>
              </span>
              <ExternalLink className="h-4 w-4 text-slate-400" />
            </a>

            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="neo-card-soft group flex items-center justify-between p-3.5 bg-white border-2 border-[#0f172a] shadow-[3px_3px_0px_#0f172a] hover:bg-slate-50 transition-colors">
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[1.5px] border-[#0f172a] bg-[var(--neo-coral)] text-[#0f172a] shadow-[1.5px_1.5px_0px_#0f172a]"><AtSign className="h-5 w-5" /></span>
                <span className="text-left">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Instagram</span>
                  <span className="font-extrabold text-[#0f172a] text-sm">@porsisnap</span>
                </span>
              </span>
              <ExternalLink className="h-4 w-4 text-slate-400" />
            </a>

            <a href="/" className="neo-card-soft group flex items-center justify-between p-3.5 bg-white border-2 border-[#0f172a] shadow-[3px_3px_0px_#0f172a] hover:bg-slate-50 transition-colors">
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[1.5px] border-[#0f172a] bg-[var(--neo-sky)] text-[#0f172a] shadow-[1.5px_1.5px_0px_#0f172a]"><Globe className="h-5 w-5 stroke-[2.5]" /></span>
                <span className="text-left">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Website</span>
                  <span className="font-extrabold text-[#0f172a] text-sm">porsisnap.vercel.app</span>
                </span>
              </span>
              <ExternalLink className="h-4 w-4 text-slate-400" />
            </a>

            <div className="neo-card-soft p-3.5 bg-[var(--muted)] border-2 border-[#0f172a] shadow-[2px_2px_0px_#0f172a] text-left">
              <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500"><Mail className="h-3.5 w-3.5" /> Tech Stack</span>
              <p className="mt-1 text-xs font-bold leading-relaxed text-[#0f172a]">Next.js 14 • Tailwind • Supabase (zxgegw) • Gemini Vision • Vercel Analytics • lucide-react • neobrutalism rapi 1:1 HitCal</p>
            </div>
          </div>

          <div className="mt-6 flex gap-2 w-full">
            <Link href="/profil" className="neo-btn flex-1 bg-[var(--primary)] text-white !rounded-full">Lihat Profil</Link>
            <Link href="/foto" className="neo-btn flex-1 bg-white !rounded-full">Snap Foto</Link>
          </div>
        </div>
      </div>
    </main>
  </div>;
}
