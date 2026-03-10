import { useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Severity } from "../backend.d";
import { useCreateIncident, useIncidents } from "../hooks/useQueries";

const SEVERITY_COLORS: Record<Severity, string> = {
  [Severity.low]: "#4ade80",
  [Severity.medium]: "#facc15",
  [Severity.high]: "#fb923c",
  [Severity.critical]: "#f87171",
};

export function IncidentsMap() {
  const { data: incidents, isLoading } = useIncidents();
  const createIncident = useCreateIncident();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    village: "",
    incidentType: "",
    latitude: "",
    longitude: "",
    severity: "" as Severity | "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.village ||
      !form.incidentType ||
      !form.latitude ||
      !form.longitude ||
      !form.severity
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await createIncident.mutateAsync({
        village: form.village,
        incidentType: form.incidentType,
        latitude: Number.parseFloat(form.latitude),
        longitude: Number.parseFloat(form.longitude),
        severity: form.severity as Severity,
        description: form.description,
      });
      toast.success("Incident reported successfully");
      setOpen(false);
      setForm({
        village: "",
        incidentType: "",
        latitude: "",
        longitude: "",
        severity: "",
        description: "",
      });
    } catch {
      toast.error("Failed to report incident");
    }
  };

  return (
    <div data-ocid="map.section" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-mono tracking-tight">
            INCIDENTS MAP
          </h1>
          <p className="text-sm text-muted-foreground">
            Tamil Nadu — live incident visualization
          </p>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              data-ocid="incidents.open_modal_button"
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus size={16} />
              Report Incident
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-card border-border w-full sm:max-w-md overflow-y-auto"
            data-ocid="incidents.sheet"
          >
            <SheetHeader>
              <SheetTitle className="font-mono uppercase tracking-wider">
                Report New Incident
              </SheetTitle>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase">Village *</Label>
                <Input
                  data-ocid="incidents.input"
                  value={form.village}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, village: e.target.value }))
                  }
                  placeholder="e.g. Kovilpatti"
                  className="bg-input border-border font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase">
                  Incident Type *
                </Label>
                <Select
                  value={form.incidentType}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, incidentType: v }))
                  }
                >
                  <SelectTrigger
                    data-ocid="incidents.select"
                    className="bg-input border-border font-mono"
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {[
                      "flood",
                      "fire",
                      "medical",
                      "drought",
                      "cyclone",
                      "other",
                    ].map((t) => (
                      <SelectItem
                        key={t}
                        value={t}
                        className="font-mono capitalize"
                      >
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="font-mono text-xs uppercase">
                    Latitude *
                  </Label>
                  <Input
                    type="number"
                    step="any"
                    data-ocid="incidents.input"
                    value={form.latitude}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, latitude: e.target.value }))
                    }
                    placeholder="11.0"
                    className="bg-input border-border font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-xs uppercase">
                    Longitude *
                  </Label>
                  <Input
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, longitude: e.target.value }))
                    }
                    placeholder="78.0"
                    className="bg-input border-border font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase">
                  Severity *
                </Label>
                <Select
                  value={form.severity}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, severity: v as Severity }))
                  }
                >
                  <SelectTrigger
                    data-ocid="incidents.select"
                    className="bg-input border-border font-mono"
                  >
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {Object.values(Severity).map((s) => (
                      <SelectItem
                        key={s}
                        value={s}
                        className="font-mono capitalize"
                      >
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase">
                  Description
                </Label>
                <Textarea
                  data-ocid="incidents.textarea"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Describe the incident..."
                  rows={3}
                  className="bg-input border-border font-mono resize-none"
                />
              </div>

              <Button
                type="submit"
                data-ocid="incidents.submit_button"
                disabled={createIncident.isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {createIncident.isPending ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Report"
                )}
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs font-mono">
        {[
          { label: "LOW", color: "#4ade80" },
          { label: "MEDIUM", color: "#facc15" },
          { label: "HIGH", color: "#fb923c" },
          { label: "CRITICAL", color: "#f87171" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Map */}
      <div
        className="relative rounded-lg overflow-hidden border border-border"
        style={{ height: "520px" }}
      >
        {isLoading && (
          <div
            data-ocid="map.loading_state"
            className="absolute inset-0 z-[1000] bg-background/80 flex items-center justify-center"
          >
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        )}
        <MapContainer
          center={[11.0, 78.0]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {(incidents ?? []).map((inc) => (
            <CircleMarker
              key={inc.id.toString()}
              center={[inc.latitude, inc.longitude]}
              radius={
                inc.severity === "critical"
                  ? 14
                  : inc.severity === "high"
                    ? 11
                    : 8
              }
              pathOptions={{
                color: SEVERITY_COLORS[inc.severity] ?? "#fff",
                fillColor: SEVERITY_COLORS[inc.severity] ?? "#fff",
                fillOpacity: 0.7,
                weight: 2,
              }}
            >
              <Popup>
                <div
                  className="font-sans text-sm space-y-1"
                  data-ocid="map.map_marker"
                >
                  <div className="font-bold text-base">{inc.village}</div>
                  <div>
                    <span className="text-gray-400">Type:</span>{" "}
                    <span className="capitalize">{inc.incidentType}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Severity:</span>{" "}
                    <span
                      style={{
                        color: SEVERITY_COLORS[inc.severity] ?? "#fff",
                      }}
                      className="uppercase font-bold"
                    >
                      {inc.severity}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>{" "}
                    <span className="capitalize">{inc.status}</span>
                  </div>
                  {inc.description && (
                    <div className="text-gray-300 text-xs mt-1">
                      {inc.description}
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
