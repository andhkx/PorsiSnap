"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const ITEMS = [
  { href:"/profil", label:"Profil", icon:"👤" },
  { href:"/history", label:"Riwayat", icon:"📋" },
  { href:"/foto", label:"Snap", icon:"📸", center:true },
  { href:"/stats", label:"Statistik", icon:"📊" },
  { href:"/dev", label:"Dev", icon:"⚙️" },
];
export default function BottomNav(){
  const p=usePathname();
  return <nav className="fixed bottom-0 left-0 right-0 bg-[#F5F5F5] border-t-[4px] border-black px-2 py-2 flex justify-around items-center h-[84px] md:hidden z-50">
    {ITEMS.map(it=>(
      <Link key={it.href} href={it.href} className={`flex flex-col items-center justify-center flex-1 ${it.center?"-mt-8":""}`}>
        {it.center? <div className="bg-[#FF6B35] text-white border-[4px] border-black w-16 h-16 flex items-center justify-center text-3xl shadow-[4px_4px_0px_#000]">📸</div>
        : <><div className="text-2xl">{it.icon}</div><span className={`text-[10px] font-black uppercase ${p?.includes(it.href)?"text-[#FF6B35] border-b-[3px] border-[#FF6B35]":"text-black"}`}>{it.label}</span></>}
      </Link>
    ))}
  </nav>;
}
