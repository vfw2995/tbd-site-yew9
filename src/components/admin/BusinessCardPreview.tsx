import { Phone, Mail, Globe } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface Props {
  values: Record<string, string>;
}

export function BusinessCardPreview({ values }: Props) {
  const name = values["site_name"] || "TBD";
  const title = values["site_title_suffix"] || "Mortgage Loan Officer";
  const company = values["company_name"] || "Home Lending";
  const nmls = values["nmls"] || "";
  const phone = values["phone"] || "206-496-2282";
  const email = values["email"] || "clubmanager@vfwredmond.org";
  const websiteUrl = values["website_url"] || "https://creterhomelending.com";
  const websiteDisplay = websiteUrl.replace(/^https?:\/\//, "");

  return (
    <div className="mt-6 rounded-xl border border-border bg-muted/30 p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        Business Card Preview
      </p>
      <div className="flex justify-center">
        <div className="bg-primary text-primary-foreground rounded-2xl shadow-xl p-8 w-full max-w-sm">
          <p className="text-xs uppercase tracking-widest text-primary-foreground/60 mb-1">{company}</p>
          <h3 className="text-2xl font-serif font-bold mb-0.5">{name}</h3>
          <p className="text-sm text-primary-foreground/70 mb-5">
            {title}{nmls ? <> &middot; NMLS #{nmls}</> : null}
          </p>

          <div className="flex items-end gap-6">
            <div className="space-y-2 text-sm flex-1">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-foreground/50 shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-foreground/50 shrink-0" />
                <span className="break-all text-xs">{email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-secondary shrink-0" />
                <span className="font-bold text-secondary">{websiteDisplay}</span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-center gap-1.5">
              <div className="bg-white rounded-xl p-2 shadow-lg">
                <QRCodeSVG
                  value={websiteUrl || "https://creterhomelending.com"}
                  size={88}
                  bgColor="#ffffff"
                  fgColor="#0f1f3d"
                  level="M"
                />
              </div>
              <p className="text-[9px] text-primary-foreground/50 uppercase tracking-wider">Scan me</p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-3">
        Updates live as you edit — save to apply changes sitewide.
      </p>
    </div>
  );
}
