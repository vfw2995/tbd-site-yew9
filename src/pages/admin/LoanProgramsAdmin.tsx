import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type AmandaLoanProgram } from "@/lib/api";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { Button } from "@workspace/ui/button";
import { Input } from "@workspace/ui/input";
import { Textarea } from "@workspace/ui/textarea";
import { Label } from "@workspace/ui/label";
import { Save, Trash2, Plus, Loader2, ChevronDown, ChevronRight, X } from "lucide-react";

function ProgramCard({ row, onSaved, onDeleted }: { row: AmandaLoanProgram; onSaved: () => void; onDeleted: () => void }) {
  const { toast } = useToast();
  const [state, setState] = useState(row);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => setState(row), [row]);

  async function save() {
    setSaving(true);
    try {
      await api(`/admin/loan-programs/${row.id}`, {
        method: "PATCH",
        body: {
          title: state.title, short_desc: state.short_desc, long_desc: state.long_desc,
          who: state.who, highlights: state.highlights, sort_order: state.sort_order,
        },
        auth: true,
      });
      toast({ title: "Saved" });
      onSaved();
    } catch (e) {
      toast({ title: "Save failed", description: (e as Error).message, variant: "destructive" });
    } finally { setSaving(false); }
  }
  async function remove() {
    if (!confirm(`Delete "${state.title}"?`)) return;
    await api(`/admin/loan-programs/${row.id}`, { method: "DELETE", auth: true });
    onDeleted();
  }

  return (
    <div className="bg-background border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors"
      >
        <span className="flex items-center gap-3 text-left">
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span className="font-serif font-bold text-lg">{state.title || "(untitled)"}</span>
          <span className="text-xs text-muted-foreground">order {state.sort_order}</span>
        </span>
      </button>
      {open && (
        <div className="border-t border-border p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-xs">Title</Label>
              <Input value={state.title} onChange={(e) => setState({ ...state, title: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Sort Order</Label>
              <Input type="number" value={state.sort_order} onChange={(e) => setState({ ...state, sort_order: Number(e.target.value) })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Short description (shown on homepage cards)</Label>
            <Textarea rows={2} value={state.short_desc} onChange={(e) => setState({ ...state, short_desc: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Long description (Loan Programs page)</Label>
            <Textarea rows={3} value={state.long_desc} onChange={(e) => setState({ ...state, long_desc: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Who it's best for</Label>
            <Input value={state.who} onChange={(e) => setState({ ...state, who: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Highlights (one per line)</Label>
            <div className="space-y-2">
              {state.highlights.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={h} onChange={(e) => {
                    const next = [...state.highlights]; next[i] = e.target.value; setState({ ...state, highlights: next });
                  }} />
                  <Button size="sm" variant="outline" onClick={() => setState({ ...state, highlights: state.highlights.filter((_, idx) => idx !== i) })}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={() => setState({ ...state, highlights: [...state.highlights, ""] })}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add highlight
              </Button>
            </div>
          </div>
          <div className="flex gap-2 pt-3 border-t border-border">
            <Button onClick={save} disabled={saving} className="bg-secondary hover:bg-secondary/90 text-white">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save
            </Button>
            <Button variant="outline" onClick={remove}>
              <Trash2 className="w-4 h-4 mr-2 text-destructive" />
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoanProgramsAdmin() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["amanda", "admin", "loan-programs"], queryFn: () => api<AmandaLoanProgram[]>("/admin/loan-programs", { auth: true }) });

  async function add() {
    const next = (q.data?.length ?? 0);
    await api("/admin/loan-programs", { method: "POST", body: { title: "New Program", short_desc: "", long_desc: "", who: "", highlights: [], sort_order: next }, auth: true });
    qc.invalidateQueries({ queryKey: ["amanda", "admin", "loan-programs"] });
    qc.invalidateQueries({ queryKey: ["amanda", "content"] });
  }
  function refresh() {
    qc.invalidateQueries({ queryKey: ["amanda", "admin", "loan-programs"] });
    qc.invalidateQueries({ queryKey: ["amanda", "content"] });
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-2">Loan Programs</p>
          <h1 className="text-3xl font-serif font-bold">Edit your loan products</h1>
          <p className="text-muted-foreground mt-2">Add, edit, reorder, or remove loan programs. Click a row to expand.</p>
        </div>
        <Button onClick={add} className="bg-secondary hover:bg-secondary/90 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Program
        </Button>
      </header>
      {q.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
      <div className="space-y-3">
        {q.data?.map((p) => (
          <ProgramCard key={p.id} row={p} onSaved={refresh} onDeleted={refresh} />
        ))}
      </div>
    </div>
  );
}
