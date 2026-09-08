import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PorsiSnap — Snap. Calculate. Track.",
  description: "AI photo recognition meets calorie tracking. Hitung kalori dari foto makanan instan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-full flex flex-col bg-[#F5F5F5] antialiased">{children}</body>
    </html>
  );
}
