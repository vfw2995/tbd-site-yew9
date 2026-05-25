import { useAmandaContent, resolveImg, s } from "@/hooks/useAmandaContent";
import { Seo } from "@/components/Seo";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const APPLY_URL = "https://edge.my1003app.com/1636364/register";

export default function Apply() {
  const { data } = useAmandaContent();
  const settings = data?.settings ?? {};

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 1px)" }}>
      <Seo
        title="Apply Now"
        description={`Start your mortgage application with ${s(settings, "site_name", "TBD")} — ${s(settings, "site_title_suffix", "Mortgage Loan Officer")} at ${s(settings, "company_name", "Home Lending")}.`}
      />

      {/* Compact apply header */}
      <div className="flex items-center justify-between px-4 py-2 bg-primary text-primary-foreground border-b border-primary/20 shrink-0">
        <div className="flex items-center gap-3">
          <img
            src={resolveImg(settings.headshot_url, "amanda-creter-photo-v2.jpg")}
            alt={s(settings, "site_name", "TBD")}
            className="w-8 h-8 rounded-full object-cover border border-primary-foreground/20"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-sm">{s(settings, "site_name", "TBD")}</span>
            <span className="text-primary-foreground/60 text-xs">{s(settings, "apply_page_subheading", "Secure application · guided every step of the way")}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open in new tab</span>
          </a>
          <Link href="/" className="flex items-center gap-1 text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to site</span>
          </Link>
        </div>
      </div>

      {/* Full-height iframe */}
      <iframe
        src={APPLY_URL}
        title="Mortgage Application"
        className="w-full flex-1 border-0"
        allow="fullscreen"
        style={{ display: "block" }}
      />
    </div>
  );
}
