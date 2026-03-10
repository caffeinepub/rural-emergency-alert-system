import { Badge } from "@/components/ui/badge";
import { Status } from "../backend.d";

const config: Record<Status, { label: string; className: string }> = {
  [Status.reported]: {
    label: "Reported",
    className:
      "bg-blue-900/40 text-blue-400 border-blue-700/50 hover:bg-blue-900/40",
  },
  [Status.active]: {
    label: "Active",
    className:
      "bg-orange-900/40 text-orange-400 border-orange-700/50 hover:bg-orange-900/40",
  },
  [Status.resolved]: {
    label: "Resolved",
    className:
      "bg-green-900/40 text-green-400 border-green-700/50 hover:bg-green-900/40",
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const c = config[status] ?? config[Status.reported];
  return (
    <Badge variant="outline" className={c.className}>
      {c.label}
    </Badge>
  );
}
