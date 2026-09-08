export default function Card({ children, className="", variant="default" }: { children: React.ReactNode; className?: string; variant?: "default"|"highlight" }) {
  const v = variant==="highlight" ? "bg-[#FFBE0B] border-[3px] border-black shadow-[4px_4px_0px_#000]" : "bg-white border-[3px] border-black shadow-[4px_4px_0px_#000]";
  return <div className={`${v} p-6 ${className}`}>{children}</div>;
}
