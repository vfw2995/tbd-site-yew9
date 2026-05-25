import { useState, useEffect } from "react";
import { THEMES, DEFAULT_THEME_ID } from "@/lib/themes";
import { api } from "@/lib/api";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Palette, Moon } from "lucide-react";
import { Button } from "@workspace/ui/button";

export default function ThemeSwitcher() {
  const [current, setCurrent] = useState<string>(DEFAULT_THEME_ID);
  const [pending, setPending] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [darkToggleEnabled, setDarkToggleEnabled] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();

  useEffect(() => {
    api<Record<string, string>>("/admin/settings", { auth: true }).then((data) => {
      if (data.site_theme) setCurrent(data.site_theme);
      setDarkToggleEnabled(data.dark_mode_toggle_enabled === "true");
    });
  }, []);

  async function applyTheme(id: string) {
    if (saving) return;
    setPending(id);
    setSaving(true);
    try {
      await api("/admin/settings", {
        method: "PUT",
        body: { values: { site_theme: id } },
        auth: true,
      });
      setCurrent(id);
      await qc.invalidateQueries({ queryKey: ["amanda", "content"] });
      toast({ title: "Theme applied!", description: `${THEMES.find((t) => t.id === id)?.name} is now active.` });
    } catch (err) {
      toast({ title: "Failed to save theme", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
      setPending(null);
    }
  }

  async function toggleDarkMode(enabled: boolean) {
    setSavingToggle(true);
    try {
      await api("/admin/settings", {
        method: "PUT",
        body: { values: { dark_mode_toggle_enabled: enabled ? "true" : "false" } },
        auth: true,
      });
      setDarkToggleEnabled(enabled);
      await qc.invalidateQueries({ queryKey: ["amanda", "content"] });
      toast({ title: enabled ? "Dark mode toggle enabled" : "Dark mode toggle disabled", description: enabled ? "Visitors can now switch to dark mode." : "The toggle is now hidden from visitors." });
    } catch (err) {
      toast({ title: "Failed to save setting", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSavingToggle(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Palette className="w-6 h-6 text-secondary" />
          <h1 className="text-2xl font-serif font-bold text-foreground">Theme</h1>
        </div>
        <p className="text-muted-foreground">Choose a color theme for the public site. Changes apply instantly for all visitors.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {THEMES.map((theme) => {
          const isActive = current === theme.id;
          const isLoading = pending === theme.id && saving;
          return (
            <button
              key={theme.id}
              onClick={() => applyTheme(theme.id)}
              disabled={saving}
              className={`relative text-left rounded-2xl border-2 p-6 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive
                  ? "border-secondary shadow-lg bg-card"
                  : "border-border bg-card hover:border-secondary/40 hover:shadow-md"
              } ${saving && !isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {isActive && (
                <span className="absolute top-4 right-4 w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </span>
              )}
              {isLoading && (
                <span className="absolute top-4 right-4">
                  <Loader2 className="w-5 h-5 text-secondary animate-spin" />
                </span>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-2">
                  <span className="w-9 h-9 rounded-full border-2 border-white shadow-md" style={{ background: theme.primary }} />
                  <span className="w-9 h-9 rounded-full border-2 border-white shadow-md -ml-3" style={{ background: theme.secondary }} />
                  <span className="w-9 h-9 rounded-full border border-border shadow-sm -ml-3" style={{ background: theme.background }} />
                </div>
              </div>

              <p className="font-serif font-bold text-lg text-foreground leading-tight">{theme.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{theme.description}</p>

              {isActive && (
                <span className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-secondary uppercase tracking-wider">
                  <Check className="w-3 h-3" /> Active
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Theme changes are saved immediately and visible to all site visitors. The dark-mode version of each theme is also included.
      </p>

      {/* Dark Mode Toggle Setting */}
      <div className="mt-10 border-t border-border pt-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-muted-foreground shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Dark mode toggle</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                When enabled, visitors see a moon/sun icon in the header to switch between light and dark mode. When disabled, the site stays in light mode only.
              </p>
            </div>
          </div>
          <button
            onClick={() => toggleDarkMode(!darkToggleEnabled)}
            disabled={savingToggle}
            className={`relative shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              darkToggleEnabled ? "bg-secondary" : "bg-muted-foreground/30"
            } ${savingToggle ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            role="switch"
            aria-checked={darkToggleEnabled}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                darkToggleEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground ml-8">
          Currently: <span className={`font-semibold ${darkToggleEnabled ? "text-secondary" : "text-muted-foreground"}`}>{darkToggleEnabled ? "Enabled — visitors can toggle dark mode" : "Disabled — site locked to light mode"}</span>
        </p>
      </div>
    </div>
  );
}
