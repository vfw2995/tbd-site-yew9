import { useQuery } from "@tanstack/react-query";
import { api, type AmandaContent, type AmandaBlogPost } from "@/lib/api";
import { Link } from "wouter";
import { Layers, MessageSquareQuote, FileText, Settings, Home, ArrowRight } from "lucide-react";
import type { AmandaUser } from "@/lib/api";

export default function Dashboard({ user }: { user: AmandaUser }) {
  const content = useQuery({
    queryKey: ["amanda", "content"],
    queryFn: () => api<AmandaContent>("/public/content"),
  });
  const posts = useQuery({
    queryKey: ["amanda", "admin", "blog-posts"],
    queryFn: () => api<AmandaBlogPost[]>("/admin/blog-posts", { auth: true }),
  });

  const stats = [
    { label: "Loan Programs", value: content.data?.loanPrograms.length ?? "—", href: "/admin/loan-programs", icon: Layers },
    { label: "Testimonials", value: content.data?.testimonials.length ?? "—", href: "/admin/testimonials", icon: MessageSquareQuote },
    { label: "Blog Posts", value: posts.data?.length ?? "—", href: "/admin/blog", icon: FileText },
    { label: "Settings", value: Object.keys(content.data?.settings ?? {}).length || "—", href: "/admin/site-settings", icon: Settings },
  ];

  const quickActions = [
    { label: "Edit Homepage", href: "/admin/homepage", icon: Home },
    { label: "Site Settings", href: "/admin/site-settings", icon: Settings },
    { label: "Manage Loan Programs", href: "/admin/loan-programs", icon: Layers },
    { label: "Write a Blog Post", href: "/admin/blog/new", icon: FileText },
  ];

  return (
    <div className="space-y-10">
      <header>
        <p className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-2">Dashboard</p>
        <h1 className="text-4xl font-serif font-bold text-foreground">Welcome back, {user.displayName.split(" ")[0]}.</h1>
        <p className="text-muted-foreground mt-2">Manage every piece of content on your site from here.</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="bg-background border border-border rounded-xl p-5 hover:border-secondary hover:shadow-md transition-all group"
            >
              <Icon className="w-5 h-5 text-secondary mb-3" />
              <p className="text-3xl font-serif font-bold text-foreground">{s.value}</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-1">{s.label}</p>
            </Link>
          );
        })}
      </div>

      <section className="bg-background border border-border rounded-xl p-6 md:p-8">
        <h2 className="text-xl font-serif font-bold mb-5">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center justify-between px-4 py-3 rounded-md border border-border hover:border-primary hover:bg-muted transition-colors group"
              >
                <span className="flex items-center gap-3 text-sm font-medium">
                  <Icon className="w-4 h-4 text-primary" />
                  {a.label}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-background border border-border rounded-xl p-6 md:p-8">
        <h2 className="text-xl font-serif font-bold mb-2">How to use this admin</h2>
        <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
          <li><strong className="text-foreground">Site Settings</strong> — Identity, phone, email, social links, and footer.</li>
          <li><strong className="text-foreground">Homepage</strong> — Hero headline, stats bar, testimonials section, and bottom CTA.</li>
          <li><strong className="text-foreground">Loan Programs</strong> — Add, edit, reorder, or remove loan products.</li>
          <li><strong className="text-foreground">Pages Content</strong> — Copy on the About, Calculators, Contact and Blog pages.</li>
          <li><strong className="text-foreground">Blog</strong> — Write posts in markdown, upload cover images, publish or unpublish.</li>
          <li><strong className="text-foreground">Account</strong> — Change your password.</li>
        </ul>
      </section>
    </div>
  );
}
