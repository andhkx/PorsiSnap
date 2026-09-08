import BottomNav from "@/components/Navigation/BottomNav";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#F5F5F5] pb-[84px] md:pb-0">{children}<BottomNav /></div>;
}
