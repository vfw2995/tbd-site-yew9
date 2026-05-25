import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getAdminToken } from "@/lib/api";
import { Button } from "@workspace/ui/button";
import { Badge } from "@workspace/ui/badge";
import { Card, CardContent } from "@workspace/ui/card";
import { Input } from "@workspace/ui/input";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@workspace/ui/alert-dialog";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { History, ChevronDown, ChevronRight, RotateCcw, Loader2, Archive, ChevronUp, X, Bug, CheckCircle2, Trash2 } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface ChangelogEntry {
  id: number;
  action: string;
  entity: string;
  entity_id: string | null;
  label: string;
  before_json: unknown;
  after_json: unknown;
  changed_by: string;
  created_at: string;
}

const ACTION_STYLES: Record<string, { label: string; className: string }> = {
  create:  { label: "Created",  className: "bg-green-100 text-green-800 border-green-200" },
  update:  { label: "Updated",  className: "bg-blue-100 text-blue-800 border-blue-200" },
  delete:  { label: "Deleted",  className: "bg-red-100 text-red-800 border-red-200" },
  revert:  { label: "Reverted", className: "bg-amber-100 text-amber-800 border-amber-200" },
};

const ENTITY_LABELS: Record<string, string> = {
  settings:     "Site Settings",
  stat:         "Stat",
  testimonial:  "Testimonial",
  loan_program: "Loan Program",
  blog_post:    "Blog Post",
};

function canRevert(entry: ChangelogEntry) {
  if (entry.action === "revert") return false;
  if (entry.action === "create") return false;
  return entry.before_json != null;
}

function JsonDiff({ label, data }: { label: string; data: unknown }) {
  if (data == null) return null;
  const text = JSON.stringify(data, null, 2);
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">{label}</p>
      <pre className="text-xs bg-muted/60 rounded p-3 overflow-auto max-h-48 leading-relaxed whitespace-pre-wrap break-words">
        {text}
      </pre>
    </div>
  );
}

function EntryRow({ entry, onRevert }: { entry: ChangelogEntry; onRevert: (id: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const style = ACTION_STYLES[entry.action] ?? ACTION_STYLES.update;
  const entityLabel = ENTITY_LABELS[entry.entity] ?? entry.entity;
  const hasDiff = entry.before_json != null || entry.after_json != null;

  return (
    <div className="border border-border rounded-lg bg-background">
      <div className="flex items-start gap-3 p-4">
        <Badge variant="outline" className={`shrink-0 mt-0.5 text-[11px] font-semibold border ${style.className}`}>
          {style.label}
        </Badge>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-0.5">
            <span className="text-xs font-medium text-muted-foreground">{entityLabel}</span>
            {entry.entity_id && (
              <span className="text-xs text-muted-foreground/60">#{entry.entity_id}</span>
            )}
          </div>
          <p className="text-sm font-medium text-foreground leading-snug">{entry.label}</p>
          <p className="text-xs text-muted-foreground mt-1">
            by <span className="font-medium">{entry.changed_by}</span>
            {" · "}
            <span title={format(new Date(entry.created_at), "PPpp")}>
              {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {canRevert(entry) && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => onRevert(entry.id)}
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Revert
            </Button>
          )}
          {hasDiff && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setExpanded((e) => !e)}
            >
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>
      {expanded && hasDiff && (
        <div className="border-t border-border px-4 py-3 space-y-3 bg-muted/20">
          <JsonDiff label="Before" data={entry.before_json} />
          <JsonDiff label="After" data={entry.after_json} />
        </div>
      )}
    </div>
  );
}

interface Checkpoint {
  id: number;
  label: string;
  created_at: string;
  bugfix_count_after: string | number;
}

function CheckpointsPanel() {
  const [open, setOpen]               = useState(false);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [loading, setLoading]         = useState(false);
  const [creating, setCreating]       = useState(false);
  const [newLabel, setNewLabel]       = useState("");
  const [saving, setSaving]           = useState(false);
  const [confirmId, setConfirmId]     = useState<number | null>(null);
  const [restoring, setRestoring]     = useState(false);
  const [restoreMsg, setRestoreMsg]   = useState<{ ok: boolean; text: string } | null>(null);
  const [deletingId, setDeletingId]   = useState<number | null>(null);

  function authHeaders(): HeadersInit {
    const tok = getAdminToken();
    return tok ? { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
  }

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/amanda/admin/checkpoints", { headers: authHeaders() });
      if (r.ok) setCheckpoints(await r.json());
    } finally { setLoading(false); }
  }

  useEffect(() => { if (open) load(); }, [open]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newLabel.trim()) return;
    setSaving(true);
    try {
      const r = await fetch("/api/amanda/admin/checkpoints", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ label: newLabel.trim() }),
      });
      if (r.ok) {
        const cp = await r.json();
        setCheckpoints(prev => [{ ...cp, bugfix_count_after: 0 }, ...prev]);
        setNewLabel("");
        setCreating(false);
      }
    } finally { setSaving(false); }
  }

  async function handleRestore(id: number) {
    setRestoring(true);
    setRestoreMsg(null);
    try {
      const r = await fetch(`/api/amanda/admin/checkpoints/${id}/restore`, {
        method: "POST",
        headers: authHeaders(),
      });
      const d = await r.json();
      if (r.ok) {
        setRestoreMsg({ ok: true, text: `✓ Restored to "${d.restored}" — site data is now rolled back.` });
      } else {
        setRestoreMsg({ ok: false, text: d.message ?? d.error ?? "Restore failed." });
      }
      setConfirmId(null);
    } finally { setRestoring(false); }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      const r = await fetch(`/api/amanda/admin/checkpoints/${id}`, { method: "DELETE", headers: authHeaders() });
      if (r.ok) setCheckpoints(prev => prev.filter(c => c.id !== id));
    } finally { setDeletingId(null); }
  }

  function fmtDate(s: string) {
    return new Date(s).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  }

  return (
    <Card className="border-border mb-6">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-2">
          <Archive className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-bold text-foreground">Data Checkpoints</span>
          <span className="text-[10px] text-muted-foreground font-medium px-1.5 py-0.5 bg-muted rounded">rollback</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {open && (
        <CardContent className="pt-0 border-t border-border space-y-4 px-4 pb-4">
          <p className="text-xs text-muted-foreground leading-relaxed pt-3">
            Snapshots capture settings, stats, loan programs, testimonials, and blog posts.
            <span className="text-red-600 font-semibold ml-1">Checkpoints that predate a bug fix are locked — restoring them would reintroduce known bugs.</span>
          </p>

          {restoreMsg && (
            <div className={`flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs border ${restoreMsg.ok ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
              {restoreMsg.ok ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <Bug className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
              <span>{restoreMsg.text}</span>
              <button type="button" onClick={() => setRestoreMsg(null)} className="ml-auto text-muted-foreground hover:text-foreground"><X className="w-3 h-3" /></button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">{checkpoints.length} checkpoint{checkpoints.length !== 1 ? "s" : ""}</span>
            {!creating && (
              <Button type="button" size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setCreating(true)}>
                + New Checkpoint
              </Button>
            )}
          </div>

          {creating && (
            <form onSubmit={handleCreate} className="flex gap-2 items-center">
              <Input autoFocus value={newLabel} onChange={e => setNewLabel(e.target.value)}
                placeholder="Label (e.g. Before content update)" className="h-8 text-sm flex-1" />
              <Button type="submit" size="sm" disabled={saving || !newLabel.trim()} className="h-8 text-xs">
                {saving ? "Saving…" : "Save"}
              </Button>
              <Button type="button" size="sm" variant="ghost" className="h-8" onClick={() => setCreating(false)}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </form>
          )}

          {loading && <p className="text-xs text-muted-foreground py-2">Loading…</p>}
          {!loading && checkpoints.length === 0 && (
            <p className="text-xs text-muted-foreground italic py-2">No checkpoints yet. Create one before making changes.</p>
          )}
          {!loading && checkpoints.length > 0 && (
            <div className="space-y-2">
              {checkpoints.map(cp => {
                const bugCount = Number(cp.bugfix_count_after);
                const locked = bugCount > 0;
                const confirming = confirmId === cp.id;
                return (
                  <div key={cp.id} className={`rounded-lg border px-3 py-2.5 flex items-center gap-3 ${locked ? "bg-red-50 border-red-200" : "bg-muted/30 border-border"}`}>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${locked ? "text-red-700" : "text-foreground"}`}>{cp.label}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[10px] text-muted-foreground">{fmtDate(cp.created_at)}</span>
                        {locked && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100 border border-red-200 px-1.5 py-0.5 rounded">
                            <Bug className="w-2.5 h-2.5" />{bugCount} bug fix{bugCount !== 1 ? "es" : ""} logged after — locked
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!locked && !confirming && (
                        <Button type="button" size="sm" variant="outline" className="h-7 text-[11px] gap-1 border-amber-400 text-amber-700 hover:bg-amber-50"
                          onClick={() => { setConfirmId(cp.id); setRestoreMsg(null); }}>
                          <RotateCcw className="w-3 h-3" /> Restore
                        </Button>
                      )}
                      {confirming && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-amber-700 font-semibold">Overwrite current data?</span>
                          <Button type="button" size="sm" disabled={restoring} className="h-7 text-[11px] bg-amber-600 hover:bg-amber-700 text-white" onClick={() => handleRestore(cp.id)}>
                            {restoring ? "Restoring…" : "Yes, restore"}
                          </Button>
                          <Button type="button" size="sm" variant="ghost" className="h-7 text-[11px]" onClick={() => setConfirmId(null)}>Cancel</Button>
                        </div>
                      )}
                      <Button type="button" size="sm" variant="ghost" disabled={deletingId === cp.id}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50 disabled:opacity-40"
                        onClick={() => handleDelete(cp.id)} title="Delete checkpoint">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default function ChangelogPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [revertId, setRevertId] = useState<number | null>(null);

  const { data: entries = [], isLoading } = useQuery<ChangelogEntry[]>({
    queryKey: ["amanda-changelog"],
    queryFn: () => api("/admin/changelog", { auth: true }),
  });

  const revertMutation = useMutation({
    mutationFn: (id: number) => api(`/admin/changelog/${id}/revert`, { method: "POST", auth: true }),
    onSuccess: () => {
      toast({ title: "Change reverted", description: "The previous state has been restored." });
      qc.invalidateQueries({ queryKey: ["amanda-changelog"] });
      qc.invalidateQueries({ queryKey: ["amanda-content"] });
      setRevertId(null);
    },
    onError: (err: Error) => {
      toast({ title: "Revert failed", description: err.message, variant: "destructive" });
      setRevertId(null);
    },
  });

  return (
    <div>
      <CheckpointsPanel />
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <History className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Change History</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Every edit made through the admin console is recorded here. You can expand any entry to see what changed, and revert updates or deletions.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading history…
        </div>
      )}

      {!isLoading && entries.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <History className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No changes recorded yet.</p>
            <p className="text-sm mt-1">Changes will appear here after you edit settings, testimonials, or other content.</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && entries.length > 0 && (
        <div className="space-y-2">
          {entries.map((entry) => (
            <EntryRow key={entry.id} entry={entry} onRevert={setRevertId} />
          ))}
        </div>
      )}

      <AlertDialog open={revertId !== null} onOpenChange={(open) => !open && setRevertId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revert this change?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore the previous values for this item. A new changelog entry will be created to record the revert.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => revertId !== null && revertMutation.mutate(revertId)}
              disabled={revertMutation.isPending}
            >
              {revertMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Yes, revert
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
