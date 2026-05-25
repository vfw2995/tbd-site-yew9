import { Seo } from "@/components/Seo";
import { Button } from "@workspace/ui/button";
import { Link } from "wouter";
import { Check } from "lucide-react";
import { useAmandaContent, s } from "@/hooks/useAmandaContent";

export default function LoanPrograms() {
  const { data } = useAmandaContent();
  const settings = data?.settings ?? {};
  const programs = data?.loanPrograms ?? [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Seo
        title={s(settings, "loan_programs_hero_heading", "Loan Programs")}
        description={s(settings, "seo_loans_description", "") || s(settings, "loan_programs_hero_subheading", "")}
        fullTitle={s(settings, "seo_loans_title", "") || undefined}
        ogImage={s(settings, "seo_loans_og_image", "") || s(settings, "seo_og_image", "") || undefined}
      />
      
      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{s(settings, "loan_programs_hero_heading", "Loan Programs")}</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl">{s(settings, "loan_programs_hero_subheading", "")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <div key={program.id} className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="p-8 flex-1">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-3">{program.title}</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm">{program.long_desc || program.short_desc}</p>
                
                {program.who && (
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">Best For:</span>
                    <p className="text-sm font-medium text-foreground">{program.who}</p>
                  </div>
                )}
                
                <div className="space-y-3">
                  {program.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start">
                      <Check className="w-4 h-4 text-secondary mt-0.5 shrink-0 mr-2" />
                      <span className="text-sm text-muted-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 pt-0 mt-auto">
                <Link href="/contact">
                  <Button variant="outline" className="w-full border-border hover:bg-muted text-foreground">Discuss this option</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-muted py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-serif font-bold mb-6 text-foreground">{s(settings, "loan_programs_cta_heading", "Not sure which is right for you?")}</h2>
          <p className="text-lg text-muted-foreground mb-8">{s(settings, "loan_programs_cta_subheading", "")}</p>
          <Link href="/contact">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white px-8 h-12">{s(settings, "loan_programs_cta_button", "Get a Custom Quote")}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
