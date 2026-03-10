import { Badge } from "@/components/ui/badge";
import { Severity } from "../backend.d";

const config: Record<Severity, { label: string; className: string }> = {
  [Severity.low]: {
    label: "Low",
    className:
      "bg-green-900/40 text-green-400 border-green-700/50 hover:bg-green-900/40",
  },
  [Severity.medium]: {
    label: "Medium",
    className:
      "bg-yellow-900/40 text-yellow-400 border-yellow-700/50 hover:bg-yellow-900/40",
  },
  [Severity.high]: {
    label: "High",
    className:
      "bg-orange-900/40 text-orange-400 border-orange-700/50 hover:bg-orange-900/40",
  },
  [Severity.critical]: {
    label: "CRITICAL",
    className:
      "bg-red-900/40 text-red-400 border-red-700/50 hover:bg-red-900/40 animate-pulse",
  },
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const c = config[severity] ?? config[Severity.low];
  return (
    <Badge variant="outline" className={c.className}>
      {c.label}
    </Badge>
  );
}
