import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { api, type AmandaBlogPost } from "@/lib/api";
import { Button } from "@workspace/ui/button";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@workspace/ui/hooks/use-toast";

export default function BlogList() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const q = useQuery({ queryKey: ["amanda", "admin", "blog-posts"], queryFn: () => api<AmandaBlogPost[]>("/admin/blog-posts", { auth: true }) });

  async function remove(p: AmandaBlogPost) {
    if (!confirm(`Delete "${p.title}"?`)) return;
    await api(`/admin/blog-posts/${p.id}`, { method: "DELETE", auth: true });
    qc.invalidateQueries({ queryKey: ["amanda", "admin", "blog-posts"] });
    qc.invalidateQueries({ queryKey: ["amanda", "blog-posts"] });
    toast({ title: "Deleted" });
  }
  async function togglePublish(p: AmandaBlogPost) {
    await api(`/admin/blog-posts/${p.id}`, { method: "PATCH", body: { published: !p.published }, auth: true });
    qc.invalidateQueries({ queryKey: ["amanda", "admin", "blog-posts"] });
    qc.invalidateQueries({ queryKey: ["amanda", "blog-posts"] });
    toast({ title: p.published ? "Unpublished" : "Published" });
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-2">Blog</p>
          <h1 className="text-3xl font-serif font-bold">Posts</h1>
          <p className="text-muted-foreground mt-2">Write, edit, and publish blog posts in markdown.</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-secondary hover:bg-secondary/90 text-white">
            <Plus className="w-4 h-4 mr-2" /> New Post
          </Button>
        </Link>
      </header>
      {q.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
      <div className="bg-background border border-border rounded-xl divide-y divide-border">
        {q.data?.length === 0 && (
          <div className="p-10 text-center text-muted-foreground">No posts yet. Click "New Post" to start.</div>
        )}
        {q.data?.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-serif font-bold truncate">{p.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.published ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                  {p.published ? "Published" : "Draft"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                /{p.slug} · updated {new Date(p.updated_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={() => togglePublish(p)}>
                {p.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </Button>
              <Link href={`/admin/blog/${p.id}`}>
                <Button size="sm" variant="outline"><Pencil className="w-3.5 h-3.5" /></Button>
              </Link>
              <Button size="sm" variant="outline" onClick={() => remove(p)}>
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
