import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Markdown from "react-markdown";
import { api, type AmandaBlogPost } from "@/lib/api";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { Button } from "@workspace/ui/button";
import { Input } from "@workspace/ui/input";
import { Textarea } from "@workspace/ui/textarea";
import { Label } from "@workspace/ui/label";
import { Switch } from "@workspace/ui/switch";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Save, Loader2, ArrowLeft, Trash2 } from "lucide-react";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

interface FormState {
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  body_markdown: string;
  author: string;
  tags: string;
  published: boolean;
  published_at: string;
}

const EMPTY: FormState = {
  slug: "", title: "", excerpt: "", cover_image: "",
  body_markdown: "## Hello\n\nWrite your post in markdown.",
  author: "TBD", tags: "", published: false, published_at: "",
};

function toDateInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function BlogEditor() {
  const params = useParams<{ id?: string }>();
  const isNew = !params.id || params.id === "new";
  const id = isNew ? null : Number(params.id);
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const { toast } = useToast();

  const q = useQuery({
    queryKey: ["amanda", "admin", "blog-post", id],
    queryFn: () => api<AmandaBlogPost>(`/admin/blog-posts/${id}`, { auth: true }),
    enabled: !!id,
  });

  const [state, setState] = useState<FormState>(EMPTY);
  const [original, setOriginal] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(isNew);

  useEffect(() => {
    if (q.data) {
      const s: FormState = {
        slug: q.data.slug,
        title: q.data.title,
        excerpt: q.data.excerpt,
        cover_image: q.data.cover_image,
        body_markdown: q.data.body_markdown,
        author: q.data.author,
        tags: q.data.tags.join(", "),
        published: q.data.published,
        published_at: toDateInput((q.data as { published_at?: string | null }).published_at),
      };
      setState(s);
      setOriginal(s);
      setAutoSlug(false);
    } else if (isNew) {
      setOriginal(EMPTY);
    }
  }, [q.data, isNew]);

  const dirty = original !== null && JSON.stringify(state) !== JSON.stringify(original);
  useEffect(() => {
    function bu(e: BeforeUnloadEvent) { if (dirty) { e.preventDefault(); e.returnValue = ""; } }
    window.addEventListener("beforeunload", bu);
    return () => window.removeEventListener("beforeunload", bu);
  }, [dirty]);

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setState((s) => {
      const next = { ...s, [k]: v };
      if (k === "title" && autoSlug && typeof v === "string") next.slug = slugify(v);
      return next;
    });
  }

  async function save() {
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        slug: state.slug,
        title: state.title,
        excerpt: state.excerpt,
        cover_image: state.cover_image,
        body_markdown: state.body_markdown,
        author: state.author,
        tags: state.tags.split(",").map((t) => t.trim()).filter(Boolean),
        published: state.published,
      };
      if (state.published_at) {
        body.published_at = new Date(`${state.published_at}T12:00:00Z`).toISOString();
      } else if (!isNew) {
        body.published_at = null;
      }
      if (isNew) {
        const created = await api<AmandaBlogPost>("/admin/blog-posts", { method: "POST", body, auth: true });
        toast({ title: "Post created" });
        qc.invalidateQueries({ queryKey: ["amanda", "admin", "blog-posts"] });
        qc.invalidateQueries({ queryKey: ["amanda", "blog-posts"] });
        setLocation(`/admin/blog/${created.id}`);
      } else {
        const updated = await api<AmandaBlogPost>(`/admin/blog-posts/${id}`, { method: "PATCH", body, auth: true });
        qc.invalidateQueries({ queryKey: ["amanda", "admin", "blog-posts"] });
        qc.invalidateQueries({ queryKey: ["amanda", "blog-posts"] });
        qc.invalidateQueries({ queryKey: ["amanda", "blog-post", updated.slug] });
        setOriginal({ ...state });
        toast({ title: "Saved" });
      }
    } catch (e) {
      toast({ title: "Save failed", description: (e as Error).message, variant: "destructive" });
    } finally { setSaving(false); }
  }

  async function remove() {
    if (!id || !confirm(`Delete "${state.title}"?`)) return;
    await api(`/admin/blog-posts/${id}`, { method: "DELETE", auth: true });
    qc.invalidateQueries({ queryKey: ["amanda", "admin", "blog-posts"] });
    setLocation("/admin/blog");
  }

  if (id && q.isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setLocation("/admin/blog")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Blog Editor</p>
            <h1 className="text-2xl font-serif font-bold">{isNew ? "New Post" : "Edit Post"}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          {!isNew && (
            <Button variant="outline" onClick={remove}>
              <Trash2 className="w-4 h-4 mr-2 text-destructive" /> Delete
            </Button>
          )}
          <Button onClick={save} disabled={saving || !dirty} className="bg-secondary hover:bg-secondary/90 text-white">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isNew ? "Create" : "Save"}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-background border border-border rounded-xl p-6 space-y-4">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={state.title} onChange={(e) => update("title", e.target.value)} placeholder="Post title" className="text-lg" />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <div className="flex gap-2">
                <Input
                  value={state.slug}
                  onChange={(e) => { setAutoSlug(false); update("slug", e.target.value); }}
                  placeholder="url-friendly-slug"
                />
                {isNew && (
                  <Button type="button" variant="outline" onClick={() => { setAutoSlug(true); update("slug", slugify(state.title)); }}>
                    Auto
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">/blog/{state.slug || "..."}</p>
            </div>
            <div className="space-y-1.5">
              <Label>Excerpt</Label>
              <Textarea rows={2} value={state.excerpt} onChange={(e) => update("excerpt", e.target.value)} />
            </div>
          </div>

          <div className="bg-background border border-border rounded-xl p-6 space-y-3">
            <Label>Body (Markdown)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                rows={24}
                value={state.body_markdown}
                onChange={(e) => update("body_markdown", e.target.value)}
                className="font-mono text-sm"
              />
              <div className="border border-border rounded-md p-4 bg-muted/30 overflow-auto max-h-[600px] prose prose-sm dark:prose-invert max-w-none">
                <Markdown>{state.body_markdown || "_Preview…_"}</Markdown>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-background border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Published</p>
                <p className="text-xs text-muted-foreground">Visible on the public blog.</p>
              </div>
              <Switch checked={state.published} onCheckedChange={(v) => update("published", v)} />
            </div>
            <div className="space-y-1.5 pt-3 border-t border-border">
              <Label>Published date</Label>
              <Input type="date" value={state.published_at} onChange={(e) => update("published_at", e.target.value)} />
              <p className="text-xs text-muted-foreground">Leave blank to clear. Auto-set on first publish if blank.</p>
            </div>
          </div>
          <div className="bg-background border border-border rounded-xl p-6 space-y-4">
            <ImageUpload
              label="Cover image"
              value={state.cover_image}
              onChange={(v) => update("cover_image", v)}
              fallback="pnw-landscape.png"
            />
          </div>
          <div className="bg-background border border-border rounded-xl p-6 space-y-4">
            <div className="space-y-1.5">
              <Label>Author</Label>
              <Input value={state.author} onChange={(e) => update("author", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Tags (comma separated)</Label>
              <Input value={state.tags} onChange={(e) => update("tags", e.target.value)} placeholder="first-time-buyers, va-loans" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
