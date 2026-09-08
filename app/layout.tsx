import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400","500","600","700","800","900"], variable: "--font-jakarta" });
const space = Space_Grotesk({ subsets: ["latin"], weight: ["500","600","700"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "PorsiSnap — Snap. Calculate. Track.",
  description: "Hitung kalori makanan dari foto dan kenali kebutuhan kalori harianmu secara instan bersama PorsiSnap.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${jakarta.variable} ${space.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-[#0f172a] antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
