import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MapPin, Plus, Radio } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAlerts, useCreateAlert } from "../hooks/useQueries";

const LOADING_KEYS = ["sk1", "sk2", "sk3", "sk4"];

export function Alerts() {
  const { data: alerts, isLoading } = useAlerts();
  const createAlert = useCreateAlert();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    messageEnglish: "",
    messageTamil: "",
    alertType: "",
    targetLat: "",
    targetLng: "",
    radiusKm: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.messageEnglish || !form.alertType) {
      toast.error("English message and alert type are required");
      return;
    }
    try {
      await createAlert.mutateAsync({
        messageEnglish: form.messageEnglish,
        messageTamil: form.messageTamil,
        alertType: form.alertType,
        targetLat: Number.parseFloat(form.targetLat) || 11.0,
        targetLng: Number.parseFloat(form.targetLng) || 78.0,
        radiusKm: Number.parseFloat(form.radiusKm) || 10,
      });
      toast.success("Alert broadcasted successfully");
      setOpen(false);
      setForm({
        messageEnglish: "",
        messageTamil: "",
        alertType: "",
        targetLat: "",
        targetLng: "",
        radiusKm: "",
      });
    } catch {
      toast.error("Failed to send alert");
    }
  };

  return (
    <div data-ocid="alerts.section" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-mono tracking-tight">
            EMERGENCY ALERTS
          </h1>
          <p className="text-sm text-muted-foreground">
            Geo-targeted broadcast alerts
          </p>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              data-ocid="alerts.open_modal_button"
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus size={16} />
              Compose Alert
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-card border-border w-full sm:max-w-md overflow-y-auto"
            data-ocid="alerts.sheet"
          >
            <SheetHeader>
              <SheetTitle className="font-mono uppercase tracking-wider">
                Compose Emergency Alert
              </SheetTitle>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase">
                  Alert Type *
                </Label>
                <Input
                  data-ocid="alerts.input"
                  value={form.alertType}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, alertType: e.target.value }))
                  }
                  placeholder="e.g. FLOOD WARNING"
                  className="bg-input border-border font-mono uppercase"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase">
                  English Message *
                </Label>
                <Textarea
                  data-ocid="alerts.textarea"
                  value={form.messageEnglish}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, messageEnglish: e.target.value }))
                  }
                  placeholder="Enter alert message in English..."
                  rows={3}
                  className="bg-input border-border font-mono resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase">
                  Tamil Message (தமிழ்)
                </Label>
                <Textarea
                  value={form.messageTamil}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, messageTamil: e.target.value }))
                  }
                  placeholder="தமிழில் செய்தியை உள்ளிடவும்..."
                  rows={3}
                  className="bg-input border-border resize-none"
                  style={{ fontFamily: "sans-serif" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="font-mono text-xs uppercase">
                    Target Lat
                  </Label>
                  <Input
                    type="number"
                    step="any"
                    value={form.targetLat}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, targetLat: e.target.value }))
                    }
                    placeholder="11.0"
                    className="bg-input border-border font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-xs uppercase">
                    Target Lng
                  </Label>
                  <Input
                    type="number"
                    step="any"
                    value={form.targetLng}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, targetLng: e.target.value }))
                    }
                    placeholder="78.0"
                    className="bg-input border-border font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase">
                  Radius (km)
                </Label>
                <Input
                  type="number"
                  value={form.radiusKm}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, radiusKm: e.target.value }))
                  }
                  placeholder="10"
                  className="bg-input border-border font-mono"
                />
              </div>

              <Button
                type="submit"
                data-ocid="alerts.submit_button"
                disabled={createAlert.isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {createAlert.isPending ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Broadcasting...
                  </>
                ) : (
                  "Broadcast Alert"
                )}
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {isLoading ? (
        <div
          data-ocid="alerts.loading_state"
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {LOADING_KEYS.map((key) => (
            <Skeleton key={key} className="h-32" />
          ))}
        </div>
      ) : !alerts || alerts.length === 0 ? (
        <Card className="border-border bg-card" data-ocid="alerts.empty_state">
          <CardContent className="py-16 text-center text-muted-foreground font-mono">
            <Radio size={32} className="mx-auto mb-3 opacity-30" />
            NO ALERTS BROADCAST
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alerts.map((alert, idx) => (
            <Card
              key={alert.id.toString()}
              className="border-border bg-card hover:border-primary/30 transition-colors"
              data-ocid={`alerts.item.${idx + 1}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-mono uppercase tracking-widest text-primary flex items-center gap-2">
                    <Radio size={12} />
                    {alert.alertType}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                    <MapPin size={11} />
                    {alert.radiusKm}km radius
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-foreground leading-relaxed">
                  {alert.messageEnglish}
                </p>
                {alert.messageTamil && (
                  <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-2">
                    {alert.messageTamil}
                  </p>
                )}
                <div className="flex gap-3 text-xs font-mono text-muted-foreground pt-1">
                  <span>Lat: {alert.targetLat.toFixed(4)}</span>
                  <span>Lng: {alert.targetLng.toFixed(4)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
