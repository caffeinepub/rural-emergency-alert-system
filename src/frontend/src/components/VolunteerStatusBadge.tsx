import { Badge } from "@/components/ui/badge";
import { VolunteerStatus } from "../backend.d";

const config: Record<VolunteerStatus, { label: string; className: string }> = {
  [VolunteerStatus.available]: {
    label: "Available",
    className:
      "bg-green-900/40 text-green-400 border-green-700/50 hover:bg-green-900/40",
  },
  [VolunteerStatus.deployed]: {
    label: "Deployed",
    className:
      "bg-orange-900/40 text-orange-400 border-orange-700/50 hover:bg-orange-900/40",
  },
  [VolunteerStatus.unavailable]: {
    label: "Unavailable",
    className:
      "bg-muted/50 text-muted-foreground border-border hover:bg-muted/50",
  },
};

export function VolunteerStatusBadge({
  status,
}: {
  status: VolunteerStatus;
}) {
  const c = config[status] ?? config[VolunteerStatus.unavailable];
  return (
    <Badge variant="outline" className={c.className}>
      {c.label}
    </Badge>
  );
}
