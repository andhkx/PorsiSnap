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
  const path = usePathname();
  const isActive = (h: string) => path?.startsWith(h);
  return (
    <div className="fixed bottom-0 sm:bottom-6 left-0 right-0 mx-auto w-full sm:w-[96%] sm:max-w-[560px] z-40 pointer-events-none px-0 sm:px-2">
      <nav className="pointer-events-auto relative grid w-full items-center h-[70px] sm:h-[66px] grid-cols-5 rounded-none sm:rounded-full border-t-[2.5px] sm:border-[2.5px] border-[#0f172a] bg-white/98 sm:bg-white/95 px-1 sm:px-2 pb-[env(safe-area-inset-bottom)] sm:pb-0 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:shadow-[0_10px_30px_rgba(0,0,0,0.15),4px_4px_0px_#0f172a] backdrop-blur-xl">
        {ITEMS.map((it) => {
          if (it.center) {
            const active = isActive(it.href);
            return (
              <div key={it.href} className="relative flex h-full flex-col items-center justify-end pb-1.5">
                <Link href={it.href} className="-top-6 absolute z-20">
                  <div className={`flex h-[58px] w-[58px] items-center justify-center rounded-full border-[2.5px] border-[#0f172a] text-white shadow-[0_6px_16px_rgba(37,99,235,0.35),3px_3px_0px_#0f172a] ${active ? "bg-[#0f172a]" : "bg-[var(--primary)]"}`}>
                    <span className="text-xl">📸</span>
                  </div>
                </Link>
                <span className={`pt-1 text-[9px] uppercase tracking-wider font-black ${active ? "text-[#0f172a]" : "text-slate-500"}`}>Foto</span>
              </div>
            );
          }
          const active = isActive(it.href);
          return (
            <Link key={it.href} href={it.href} className="relative flex flex-col items-center justify-center h-full z-10 w-full py-1">
              {active && <div className="absolute inset-1 rounded-full bg-[var(--primary)] border-[1.5px] border-[#0f172a] -z-10 shadow-[1px_1px_0px_#0f172a]" />}
              <span className={`text-[15px] leading-none ${active ? "text-white" : "text-slate-500"}`}>{it.icon}</span>
              <span className={`text-[9px] font-black uppercase tracking-wider leading-none mt-0.5 ${active ? "text-white" : "text-slate-500"}`}>{it.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
