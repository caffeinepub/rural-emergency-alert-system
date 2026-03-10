import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import {
  AlertTriangle,
  LayoutDashboard,
  LogIn,
  LogOut,
  Map as MapIcon,
  Menu,
  Radio,
  Terminal,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { Alerts } from "./pages/Alerts";
import { Dashboard } from "./pages/Dashboard";
import { IncidentsMap } from "./pages/IncidentsMap";
import { SMSCommands } from "./pages/SMSCommands";
import { Volunteers } from "./pages/Volunteers";

type Page = "dashboard" | "map" | "alerts" | "volunteers" | "sms";

const NAV_ITEMS: {
  id: Page;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    shortLabel: "Dash",
    icon: LayoutDashboard,
  },
  { id: "map", label: "Incidents Map", shortLabel: "Map", icon: MapIcon },
  { id: "alerts", label: "Alerts", shortLabel: "Alerts", icon: Radio },
  {
    id: "volunteers",
    label: "Volunteers",
    shortLabel: "Vols",
    icon: Users,
  },
  {
    id: "sms",
    label: "SMS Commands",
    shortLabel: "SMS",
    icon: Terminal,
  },
];

function PageContent({ page }: { page: Page }) {
  switch (page) {
    case "dashboard":
      return <Dashboard />;
    case "map":
      return <IncidentsMap />;
    case "alerts":
      return <Alerts />;
    case "volunteers":
      return <Volunteers />;
    case "sms":
      return <SMSCommands />;
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();

  const isLoggedIn = !!identity;
  const principal = identity?.getPrincipal().toString();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50 lg:z-auto
          flex flex-col
          w-60 h-full
          bg-sidebar border-r border-sidebar-border
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/20 border border-primary/30">
            <AlertTriangle size={16} className="text-primary" />
          </div>
          <div>
            <div className="text-sm font-bold font-mono tracking-wider text-sidebar-foreground">
              RURAL ALERT
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              Tamil Nadu
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                type="button"
                key={item.id}
                data-ocid={`nav.${item.id}.link`}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-mono
                  transition-all duration-150
                  ${
                    active
                      ? "bg-sidebar-accent text-sidebar-primary font-semibold"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  }
                `}
              >
                <Icon
                  size={15}
                  className={
                    active ? "text-sidebar-primary" : "text-muted-foreground"
                  }
                />
                {item.label}
                {active && (
                  <div className="ml-auto w-1 h-4 rounded-full bg-sidebar-primary" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Auth */}
        <div className="p-3 border-t border-sidebar-border">
          {isInitializing ? (
            <div className="px-3 py-2 text-xs font-mono text-muted-foreground">
              Loading...
            </div>
          ) : isLoggedIn ? (
            <div className="space-y-2">
              <div className="px-3 py-1">
                <div className="text-xs font-mono text-muted-foreground uppercase mb-0.5">
                  Principal
                </div>
                <div className="text-xs font-mono text-foreground truncate">
                  {principal?.slice(0, 20)}...
                </div>
              </div>
              <button
                type="button"
                data-ocid="nav.logout.button"
                onClick={() => clear()}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-mono text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          ) : (
            <Button
              data-ocid="nav.login.button"
              onClick={() => login()}
              disabled={loginStatus === "logging-in"}
              size="sm"
              className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs"
            >
              <LogIn size={13} />
              {loginStatus === "logging-in" ? "Connecting..." : "Sign In"}
            </Button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button
            type="button"
            data-ocid="nav.mobile_menu.button"
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-primary" />
            <span className="font-mono font-bold text-sm tracking-wider">
              RURAL ALERT
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <PageContent page={currentPage} />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-border text-xs font-mono text-muted-foreground text-center">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </footer>
      </div>

      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "oklch(0.13 0.005 250)",
            border: "1px solid oklch(0.2 0.01 250)",
            color: "oklch(0.93 0.01 250)",
          },
        }}
      />
    </div>
  );
}
