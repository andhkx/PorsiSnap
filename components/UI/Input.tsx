import type { InputHTMLAttributes } from "react";
export default function Input({ className="", ...p }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`w-full border-[3px] border-black bg-white px-4 py-3 text-sm font-semibold outline-none focus:shadow-[4px_4px_0px_#000] placeholder:text-zinc-500 ${className}`} {...p} />;
}
