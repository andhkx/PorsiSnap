export default function Card({ children, className="", variant="default" }: { children: React.ReactNode; className?: string; variant?: "default"|"soft"|"inset"|"mint"|"lavender"|"peach" }) {
  const map: Record<string,string> = {
    default: "neo-card",
    soft: "neo-card-soft",
    inset: "neo-inset",
    mint: "neo-card bg-[var(--neo-mint)]",
    lavender: "neo-card bg-[var(--neo-lavender)]",
    peach: "neo-card bg-[var(--neo-peach)]",
  };
  return <div className={`${map[variant]||map.default} p-5 md:p-6 ${className}`}>{children}</div>;
}
