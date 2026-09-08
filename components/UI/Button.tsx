"use client";
import type { ButtonHTMLAttributes } from "react";
type V = "primary" | "secondary" | "ghost" | "danger";
type S = "sm" | "md" | "lg";
export default function Button({ children, variant="primary", size="md", className="", ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: V; size?: S }) {
  const v: Record<V,string> = {
    primary: "bg-[var(--primary)] text-white",
    secondary: "bg-white text-[#0f172a]",
    ghost: "bg-[var(--neo-mint)] text-[#0f172a]",
    danger: "bg-[var(--neo-coral)] text-[#0f172a]",
  };
  const s: Record<S,string> = {
    sm: "!px-4 !py-2 text-xs",
    md: "!px-6 !py-3 text-sm min-h-[48px]",
    lg: "!px-8 !py-4 text-base min-h-[56px] w-full",
  };
  return <button className={`neo-btn ${v[variant]} ${s[size]} ${className}`} {...p}>{children}</button>;
}
