import { Seo } from "@/components/Seo";
import { Link } from "wouter";
import { ArrowRight, Calendar, Loader2 } from "lucide-react";
import { useAmandaBlogPosts, useAmandaContent, resolveImg, s } from "@/hooks/useAmandaContent";

export default function Blog() {
  const posts = useAmandaBlogPosts();
  const { data: content } = useAmandaContent();
  const settings = content?.settings ?? {};

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Seo
        title={s(settings, "blog_hero_heading", "Mortgage Insights")}
        description={s(settings, "seo_blog_description", "") || s(settings, "blog_hero_subheading", "")}
        fullTitle={s(settings, "seo_blog_title", "") || undefined}
        ogImage={s(settings, "seo_blog_og_image", "") || s(settings, "seo_og_image", "") || undefined}
      />
      
      <div className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src={resolveImg(settings.blog_default_cover, "pnw-landscape.png")} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{s(settings, "blog_hero_heading", "Mortgage Insights")}</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl">{s(settings, "blog_hero_subheading", "")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-5xl">
        {posts.isLoading && <Loader2 className="w-6 h-6 animate-spin mx-auto" />}
        {posts.data?.length === 0 && (
          <p className="text-center text-muted-foreground py-20">No posts published yet. Check back soon!</p>
        )}
        <div className="grid gap-12">
          {posts.data?.map((post) => (
            <article key={post.id} className="flex flex-col md:flex-row gap-8 items-start group">
              <div className="w-full md:w-1/3 aspect-[4/3] md:aspect-square bg-muted rounded-xl overflow-hidden border border-border">
                <img 
                  src={resolveImg(post.cover_image || settings.blog_default_cover, "pnw-landscape.png")} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="w-full md:w-2/3 flex flex-col h-full py-2">
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  {post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4 group-hover:text-primary transition-colors cursor-pointer">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                <div className="mt-auto">
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-primary font-semibold hover:text-secondary transition-colors">
                    Read Article <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
