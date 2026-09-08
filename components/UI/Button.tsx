"use client";
import type { ButtonHTMLAttributes } from "react";
type V = "primary" | "secondary" | "ghost" | "danger";
type S = "sm" | "md" | "lg";
export default function Button({ children, variant="primary", size="md", className="", ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: V; size?: S }) {
  const base = "inline-flex items-center justify-center font-black tracking-wide border-[3px] border-[#0f172a] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none select-none";
  const v: Record<V,string> = {
    primary: "bg-[#2563eb] text-white shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] hover:translate-x-[1px] hover:translate-y-[1px]",
    secondary: "bg-white text-[#0f172a] shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] hover:translate-x-[1px] hover:translate-y-[1px]",
    ghost: "bg-[#FFBE0B] text-[#0f172a] shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a]",
    danger: "bg-[#ff006e] text-white shadow-[4px_4px_0px_#0f172a]",
  };
  const s: Record<S,string> = {
    sm: "px-4 py-2 text-xs rounded-[16px]",
    md: "px-6 py-3 text-sm min-h-[48px] rounded-[20px]",
    lg: "px-8 py-4 text-base min-h-[56px] w-full rounded-[20px]",
  };
  return <button className={`${base} ${v[variant]} ${s[size]} ${className}`} {...p}>{children}</button>;
}
