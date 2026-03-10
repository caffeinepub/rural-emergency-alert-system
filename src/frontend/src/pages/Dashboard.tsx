import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  AlertTriangle,
  Radio,
  ShieldAlert,
  Users,
  Wifi,
} from "lucide-react";
import { motion } from "motion/react";
import { SeverityBadge } from "../components/SeverityBadge";
import { StatusBadge } from "../components/StatusBadge";
import { useAlerts, useIncidents, useStats } from "../hooks/useQueries";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const STAT_SKELETONS = ["s1", "s2", "s3", "s4"];
const INC_SKELETONS = ["i1", "i2", "i3", "i4"];
const ALERT_SKELETONS = ["a1", "a2", "a3"];

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  index,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  index: number;
}) {
  return (
    <motion.div variants={item} custom={index}>
      <Card className="border-border bg-card relative overflow-hidden">
        <div
          className={`absolute inset-0 opacity-5 ${color}`}
          style={{ background: "currentColor" }}
        />
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Icon size={14} className={color} />
            {label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold font-mono ${color}`}>{value}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: incidents, isLoading: incLoading } = useIncidents();
  const { data: alerts, isLoading: alertsLoading } = useAlerts();

  const totalIncidents = stats
    ? Number(
        (stats.incidentsBySeverity.low ?? 0n) +
          (stats.incidentsBySeverity.medium ?? 0n) +
          (stats.incidentsBySeverity.high ?? 0n) +
          (stats.incidentsBySeverity.critical ?? 0n),
      )
    : 0;

  const totalVolunteers = stats
    ? Number(
        (stats.volunteersByStatus.available ?? 0n) +
          (stats.volunteersByStatus.deployed ?? 0n) +
          (stats.volunteersByStatus.unavailable ?? 0n),
      )
    : 0;

  const recentIncidents = (incidents ?? []).slice(0, 8);
  const recentAlerts = (alerts ?? []).slice(0, 5);

  return (
    <div data-ocid="dashboard.section" className="space-y-6">
      <div>
        <h1 className="text-xl font-bold font-mono tracking-tight text-foreground">
          EMERGENCY OPERATIONS CENTER
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tamil Nadu Rural Emergency Response System
        </p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {statsLoading ? (
          STAT_SKELETONS.map((key) => (
            <Skeleton
              key={key}
              className="h-24 rounded-lg"
              data-ocid="dashboard.loading_state"
            />
          ))
        ) : (
          <>
            <StatCard
              icon={AlertTriangle}
              label="Total Incidents"
              value={totalIncidents}
              color="text-orange-400"
              index={0}
            />
            <StatCard
              icon={ShieldAlert}
              label="Critical"
              value={Number(stats?.incidentsBySeverity.critical ?? 0n)}
              color="text-red-400"
              index={1}
            />
            <StatCard
              icon={Users}
              label="Volunteers"
              value={totalVolunteers}
              color="text-blue-400"
              index={2}
            />
            <StatCard
              icon={Activity}
              label="Available"
              value={Number(stats?.volunteersByStatus.available ?? 0n)}
              color="text-green-400"
              index={3}
            />
          </>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Incidents */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="text-sm font-mono uppercase tracking-widest flex items-center gap-2">
                <Wifi size={14} className="text-primary" />
                Recent Incidents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {incLoading ? (
                <div
                  className="p-4 space-y-2"
                  data-ocid="incidents.loading_state"
                >
                  {INC_SKELETONS.map((key) => (
                    <Skeleton key={key} className="h-8 w-full" />
                  ))}
                </div>
              ) : recentIncidents.length === 0 ? (
                <div
                  data-ocid="incidents.empty_state"
                  className="p-8 text-center text-muted-foreground text-sm font-mono"
                >
                  NO INCIDENTS REPORTED
                </div>
              ) : (
                <Table data-ocid="incidents.table">
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-xs font-mono uppercase text-muted-foreground">
                        Village
                      </TableHead>
                      <TableHead className="text-xs font-mono uppercase text-muted-foreground">
                        Type
                      </TableHead>
                      <TableHead className="text-xs font-mono uppercase text-muted-foreground">
                        Severity
                      </TableHead>
                      <TableHead className="text-xs font-mono uppercase text-muted-foreground">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentIncidents.map((inc, idx) => (
                      <TableRow
                        key={inc.id.toString()}
                        className="border-border hover:bg-muted/20"
                        data-ocid={`incidents.item.${idx + 1}`}
                      >
                        <TableCell className="font-mono text-sm">
                          {inc.village}
                        </TableCell>
                        <TableCell className="font-mono text-sm capitalize text-muted-foreground">
                          {inc.incidentType}
                        </TableCell>
                        <TableCell>
                          <SeverityBadge severity={inc.severity} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={inc.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border bg-card h-full">
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="text-sm font-mono uppercase tracking-widest flex items-center gap-2">
                <Radio size={14} className="text-primary" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {alertsLoading ? (
                <div className="p-4 space-y-2" data-ocid="alerts.loading_state">
                  {ALERT_SKELETONS.map((key) => (
                    <Skeleton key={key} className="h-16 w-full" />
                  ))}
                </div>
              ) : recentAlerts.length === 0 ? (
                <div
                  data-ocid="alerts.empty_state"
                  className="p-8 text-center text-muted-foreground text-sm font-mono"
                >
                  NO ALERTS SENT
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {recentAlerts.map((alert, idx) => (
                    <div
                      key={alert.id.toString()}
                      className="p-4 hover:bg-muted/10 transition-colors"
                      data-ocid={`alerts.item.${idx + 1}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-mono text-primary uppercase">
                          {alert.alertType}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          r={alert.radiusKm}km
                        </span>
                      </div>
                      <p className="text-sm mt-1 text-foreground line-clamp-2">
                        {alert.messageEnglish}
                      </p>
                      <p className="text-xs mt-1 text-muted-foreground">
                        {alert.messageTamil}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Severity breakdown */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="text-sm font-mono uppercase tracking-widest">
                Incident Severity Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(
                  [
                    {
                      label: "Low",
                      value: stats.incidentsBySeverity.low,
                      cls: "text-green-400",
                    },
                    {
                      label: "Medium",
                      value: stats.incidentsBySeverity.medium,
                      cls: "text-yellow-400",
                    },
                    {
                      label: "High",
                      value: stats.incidentsBySeverity.high,
                      cls: "text-orange-400",
                    },
                    {
                      label: "Critical",
                      value: stats.incidentsBySeverity.critical,
                      cls: "text-red-400",
                    },
                  ] as const
                ).map(({ label, value, cls }) => (
                  <div key={label} className="text-center">
                    <div className={`text-2xl font-bold font-mono ${cls}`}>
                      {Number(value ?? 0n)}
                    </div>
                    <div className="text-xs font-mono uppercase text-muted-foreground mt-1">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
