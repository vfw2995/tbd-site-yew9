import { useState } from "react";
import { resolveImg } from "@/hooks/useAmandaContent";
import { Globe, Link2, Check, ExternalLink } from "lucide-react";

interface Props {
  imageUrl: string;
  title: string;
  description: string;
  siteUrl?: string;
  fallbackImage?: string;
  pagePath?: string;
}

export function OgCardPreview({ imageUrl, title, description, siteUrl, fallbackImage = "hero-bg.png", pagePath }: Props) {
  const resolvedImage = resolveImg(imageUrl, fallbackImage);
  const base = siteUrl ? siteUrl.replace(/\/$/, "") : "";
  const fullUrl = pagePath ? `${base}${pagePath}` : base;
  const displayUrl = fullUrl ? fullUrl.replace(/^https?:\/\//, "") : "yoursite.com";
  const [copied, setCopied] = useState(false);

  function copyLink() {
    if (!fullUrl) return;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function testOnSocial() {
    if (!fullUrl) return;
    window.open(`https://www.opengraph.xyz/url/${encodeURIComponent(fullUrl)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Social card preview</p>
        {fullUrl && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={copyLink}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              {copied ? <Check className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
              {copied ? "Copied!" : "Copy link"}
            </button>
            <button
              type="button"
              onClick={testOnSocial}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Test on social
            </button>
          </div>
        )}
      </div>
      <div
        className="relative rounded-xl overflow-hidden border border-border shadow-sm bg-muted"
        style={{ aspectRatio: "1200 / 630", maxWidth: 480 }}
      >
        {resolvedImage && (
          <img
            src={resolvedImage}
            alt="OG preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Globe className="w-3 h-3 text-white/60 shrink-0" />
            <span className="text-white/60 text-[10px] uppercase tracking-wider truncate">{displayUrl}</span>
          </div>
          <p className="text-white font-semibold text-sm leading-snug line-clamp-2">
            {title || <span className="opacity-40 italic">No title set</span>}
          </p>
          {description && (
            <p className="text-white/70 text-xs mt-1 line-clamp-2 leading-snug">{description}</p>
          )}
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground mt-1.5">
        Approximate preview — actual appearance varies by platform.
      </p>
    </div>
  );
}
