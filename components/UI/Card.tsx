export default function Card({ children, className="", variant="default" }: { children: React.ReactNode; className?: string; variant?: "default"|"highlight"|"dark" }) {
  const v = variant==="highlight" ? "bg-[#FFBE0B] border-[3px] border-[#0f172a] shadow-[4px_4px_0px_#0f172a]"
        : variant==="dark" ? "bg-[#0f172a] text-white border-[3px] border-[#0f172a] shadow-[4px_4px_0px_#0f172a]"
        : "bg-white border-[3px] border-[#0f172a] shadow-[4px_4px_0px_#0f172a]";
  return <div className={`${v} rounded-[20px] p-4 md:p-6 ${className}`}>{children}</div>;
}
