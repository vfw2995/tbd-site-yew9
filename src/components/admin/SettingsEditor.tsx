import { useEffect, useState } from "react";
import { Input } from "@workspace/ui/input";
import { Textarea } from "@workspace/ui/textarea";
import { Label } from "@workspace/ui/label";
import { Button } from "@workspace/ui/button";
import { api } from "@/lib/api";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";
import { OgCardPreview } from "./OgCardPreview";
import { BusinessCardPreview } from "./BusinessCardPreview";
import { Save, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export interface FieldSpec {
  key: string;
  label: string;
  type?: "text" | "textarea" | "image" | "markdown" | "password";
  rows?: number;
  fallback?: string;
  help?: string;
  /** Render a social card preview below this image upload field */
  ogPreview?: boolean;
  /** Settings key for the preview title (defaults to seo_meta_title) */
  ogTitleKey?: string;
  /** Settings key for the preview description (defaults to seo_meta_description) */
  ogDescriptionKey?: string;
  /** Page path appended to website_url for the copy-link URL (e.g. "/about") */
  ogPagePath?: string;
}

export interface FieldSection {
  title: string;
  description?: string;
  fields: FieldSpec[];
  cardPreview?: boolean;
}

interface Props {
  sections: FieldSection[];
}

export function SettingsEditor({ sections }: Props) {
  const [original, setOriginal] = useState<Record<string, string> | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const qc = useQueryClient();

  useEffect(() => {
    (async () => {
      try {
        const data = await api<Record<string, string>>("/admin/settings", { auth: true });
        setOriginal(data);
        setValues(data);
      } catch (err) {
        toast({ title: "Failed to load settings", description: (err as Error).message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const dirty = original !== null && sections.some((s) =>
    s.fields.some((f) => (values[f.key] ?? "") !== (original[f.key] ?? ""))
  );

  // Warn before navigation if unsaved
  useEffect(() => {
    function beforeUnload(e: BeforeUnloadEvent) {
      if (dirty) { e.preventDefault(); e.returnValue = ""; }
    }
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  async function save() {
    if (!original) return;
    setSaving(true);
    const changed: Record<string, string> = {};
    for (const sec of sections) {
      for (const f of sec.fields) {
        const v = values[f.key] ?? "";
        if (v !== (original[f.key] ?? "")) changed[f.key] = v;
      }
    }
    try {
      await api("/admin/settings", { method: "PUT", body: { values: changed }, auth: true });
      setOriginal({ ...original, ...changed });
      qc.invalidateQueries({ queryKey: ["amanda", "content"] });
      toast({ title: "Saved", description: `${Object.keys(changed).length} setting(s) updated.` });
    } catch (err) {
      toast({ title: "Save failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  function setVal(k: string, v: string) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  return (
    <div className="space-y-10">
      {sections.map((sec) => (
        <section key={sec.title} className="bg-background border border-border rounded-xl p-6 md:p-8 shadow-sm">
          <header className="mb-6">
            <h2 className="text-xl font-serif font-bold text-foreground">{sec.title}</h2>
            {sec.description && <p className="text-sm text-muted-foreground mt-1">{sec.description}</p>}
          </header>
          <div className="space-y-5">
            {sec.fields.map((f) => {
              const val = values[f.key] ?? "";
              return (
                <div key={f.key} className="space-y-1.5">
                  {f.type === "image" ? (
                    <>
                      <ImageUpload
                        value={val}
                        onChange={(v) => setVal(f.key, v)}
                        label={f.label}
                        fallback={f.fallback}
                      />
                      {f.ogPreview && (
                        <OgCardPreview
                          imageUrl={val}
                          fallbackImage={f.fallback}
                          title={values[f.ogTitleKey ?? "seo_meta_title"] ?? ""}
                          description={values[f.ogDescriptionKey ?? "seo_meta_description"] ?? ""}
                          siteUrl={values["website_url"] ?? ""}
                          pagePath={f.ogPagePath}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <Label htmlFor={f.key} className="text-sm font-medium">{f.label}</Label>
                      {f.type === "textarea" || f.type === "markdown" ? (
                        <Textarea
                          id={f.key}
                          value={val}
                          onChange={(e) => setVal(f.key, e.target.value)}
                          rows={f.rows ?? (f.type === "markdown" ? 10 : 4)}
                          className={f.type === "markdown" ? "font-mono text-sm" : ""}
                        />
                      ) : f.type === "password" ? (
                        <Input
                          id={f.key}
                          type="password"
                          autoComplete="new-password"
                          placeholder={val ? "••••••••" : ""}
                          value={val}
                          onChange={(e) => setVal(f.key, e.target.value)}
                        />
                      ) : (
                        <Input id={f.key} value={val} onChange={(e) => setVal(f.key, e.target.value)} />
                      )}
                      {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
                    </>
                  )}
                </div>
              );
            })}
            {sec.cardPreview && <BusinessCardPreview values={values} />}
          </div>
        </section>
      ))}

      <div className="sticky bottom-4 z-10 flex justify-end">
        <div className={`bg-background border rounded-xl px-4 py-3 shadow-lg flex items-center gap-4 transition-all ${dirty ? "border-secondary" : "border-border opacity-70"}`}>
          <span className="text-sm text-muted-foreground">
            {dirty ? "You have unsaved changes" : "All changes saved"}
          </span>
          <Button onClick={save} disabled={!dirty || saving} className="bg-secondary hover:bg-secondary/90 text-white">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
