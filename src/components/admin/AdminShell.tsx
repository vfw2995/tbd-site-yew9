import { type ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { clearAdminToken, getUnreadCount, type AmandaUser } from "@/lib/api";
import {
  LayoutDashboard, Settings, Home, Layers, MessageSquareQuote, FileText, UserCog,
  LogOut, Menu, X, Building2, Inbox, Users, Palette, History, FlaskConical,
} from "lucide-react";
import { Button } from "@workspace/ui/button";

export function AdminShell({ user, children }: { user: AmandaUser; children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  const { data: unreadData } = useQuery({
    queryKey: ["inbox-unread-count"],
    queryFn: getUnreadCount,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
  const unreadCount = unreadData?.count ?? 0;

  function logout() {
    clearAdminToken();
    setLocation("/admin/login");
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? location === href : location === href || location.startsWith(href + "/");

  const NAV = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    { label: "Inbox", href: "/admin/inbox", icon: Inbox, badge: unreadCount > 0 ? unreadCount : null },
    { label: "Site Settings", href: "/admin/site-settings", icon: Settings },
    { label: "Theme", href: "/admin/theme", icon: Palette },
    { label: "Homepage", href: "/admin/homepage", icon: Home },
    { label: "Loan Programs", href: "/admin/loan-programs", icon: Layers },
    { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
    { label: "Pages Content", href: "/admin/pages", icon: FileText },
    { label: "Blog", href: "/admin/blog", icon: FileText },
    { label: "Account", href: "/admin/account", icon: UserCog },
    { label: "Change History", href: "/admin/changelog", icon: History },
    { label: "Features & Tests", href: "/admin/features", icon: FlaskConical },
  ];

  const SUPER_NAV = [
    { label: "Team", href: "/admin/team", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-primary text-primary-foreground transform transition-transform ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-7 border-b border-primary-foreground/10">
          <Building2 className="w-7 h-7 text-secondary" />
          <div>
            <p className="font-serif text-lg font-bold leading-tight">Amanda Admin</p>
            <p className="text-xs text-primary-foreground/60 uppercase tracking-wider">Content Console</p>
          </div>
        </div>
        <nav className="px-4 py-6 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-secondary text-white"
                    : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {"badge" in item && (item as { badge: number | null }).badge !== null && (
                  <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center leading-none">
                    {(item as { badge: number }).badge > 99 ? "99+" : (item as { badge: number }).badge}
                  </span>
                )}
              </Link>
            );
          })}
          {user.role === "super_admin" && (
            <>
              <div className="pt-3 pb-1 px-4">
                <p className="text-[10px] uppercase tracking-widest text-primary-foreground/40 font-semibold">Admin</p>
              </div>
              {SUPER_NAV.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      active
                        ? "bg-secondary text-white"
                        : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </>
          )}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 px-4 py-5 border-t border-primary-foreground/10">
          <div className="px-4 py-3 mb-3 rounded-md bg-primary-foreground/5">
            <p className="text-xs uppercase tracking-wider text-primary-foreground/50 mb-1">Signed in</p>
            <p className="text-sm font-semibold text-white truncate">{user.displayName}</p>
            <p className="text-xs text-primary-foreground/60">{user.role}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="w-full bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Backdrop on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-background border-b border-border">
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <p className="font-serif font-bold text-primary">Amanda Admin</p>
          <span />
        </header>
        <main className="flex-1 overflow-x-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
