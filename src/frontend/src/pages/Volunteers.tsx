import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { VolunteerStatus } from "../backend.d";
import { VolunteerStatusBadge } from "../components/VolunteerStatusBadge";
import {
  useRegisterVolunteer,
  useUpdateVolunteerStatus,
  useVolunteers,
} from "../hooks/useQueries";

const LOADING_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5"];

export function Volunteers() {
  const { data: volunteers, isLoading } = useVolunteers();
  const registerVolunteer = useRegisterVolunteer();
  const updateStatus = useUpdateVolunteerStatus();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    skills: "",
    village: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.village) {
      toast.error("Name, phone and village are required");
      return;
    }
    try {
      await registerVolunteer.mutateAsync(form);
      toast.success("Volunteer registered successfully");
      setOpen(false);
      setForm({ name: "", phone: "", skills: "", village: "" });
    } catch {
      toast.error("Failed to register volunteer");
    }
  };

  const handleStatusChange = async (id: bigint, newStatus: VolunteerStatus) => {
    try {
      await updateStatus.mutateAsync({ volunteerId: id, newStatus });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div data-ocid="volunteers.section" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-mono tracking-tight">
            VOLUNTEERS
          </h1>
          <p className="text-sm text-muted-foreground">
            Volunteer registry and deployment status
          </p>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              data-ocid="volunteers.open_modal_button"
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus size={16} />
              Register Volunteer
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-card border-border w-full sm:max-w-md overflow-y-auto"
            data-ocid="volunteers.sheet"
          >
            <SheetHeader>
              <SheetTitle className="font-mono uppercase tracking-wider">
                Register New Volunteer
              </SheetTitle>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase">
                  Full Name *
                </Label>
                <Input
                  data-ocid="volunteers.input"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Arjun Kumar"
                  className="bg-input border-border font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase">Phone *</Label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="+91 9876543210"
                  className="bg-input border-border font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase">Village *</Label>
                <Input
                  value={form.village}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, village: e.target.value }))
                  }
                  placeholder="e.g. Madurai"
                  className="bg-input border-border font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase">Skills</Label>
                <Input
                  value={form.skills}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, skills: e.target.value }))
                  }
                  placeholder="e.g. First Aid, Swimming, Search & Rescue"
                  className="bg-input border-border font-mono"
                />
              </div>
              <Button
                type="submit"
                data-ocid="volunteers.submit_button"
                disabled={registerVolunteer.isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {registerVolunteer.isPending ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register Volunteer"
                )}
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {isLoading ? (
        <div data-ocid="volunteers.loading_state" className="space-y-2">
          {LOADING_KEYS.map((key) => (
            <Skeleton key={key} className="h-12 w-full" />
          ))}
        </div>
      ) : !volunteers || volunteers.length === 0 ? (
        <Card
          className="border-border bg-card"
          data-ocid="volunteers.empty_state"
        >
          <CardContent className="py-16 text-center text-muted-foreground font-mono">
            <Users size={32} className="mx-auto mb-3 opacity-30" />
            NO VOLUNTEERS REGISTERED
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border bg-card overflow-hidden">
          <Table data-ocid="volunteers.table">
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs font-mono uppercase text-muted-foreground">
                  Name
                </TableHead>
                <TableHead className="text-xs font-mono uppercase text-muted-foreground">
                  Village
                </TableHead>
                <TableHead className="text-xs font-mono uppercase text-muted-foreground hidden md:table-cell">
                  Phone
                </TableHead>
                <TableHead className="text-xs font-mono uppercase text-muted-foreground hidden lg:table-cell">
                  Skills
                </TableHead>
                <TableHead className="text-xs font-mono uppercase text-muted-foreground">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.map((vol, idx) => (
                <TableRow
                  key={vol.id.toString()}
                  className="border-border hover:bg-muted/10"
                  data-ocid={`volunteers.item.${idx + 1}`}
                >
                  <TableCell className="font-mono font-medium">
                    {vol.name}
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground">
                    {vol.village}
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground hidden md:table-cell">
                    {vol.phone}
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground text-sm hidden lg:table-cell max-w-48 truncate">
                    {vol.skills}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={vol.status}
                      onValueChange={(v) =>
                        handleStatusChange(vol.id, v as VolunteerStatus)
                      }
                    >
                      <SelectTrigger
                        data-ocid={`volunteers.select.${idx + 1}`}
                        className="h-7 w-32 text-xs bg-transparent border-transparent hover:border-border font-mono"
                      >
                        <VolunteerStatusBadge status={vol.status} />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {Object.values(VolunteerStatus).map((s) => (
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
