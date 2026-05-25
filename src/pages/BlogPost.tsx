import { Seo } from "@/components/Seo";
import { Link, useParams } from "wouter";
import { ChevronLeft, Calendar, User, Loader2 } from "lucide-react";
import Markdown from "react-markdown";
import NotFound from "./not-found";
import { useAmandaBlogPost, useAmandaContent, resolveImg, s } from "@/hooks/useAmandaContent";

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, isLoading, isError } = useAmandaBlogPost(slug);
  const { data: content } = useAmandaContent();
  const settings = content?.settings ?? {};

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (isError || !post) return <NotFound />;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Seo
        title={post.title}
        fullTitle={`${post.title} | ${s(settings, "site_name", "TBD")}`}
        description={post.excerpt}
        ogImage={resolveImg(post.cover_image, s(settings, "seo_og_image", "")) || undefined}
      />
      
      <div className="w-full h-[40vh] min-h-[300px] relative">
        <img 
          src={resolveImg(post.cover_image || settings.blog_default_cover, "pnw-landscape.png")} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/40"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl -mt-32 relative z-10 pb-20">
        <div className="bg-card border border-border rounded-xl shadow-xl p-8 md:p-12">
          
          <div className="mb-8">
            <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-primary hover:text-secondary transition-colors mb-8">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Insights
            </Link>
            
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm border-b border-border pb-8">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                By {post.author}
              </div>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert prose-headings:font-serif prose-headings:text-foreground prose-a:text-primary max-w-none text-muted-foreground leading-relaxed">
            <Markdown>{post.body_markdown}</Markdown>
          </div>
          
          <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center gap-6 bg-muted p-8 rounded-xl">
            <img src={resolveImg(settings.headshot_url, "amanda-headshot.png")} alt={s(settings, "site_name", "TBD")} className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-md" />
            <div>
              <h3 className="font-serif font-bold text-xl text-foreground mb-2">Ready to discuss your options?</h3>
              <p className="text-muted-foreground text-sm mb-4">I'm here to answer your questions and guide you through the process.</p>
              <Link href="/contact" className="text-primary font-semibold hover:text-secondary transition-colors">
                Contact {s(settings, "site_name", "Amanda")} &rarr;
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
