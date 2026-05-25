import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type AmandaTestimonial } from "@/lib/api";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { Button } from "@workspace/ui/button";
import { Input } from "@workspace/ui/input";
import { Textarea } from "@workspace/ui/textarea";
import { Label } from "@workspace/ui/label";
import { Save, Trash2, Plus, Loader2, Star } from "lucide-react";

function Card({ row, onChange }: { row: AmandaTestimonial; onChange: () => void }) {
  const [state, setState] = useState(row);
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  useEffect(() => setState(row), [row]);

  async function save() {
    setSaving(true);
    try {
      await api(`/admin/testimonials/${row.id}`, {
        method: "PATCH",
        body: { text: state.text, author: state.author, location: state.location, rating: state.rating, sort_order: state.sort_order },
        auth: true,
      });
      toast({ title: "Saved" });
      onChange();
    } catch (e) {
      toast({ title: "Save failed", description: (e as Error).message, variant: "destructive" });
    } finally { setSaving(false); }
  }
  async function remove() {
    if (!confirm("Delete this testimonial?")) return;
    await api(`/admin/testimonials/${row.id}`, { method: "DELETE", auth: true });
    onChange();
  }

  return (
    <div className="bg-background border border-border rounded-xl p-5 space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Testimonial text</Label>
        <Textarea rows={3} value={state.text} onChange={(e) => setState({ ...state, text: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="space-y-1.5 col-span-2">
          <Label className="text-xs">Author</Label>
          <Input value={state.author} onChange={(e) => setState({ ...state, author: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Location</Label>
          <Input value={state.location} onChange={(e) => setState({ ...state, location: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Rating (1-5)</Label>
          <Input type="number" min={1} max={5} value={state.rating} onChange={(e) => setState({ ...state, rating: Number(e.target.value) })} />
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>Order:</span>
          <Input type="number" value={state.sort_order} className="w-20 h-8" onChange={(e) => setState({ ...state, sort_order: Number(e.target.value) })} />
          <div className="flex">{Array.from({ length: state.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-secondary text-secondary" />)}</div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={save} disabled={saving} className="bg-secondary hover:bg-secondary/90 text-white">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={remove}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsAdmin() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["amanda", "admin", "testimonials"], queryFn: () => api<AmandaTestimonial[]>("/admin/testimonials", { auth: true }) });

  async function add() {
    const next = (q.data?.length ?? 0);
    await api("/admin/testimonials", { method: "POST", body: { text: "New testimonial", author: "Client name", location: "", rating: 5, sort_order: next }, auth: true });
    refresh();
  }
  function refresh() {
    qc.invalidateQueries({ queryKey: ["amanda", "admin", "testimonials"] });
    qc.invalidateQueries({ queryKey: ["amanda", "content"] });
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-2">Testimonials</p>
          <h1 className="text-3xl font-serif font-bold">Client quotes</h1>
          <p className="text-muted-foreground mt-2">Shown on the homepage. Edit, reorder, or remove.</p>
        </div>
        <Button onClick={add} className="bg-secondary hover:bg-secondary/90 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Testimonial
        </Button>
      </header>
      {q.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
      <div className="space-y-4">
        {q.data?.map((t) => <Card key={t.id} row={t} onChange={refresh} />)}
      </div>
    </div>
  );
}
