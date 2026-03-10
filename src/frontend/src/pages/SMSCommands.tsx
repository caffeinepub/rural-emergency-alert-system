import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCheck, Copy, MessageSquare, Terminal } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const SMS_COMMANDS = [
  {
    category: "Incident Reporting",
    color: "text-orange-400",
    commands: [
      {
        cmd: "REPORT [TYPE] [VILLAGE]",
        example: "REPORT FLOOD Kovilpatti",
        description: "Report a new emergency incident in your village",
        tamil: "புதிய அவசரநிலையை புகாரளிக்கவும்",
      },
      {
        cmd: "REPORT FIRE [VILLAGE] [DESCRIPTION]",
        example: "REPORT FIRE Madurai sugarcane field burning",
        description: "Report a fire incident with optional description",
        tamil: "தீ விபத்தை புகாரளிக்கவும்",
      },
      {
        cmd: "REPORT MEDICAL [VILLAGE]",
        example: "REPORT MEDICAL Dindigul",
        description: "Report a medical emergency requiring ambulance/doctor",
        tamil: "மருத்துவ அவசரநிலையை புகாரளிக்கவும்",
      },
      {
        cmd: "REPORT CYCLONE [VILLAGE]",
        example: "REPORT CYCLONE Rameswaram",
        description: "Report cyclone damage or imminent threat",
        tamil: "புயல் சேதத்தை புகாரளிக்கவும்",
      },
      {
        cmd: "REPORT DROUGHT [VILLAGE]",
        example: "REPORT DROUGHT Sivaganga",
        description:
          "Report drought conditions affecting agriculture or water supply",
        tamil: "வறட்சியை புகாரளிக்கவும்",
      },
    ],
  },
  {
    category: "Status & Updates",
    color: "text-blue-400",
    commands: [
      {
        cmd: "STATUS",
        example: "STATUS",
        description: "Get current emergency status for your area",
        tamil: "உங்கள் பகுதியின் தற்போதைய நிலையை அறியவும்",
      },
      {
        cmd: "STATUS [VILLAGE]",
        example: "STATUS Thanjavur",
        description: "Get status for a specific village",
        tamil: "குறிப்பிட்ட கிராமத்தின் நிலையை அறியவும்",
      },
      {
        cmd: "UPDATE [ID] [STATUS]",
        example: "UPDATE 42 RESOLVED",
        description: "Update status of an incident by ID",
        tamil: "சம்பவத்தின் நிலையை புதுப்பிக்கவும்",
      },
    ],
  },
  {
    category: "Volunteer Registration",
    color: "text-green-400",
    commands: [
      {
        cmd: "VOLUNTEER JOIN [NAME] [PHONE]",
        example: "VOLUNTEER JOIN Rajan 9876543210",
        description: "Register as a volunteer for emergency response",
        tamil: "தன்னார்வலராக பதிவு செய்யவும்",
      },
      {
        cmd: "VOLUNTEER AVAILABLE",
        example: "VOLUNTEER AVAILABLE",
        description: "Mark yourself as available for deployment",
        tamil: "உங்களை கிடைக்கக்கூடியவராக குறிக்கவும்",
      },
      {
        cmd: "VOLUNTEER DEPLOYED",
        example: "VOLUNTEER DEPLOYED",
        description: "Mark yourself as currently deployed at a site",
        tamil: "நீங்கள் தொடர்ந்து செயல்படுகிறீர்கள் என குறிக்கவும்",
      },
    ],
  },
  {
    category: "Alerts",
    color: "text-red-400",
    commands: [
      {
        cmd: "ALERT [MESSAGE]",
        example: "ALERT Flash flood warning eastern region evacuate",
        description: "Broadcast an emergency alert (admin only)",
        tamil: "அவசர அறிவிப்பை ஒலிபரப்பவும் (நிர்வாகி மட்டும்)",
      },
      {
        cmd: "ALERTS",
        example: "ALERTS",
        description: "List the latest active emergency alerts",
        tamil: "சமீபத்திய அவசர அறிவிப்புகளை பட்டியலிடவும்",
      },
    ],
  },
  {
    category: "General",
    color: "text-muted-foreground",
    commands: [
      {
        cmd: "HELP",
        example: "HELP",
        description: "Get a list of all available SMS commands",
        tamil: "அனைத்து SMS கட்டளைகளையும் பெறவும்",
      },
      {
        cmd: "HELP [COMMAND]",
        example: "HELP REPORT",
        description: "Get detailed help for a specific command",
        tamil: "குறிப்பிட்ட கட்டளையின் விவரங்களை பெறவும்",
      },
    ],
  },
];

function CommandCard({
  cmd,
  example,
  description,
  tamil,
  index,
}: {
  cmd: string;
  example: string;
  description: string;
  tamil: string;
  index: number;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(example);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group relative p-3 rounded-md bg-muted/20 border border-border hover:border-border/70 hover:bg-muted/30 transition-all"
      data-ocid={`sms.item.${index + 1}`}
    >
      <div className="flex items-start justify-between gap-2">
        <code className="text-xs font-mono text-primary">{cmd}</code>
        <button
          type="button"
          onClick={handleCopy}
          data-ocid="sms.button"
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
          title="Copy example"
        >
          {copied ? (
            <CheckCheck size={13} className="text-green-400" />
          ) : (
            <Copy size={13} />
          )}
        </button>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
      <p className="text-xs text-muted-foreground/70 mt-0.5">{tamil}</p>
      <div className="mt-2 px-2 py-1 bg-background/60 rounded border border-border/50">
        <code className="text-xs font-mono text-foreground/70">
          $ {example}
        </code>
      </div>
    </motion.div>
  );
}

export function SMSCommands() {
  return (
    <div data-ocid="sms.section" className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-primary/10 border border-primary/20">
          <Terminal size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-mono tracking-tight">
            SMS COMMAND REFERENCE
          </h1>
          <p className="text-sm text-muted-foreground">
            Send SMS to{" "}
            <span className="font-mono text-primary">1800-XXX-XXXX</span>{" "}
            (toll-free)
          </p>
        </div>
      </div>

      {/* Quick reference banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-3 px-4">
          <div className="flex flex-wrap items-center gap-2">
            <MessageSquare size={14} className="text-primary" />
            <span className="text-xs font-mono text-muted-foreground">
              QUICK COMMANDS:
            </span>
            {[
              "HELP",
              "STATUS",
              "REPORT FLOOD [VILLAGE]",
              "VOLUNTEER JOIN",
              "ALERTS",
            ].map((cmd) => (
              <Badge
                key={cmd}
                variant="outline"
                className="font-mono text-xs bg-background/50 text-foreground/70 border-border"
              >
                {cmd}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Command sections */}
      <div className="space-y-5">
        {SMS_COMMANDS.map((section) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-border bg-card">
              <CardHeader className="pb-2 border-b border-border">
                <CardTitle
                  className={`text-xs font-mono uppercase tracking-widest flex items-center gap-2 ${section.color}`}
                >
                  <Terminal size={12} />
                  {section.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {section.commands.map((cmd, idx) => (
                    <CommandCard key={cmd.cmd} {...cmd} index={idx} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Notes */}
      <Card className="border-border bg-card">
        <CardContent className="py-4">
          <p className="text-xs font-mono text-muted-foreground space-y-1">
            <span className="block text-primary uppercase mb-2">Notes</span>
            <span className="block">
              • Commands are case-insensitive. REPORT = report = Report.
            </span>
            <span className="block">
              • Replace [VILLAGE], [NAME], [PHONE] with actual values. Do not
              include brackets.
            </span>
            <span className="block">
              • Responses are sent back in both English and Tamil (தமிழ்).
            </span>
            <span className="block">
              • Emergency: call 108 (ambulance), 101 (fire), 100 (police).
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
