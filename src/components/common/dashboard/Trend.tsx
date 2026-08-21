import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface TrendProps {
  value: string;
  down?: boolean;
}

export default function Trend({ value, down = false }: TrendProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono-label text-xs ${
        down ? "text-muted-foreground" : "text-accent"
      }`}
    >
      {down ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
      {value}
    </span>
  );
}
