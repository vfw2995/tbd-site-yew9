import { Link, useLocation } from "wouter";
import { Button } from "@workspace/ui/button";
import { Menu, X, Phone, Facebook, Instagram, Building2, CalendarClock, Globe, Clock } from "lucide-react";
import { useState, useEffect } from "react";

function LocalClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);
  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const date = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return (
    <span className="flex items-center gap-1 text-[10px] text-muted-foreground tabular-nums font-medium mt-0.5">
      <Clock className="h-3 w-3 shrink-0" />
      {date} · {time}
    </span>
  );
}
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAmandaContent, resolveImg, s } from "@/hooks/useAmandaContent";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useAmandaContent();
  const settings = data?.settings ?? {};

  const phone = s(settings, "phone", "206-496-2282");
  const tel = `tel:${phone.replace(/[^0-9+]/g, "")}`;
  const fb = s(settings, "facebook_url", "");
  const ig = s(settings, "instagram_url", "");

  const navItems = [
    { label: s(settings, "nav_label_home", "Home"), href: "/" },
    { label: s(settings, "nav_label_about", "About"), href: "/about" },
    { label: s(settings, "nav_label_loan_programs", "Loan Programs"), href: "/loan-programs" },
    { label: s(settings, "nav_label_calculators", "Calculators"), href: "/calculators" },
    { label: s(settings, "nav_label_blog", "Blog"), href: "/blog" },
    { label: s(settings, "nav_label_contact", "Contact"), href: "/contact" },
  ];

  return (
    <header className="w-full bg-background border-b border-border/40 relative z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-6 gap-6 md:gap-0">
          
          <div className="flex items-center gap-4">
            <img 
              src={resolveImg(settings.headshot_url, "amanda-headshot.png")} 
              alt={s(settings, "site_name", "TBD")} 
              className="w-16 h-16 rounded-full object-cover border-2 border-primary/10 shadow-sm"
            />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-2xl md:text-3xl tracking-tight text-primary">{s(settings, "site_name", "TBD")}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{s(settings, "site_title_suffix", "Mortgage Loan Officer")} &bull; NMLS #{s(settings, "nmls", "")}</span>
              {s(settings, "website_url", "") && (
                <div className="mt-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold block leading-tight">{s(settings, "brand_name", "Creter Home Lending")}</span>
                  <a
                    href={s(settings, "website_url", "")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-secondary hover:text-secondary/80 transition-colors"
                  >
                    <Globe className="w-3 h-3" />
                    {s(settings, "website_url", "").replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 text-primary">
              <Building2 className="w-6 h-6 text-secondary" />
              <span className="font-serif text-2xl font-bold tracking-tight">{s(settings, "brand_name", "Creter Home Lending")}</span>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">{s(settings, "navbar_co_brand_text", "Powered By")} {s(settings, "company_name", "Home Lending")}</span>
          </div>

          <div className="flex items-center gap-6">
            <a href={tel} className="hidden sm:flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-full bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{s(settings, "navbar_call_label", "Call Directly")}</span>
                <span className="text-sm font-bold text-primary">{phone}</span>
                <LocalClock />
              </div>
            </a>
            <div className="flex items-center gap-2">
              {fb && (
                <a href={fb} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors text-foreground" aria-label="Facebook">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {ig && (
                <a href={ig} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors text-foreground" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              <div className="ml-2">
                <ThemeToggle enabled={s(settings, "dark_mode_toggle_enabled", "false") === "true"} />
              </div>
            </div>
          </div>
          
          <div className="flex lg:hidden flex-col items-center justify-center w-full pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-primary">
              <Building2 className="w-5 h-5 text-secondary" />
              <span className="text-sm text-foreground font-serif font-bold tracking-tight">{s(settings, "brand_name", "Creter Home Lending")}</span>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">{s(settings, "navbar_co_brand_text", "Powered By")} {s(settings, "company_name", "Home Lending")}</span>
          </div>

        </div>
      </div>

      <div className="sticky top-0 shadow-md border-t border-white/10" style={{backgroundColor: "#0d3320"}}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    location === item.href
                      ? "bg-white/15 text-white font-semibold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="md:hidden flex items-center">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                {isOpen ? <X className="h-5 w-5 mr-2" /> : <Menu className="h-5 w-5 mr-2" />}
                <span className="font-semibold uppercase tracking-wider text-xs">{s(settings, "navbar_menu_label", "Menu")}</span>
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="hidden sm:flex font-semibold bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white" asChild>
                <a href={tel}><CalendarClock className="w-4 h-4 mr-2" /> {s(settings, "navbar_schedule_label", "Schedule a Call")}</a>
              </Button>
              <Link href="/apply">
                <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-white border-0 font-bold px-6 shadow-sm">
                  {s(settings, "navbar_apply_label", "Apply Now")}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-background text-foreground border-t shadow-xl absolute w-full left-0 z-50">
            <div className="space-y-1 px-4 py-4 flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-md text-base font-medium ${
                    location === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t flex flex-col gap-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={tel}><CalendarClock className="w-4 h-4 mr-2" /> {s(settings, "navbar_schedule_label", "Schedule a Call")}</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
