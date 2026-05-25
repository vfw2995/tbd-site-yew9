import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { SettingsEditor, type FieldSection } from "@/components/admin/SettingsEditor";
import { Button } from "@workspace/ui/button";
import { Input } from "@workspace/ui/input";
import { Label } from "@workspace/ui/label";
import { Plus, Trash2, Save, Loader2, GripVertical } from "lucide-react";

const HOME_SECTIONS: FieldSection[] = [
  {
    title: "Hero",
    description: "The top section of the homepage.",
    fields: [
      { key: "home_chip_text", label: "Small chip (e.g. 'Pacific Northwest Mortgage Broker')" },
      { key: "home_hero_heading_lead", label: "Heading — first part" },
      { key: "home_hero_heading_accent", label: "Heading — red italic accent word", help: "Shown in the secondary brand color." },
      { key: "home_hero_heading_trail", label: "Heading — trailing punctuation" },
      { key: "home_hero_subheading", label: "Subheading", type: "textarea", rows: 3 },
      { key: "home_hero_cta_primary", label: "Primary button label" },
      { key: "home_hero_cta_secondary", label: "Secondary button label" },
      { key: "home_trust_badge_1", label: "Trust badge #1" },
      { key: "home_trust_badge_2", label: "Trust badge #2" },
      { key: "home_trust_badge_3", label: "Trust badge #3" },
      { key: "home_photo_card_rating", label: "Photo card rating (e.g. '5.0')" },
      { key: "home_photo_card_text", label: "Photo card text" },
    ],
  },
  {
    title: "Veterans First Section",
    description: "The section highlighting your veteran-focused services.",
    fields: [
      { key: "home_vet_heading", label: "Heading" },
      { key: "home_vet_subheading", label: "Subheading", type: "textarea", rows: 2 },
      { key: "home_vet_cta", label: "CTA button label" },
      { key: "home_vet_card_1_title", label: "Card 1 — title" },
      { key: "home_vet_card_1_body", label: "Card 1 — body", type: "textarea", rows: 2 },
      { key: "home_vet_card_2_title", label: "Card 2 — title" },
      { key: "home_vet_card_2_body", label: "Card 2 — body", type: "textarea", rows: 2 },
      { key: "home_vet_card_3_title", label: "Card 3 — title" },
      { key: "home_vet_card_3_body", label: "Card 3 — body", type: "textarea", rows: 2 },
    ],
  },
  {
    title: "Loan Options Intro",
    fields: [
      { key: "home_loans_heading", label: "Section heading" },
      { key: "home_loans_subheading", label: "Subheading", type: "textarea", rows: 2 },
    ],
  },
  {
    title: "Testimonials Intro",
    fields: [
      { key: "home_testimonials_heading", label: "Section heading" },
      { key: "home_testimonials_subheading", label: "Subheading", type: "textarea", rows: 3 },
    ],
  },
  {
    title: "Bottom Call-To-Action",
    fields: [
      { key: "home_cta_heading", label: "CTA heading" },
      { key: "home_cta_subheading", label: "CTA subheading", type: "textarea", rows: 2 },
      { key: "home_cta_button", label: "CTA button label" },
    ],
  },
];

interface StatRow {
  id: number;
  label: string;
  value: string;
  sort_order: number;
}

function StatsManager() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const q = useQuery({ queryKey: ["amanda", "admin", "stats"], queryFn: () => api<StatRow[]>("/admin/stats", { auth: true }) });
  const [rows, setRows] = useState<StatRow[] | null>(null);
  const [saving, setSaving] = useState<number | "new" | null>(null);

  useEffect(() => { if (q.data) setRows(q.data); }, [q.data]);

  if (!rows) return <Loader2 className="w-5 h-5 animate-spin" />;

  async function saveRow(row: StatRow) {
    setSaving(row.id);
    try {
      await api(`/admin/stats/${row.id}`, { method: "PATCH", body: { label: row.label, value: row.value, sort_order: row.sort_order }, auth: true });
      qc.invalidateQueries({ queryKey: ["amanda", "content"] });
      qc.invalidateQueries({ queryKey: ["amanda", "admin", "stats"] });
      toast({ title: "Stat saved" });
    } catch (e) {
      toast({ title: "Save failed", description: (e as Error).message, variant: "destructive" });
    } finally { setSaving(null); }
  }
  async function deleteRow(id: number) {
    if (!confirm("Delete this stat?")) return;
    await api(`/admin/stats/${id}`, { method: "DELETE", auth: true });
    qc.invalidateQueries({ queryKey: ["amanda", "content"] });
    qc.invalidateQueries({ queryKey: ["amanda", "admin", "stats"] });
    toast({ title: "Deleted" });
  }
  async function addRow() {
    setSaving("new");
    try {
      const next = (rows?.length ?? 0);
      await api("/admin/stats", { method: "POST", body: { label: "New stat", value: "0", sort_order: next }, auth: true });
      qc.invalidateQueries({ queryKey: ["amanda", "content"] });
      qc.invalidateQueries({ queryKey: ["amanda", "admin", "stats"] });
    } finally { setSaving(null); }
  }

  return (
    <section className="bg-background border border-border rounded-xl p-6 md:p-8">
      <header className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-serif font-bold">Stats Bar</h2>
          <p className="text-sm text-muted-foreground">The 4 numbers under the hero. Reorder with sort order.</p>
        </div>
        <Button size="sm" variant="outline" onClick={addRow} disabled={saving === "new"}>
          <Plus className="w-4 h-4 mr-1" /> Add Stat
        </Button>
      </header>
      <div className="space-y-3">
        {rows!.map((r, idx) => (
          <div key={r.id} className="grid grid-cols-12 gap-3 items-end border border-border rounded-lg p-3">
            <div className="col-span-1 flex justify-center pt-7 text-muted-foreground">
              <GripVertical className="w-4 h-4" />
            </div>
            <div className="col-span-5">
              <Label className="text-xs">Label</Label>
              <Input value={r.label} onChange={(e) => setRows(rows!.map((x, i) => i === idx ? { ...x, label: e.target.value } : x))} />
            </div>
            <div className="col-span-3">
              <Label className="text-xs">Value</Label>
              <Input value={r.value} onChange={(e) => setRows(rows!.map((x, i) => i === idx ? { ...x, value: e.target.value } : x))} />
            </div>
            <div className="col-span-1">
              <Label className="text-xs">Order</Label>
              <Input type="number" value={r.sort_order} onChange={(e) => setRows(rows!.map((x, i) => i === idx ? { ...x, sort_order: Number(e.target.value) } : x))} />
            </div>
            <div className="col-span-2 flex gap-2">
              <Button size="sm" onClick={() => saveRow(r)} disabled={saving === r.id} className="bg-secondary hover:bg-secondary/90 text-white">
                <Save className="w-3.5 h-3.5" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => deleteRow(r.id)}>
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomepageAdmin() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-2">Homepage</p>
        <h1 className="text-3xl font-serif font-bold">Hero, stats, CTAs</h1>
        <p className="text-muted-foreground mt-2">Every word and number on the homepage. Edit testimonials in the Testimonials tab.</p>
      </header>
      <StatsManager />
      <SettingsEditor sections={HOME_SECTIONS} />
    </div>
  );
}
