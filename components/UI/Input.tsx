import type { InputHTMLAttributes } from "react";
export default function Input({ className="", ...p }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`w-full border-[3px] border-[#0f172a] bg-white rounded-[16px] px-4 py-3 text-sm font-black outline-none placeholder:text-[#0f172a]/50 focus:shadow-[4px_4px_0px_#0f172a] focus:translate-x-[-1px] focus:translate-y-[-1px] ${className}`} {...p} />;
}
