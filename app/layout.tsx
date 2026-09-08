import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["500","700","800"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "PorsiSnap — Snap. Calculate. Track.",
  description: "Hitung kalori makanan dari foto dan kenali kebutuhan kalori harianmu secara instan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-[#0f172a] antialiased">{children}</body>
    </html>
  );
}
