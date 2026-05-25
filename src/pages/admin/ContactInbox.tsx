import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type AmandaContactSubmission } from "@/lib/api";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { Button } from "@workspace/ui/button";
import { Badge } from "@workspace/ui/badge";
import { Loader2, Mail, MailOpen, Trash2, Archive, ArchiveRestore, Phone, User, MessageSquare, Tag } from "lucide-react";

function SubmissionCard({ row, onChanged }: { row: AmandaContactSubmission; onChanged: () => void }) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(!row.read);

  async function patch(data: { read?: boolean; archived?: boolean }) {
    setBusy(true);
    try {
      await api(`/admin/contact-submissions/${row.id}`, { method: "PATCH", body: data, auth: true });
      onChanged();
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm("Permanently delete this submission?")) return;
    setBusy(true);
    try {
      await api(`/admin/contact-submissions/${row.id}`, { method: "DELETE", auth: true });
      onChanged();
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  const date = new Date(row.created_at).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div
      className={`bg-background border rounded-xl overflow-hidden transition-all ${
        row.read ? "border-border opacity-75" : "border-secondary shadow-sm"
      }`}
    >
      <div
        className="flex items-start gap-4 p-5 cursor-pointer hover:bg-muted/30"
        onClick={() => {
          setExpanded((v) => !v);
          if (!row.read) patch({ read: true });
        }}
      >
        <div className={`mt-0.5 shrink-0 ${row.read ? "text-muted-foreground" : "text-secondary"}`}>
          {row.read ? <MailOpen className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`font-semibold text-sm ${row.read ? "text-foreground" : "text-foreground font-bold"}`}>
              {row.name}
            </span>
            {!row.read && <Badge className="bg-secondary text-white text-[10px] px-1.5 py-0">New</Badge>}
            {row.archived && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Archived</Badge>}
            {row.loan_type && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1">
                <Tag className="w-2.5 h-2.5" />{row.loan_type}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground ml-auto">{date}</span>
          </div>
          <p className="text-sm text-muted-foreground truncate">{row.email}{row.phone ? ` · ${row.phone}` : ""}</p>
          <p className={`text-sm mt-1 ${expanded ? "" : "line-clamp-1 text-muted-foreground"}`}>{row.message}</p>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border px-5 pb-5 pt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-3.5 h-3.5 shrink-0" />
              <span className="font-medium text-foreground">{row.name}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <a href={`mailto:${row.email}`} className="text-secondary hover:underline break-all">{row.email}</a>
            </div>
            {row.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <a href={`tel:${row.phone.replace(/[^0-9+]/g, "")}`} className="text-foreground hover:underline">{row.phone}</a>
              </div>
            )}
            {row.loan_type && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="w-3.5 h-3.5 shrink-0" />
                <span className="text-foreground">{row.loan_type}</span>
              </div>
            )}
          </div>
          <div className="bg-muted/40 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">
              <MessageSquare className="w-3 h-3" /> Message
            </div>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{row.message}</p>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => patch({ read: !row.read })}
            >
              {row.read ? <Mail className="w-3.5 h-3.5 mr-1.5" /> : <MailOpen className="w-3.5 h-3.5 mr-1.5" />}
              Mark as {row.read ? "Unread" : "Read"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => patch({ archived: !row.archived })}
            >
              {row.archived ? <ArchiveRestore className="w-3.5 h-3.5 mr-1.5" /> : <Archive className="w-3.5 h-3.5 mr-1.5" />}
              {row.archived ? "Unarchive" : "Archive"}
            </Button>
            <a
              href={`mailto:${row.email}?subject=Re: Mortgage Inquiry (${row.loan_type || "General"})`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-secondary hover:bg-secondary/90 text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> Reply by Email
            </a>
            <Button size="sm" variant="ghost" className="ml-auto text-destructive hover:text-destructive" disabled={busy} onClick={remove}>
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

type Filter = "all" | "unread" | "archived";

export default function ContactInbox() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>("all");
  const q = useQuery({
    queryKey: ["amanda", "admin", "contact-submissions"],
    queryFn: () => api<AmandaContactSubmission[]>("/admin/contact-submissions", { auth: true }),
  });

  function refresh() {
    qc.invalidateQueries({ queryKey: ["amanda", "admin", "contact-submissions"] });
  }

  const all = q.data ?? [];
  const unreadCount = all.filter((r) => !r.read && !r.archived).length;

  const visible = all.filter((r) => {
    if (filter === "unread") return !r.read && !r.archived;
    if (filter === "archived") return r.archived;
    return !r.archived;
  });

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "Inbox" },
    { key: "unread", label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}` },
    { key: "archived", label: "Archived" },
  ];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-2">Contact</p>
        <h1 className="text-3xl font-serif font-bold">Inbox</h1>
        <p className="text-muted-foreground mt-2">
          Messages submitted through your public contact form.
        </p>
      </header>

      <div className="flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              filter === t.key
                ? "border-secondary text-secondary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {q.isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!q.isLoading && visible.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No messages here yet.</p>
          {filter === "unread" && <p className="text-sm mt-1">You're all caught up!</p>}
        </div>
      )}

      <div className="space-y-3">
        {visible.map((row) => (
          <SubmissionCard key={row.id} row={row} onChanged={refresh} />
        ))}
      </div>
    </div>
  );
}
