"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function RegisterRedirect(){
  const r=useRouter();
  useEffect(()=>{ r.replace("/"); },[r]);
  return <div className="min-h-dvh grid place-items-center bg-white p-6"><div className="neo-card bg-white p-6 font-black text-sm">Mengalihkan ke Beranda...</div></div>;
}
