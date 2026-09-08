"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const ITEMS = [
  { href: "/profil", label: "Profil", icon: "👤" },
  { href: "/history", label: "Riwayat", icon: "📋" },
  { href: "/foto", label: "Snap", icon: "📸", center: true },
  { href: "/stats", label: "Statistik", icon: "📊" },
  { href: "/dev", label: "Dev", icon: "⚙️" },
];
export default function BottomNav() {
  const p = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-[3px] border-[#0f172a] px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex justify-around items-end md:hidden shadow-[0_-4px_0_#0f172a]">
      {ITEMS.map(it => {
        const active = p?.startsWith(it.href);
        if (it.center) return (
          <Link key={it.href} href={it.href} className="-mt-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-[20px] bg-[#2563eb] text-white border-[3px] border-[#0f172a] shadow-[4px_4px_0px_#0f172a] flex items-center justify-center text-2xl active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">📸</div>
            <span className="mt-1 text-[10px] font-black uppercase tracking-widest">Snap</span>
          </Link>
        );
        return (
          <Link key={it.href} href={it.href} className="flex flex-1 flex-col items-center justify-center gap-1 py-1">
            <span className={`w-10 h-10 rounded-[16px] flex items-center justify-center text-lg border-[3px] ${active ? "bg-[#0f172a] text-white border-[#0f172a]" : "bg-white text-[#0f172a] border-[#0f172a]"}`}>{it.icon}</span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${active ? "text-[#2563eb]" : "text-[#0f172a]/70"}`}>{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
