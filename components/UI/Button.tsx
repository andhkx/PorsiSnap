"use client";
import type { ButtonHTMLAttributes } from "react";
type V = "primary" | "secondary" | "danger" | "success" | "outline";
type S = "sm" | "md" | "lg";
export default function Button({ children, variant="primary", size="md", className="", ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: V; size?: S }) {
  const base = "font-black uppercase border-[3px] border-black transition-all active:translate-x-1 active:translate-y-1 inline-flex items-center justify-center";
  const v: Record<V,string> = {
    primary: "bg-[#FF6B35] text-white hover:shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0px_#000]",
    secondary: "bg-[#004E89] text-white hover:shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0px_#000]",
    danger: "bg-[#FF006E] text-white hover:shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0px_#000]",
    success: "bg-[#00D9A3] text-black hover:shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0px_#000]",
    outline: "bg-[#F5F5F5] text-black hover:bg-[#FF6B35] hover:text-white shadow-[4px_4px_0px_#000]",
  };
  const s: Record<S,string> = { sm:"px-4 py-2 text-sm", md:"px-6 py-3 text-sm min-h-[48px]", lg:"px-8 py-4 text-base min-h-[56px] w-full" };
  return <button className={`${base} ${v[variant]} ${s[size]} ${className}`} {...p}>{children}</button>;
}
