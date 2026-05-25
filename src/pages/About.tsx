import { Seo } from "@/components/Seo";
import { Button } from "@workspace/ui/button";
import { Link } from "wouter";
import { Award, ShieldCheck, HeartHandshake } from "lucide-react";
import Markdown from "react-markdown";
import { useAmandaContent, resolveImg, s } from "@/hooks/useAmandaContent";
import { PatrioticPhotoFrame } from "@/components/PatrioticPhotoFrame";

export default function About() {
  const { data } = useAmandaContent();
  const settings = data?.settings ?? {};

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Seo
        title={s(settings, "about_hero_heading", "About Amanda")}
        description={s(settings, "seo_about_description", "") || s(settings, "about_hero_subheading", "")}
        fullTitle={s(settings, "seo_about_title", "") || undefined}
        ogImage={s(settings, "seo_about_og_image", "") || s(settings, "seo_og_image", "") || undefined}
      />
      
      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{s(settings, "about_hero_heading", "Meet Amanda")}</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl">{s(settings, "about_hero_subheading", "Your dedicated advocate in the home financing process.")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <div className="sticky top-28">
              <PatrioticPhotoFrame
                src={resolveImg(settings.headshot_url, "amanda-headshot.png")}
                alt={s(settings, "site_name", "TBD")}
                outerClassName="mb-8"
                imgClassName="w-full rounded-2xl shadow-xl object-cover aspect-[4/5]"
                showBadge
              />
              <div className="bg-muted rounded-xl p-6 border border-border">
                <h3 className="font-serif font-bold text-xl mb-4 text-foreground">{s(settings, "site_name", "TBD")}</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Title</span>
                    <span className="font-semibold text-foreground">{s(settings, "about_title_line", "Mortgage Loan Officer")}</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">NMLS #</span>
                    <span className="font-semibold text-foreground">{s(settings, "nmls", "")}</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Business</span>
                    <span className="font-semibold text-foreground">{s(settings, "brand_name", "Creter Home Lending")}</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Lender</span>
                    <span className="font-semibold text-foreground">{s(settings, "company_name", "Home Lending")}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Serving</span>
                    <span className="font-semibold text-foreground">{s(settings, "service_area", "Pacific Northwest · WA & CA")}</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/contact">
                    <Button className="w-full bg-primary hover:bg-primary/90">Contact Amanda</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="prose prose-lg dark:prose-invert max-w-none mb-16 text-muted-foreground">
              <h2 className="text-3xl font-serif text-foreground mt-0">{s(settings, "about_bio_heading", "A personal approach")}</h2>
              <Markdown>{s(settings, "about_bio_markdown", "")}</Markdown>
            </div>

            <div className="border-t border-border pt-16">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-8">{s(settings, "about_broker_section_heading", "Why work with a broker vs. a bank?")}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-background border border-border p-6 rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{s(settings, "about_broker_card_1_title", "More Options")}</h3>
                  <p className="text-muted-foreground text-sm">{s(settings, "about_broker_card_1_body", "")}</p>
                </div>
                
                <div className="bg-background border border-border p-6 rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{s(settings, "about_broker_card_2_title", "Better Rates")}</h3>
                  <p className="text-muted-foreground text-sm">{s(settings, "about_broker_card_2_body", "")}</p>
                </div>
                
                <div className="bg-background border border-border p-6 rounded-xl shadow-sm md:col-span-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <HeartHandshake className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{s(settings, "about_broker_card_3_title", "Personalized Availability")}</h3>
                  <p className="text-muted-foreground text-sm">{s(settings, "about_broker_card_3_body", "")}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <div className="bg-muted py-20 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6 text-foreground">{s(settings, "about_cta_heading", "Let's find your path home")}</h2>
          <Link href="/contact">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white px-8 h-12">{s(settings, "about_cta_button", "Schedule a Consultation")}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
