import BottomNav from "@/components/Navigation/BottomNav";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-white pb-[88px] md:pb-0">{children}<BottomNav /></div>;
}
