import type { InputHTMLAttributes } from "react";
export default function Input({ className="", ...p }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`neo-input ${className}`} {...p} />;
}
