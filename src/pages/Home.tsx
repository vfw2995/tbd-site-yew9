import { Seo } from "@/components/Seo";
import { Button } from "@workspace/ui/button";
import { Link } from "wouter";
import { ChevronRight, MapPin, Star, Users, Phone, ShieldCheck, MapPinned, HeartHandshake, BadgeCheck, Home as HomeIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useAmandaContent, resolveImg, s } from "@/hooks/useAmandaContent";
import { PatrioticPhotoFrame } from "@/components/PatrioticPhotoFrame";

export default function Home() {
  const { data } = useAmandaContent();
  const settings = data?.settings ?? {};
  const stats = data?.stats ?? [];
  const programs = data?.loanPrograms ?? [];
  const testimonials = data?.testimonials ?? [];

  const phone = s(settings, "phone", "206-496-2282");
  const tel = `tel:${phone.replace(/[^0-9+]/g, "")}`;

  return (
    <div className="flex flex-col min-h-screen">
      <Seo
        title="Home"
        fullTitle={s(settings, "seo_meta_title", "") || undefined}
        description={s(settings, "seo_meta_description", "") || s(settings, "tagline", "Pacific Northwest mortgage broker licensed in Washington & California.")}
        ogImage={s(settings, "seo_og_image", "") || undefined}
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-20 pb-32">
        <div className="absolute inset-0 z-0">
          <img src={resolveImg(settings.hero_bg_url, "hero-bg.png")} alt="" className="w-full h-full object-cover opacity-5" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 max-w-3xl text-foreground"
            >
              <div className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-secondary/10 text-secondary border border-secondary/20 mb-8">
                <MapPinned className="w-3.5 h-3.5 mr-2" />
                {s(settings, "home_chip_text", "Pacific Northwest Mortgage Broker")}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-8 leading-[1.1]">
                {s(settings, "home_hero_heading_lead", "Your neighborhood mortgage")} <span className="text-secondary italic font-medium">{s(settings, "home_hero_heading_accent", "expert")}</span>{s(settings, "home_hero_heading_trail", ".")}
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed font-light max-w-2xl">
                {s(settings, "home_hero_subheading", "We're not a big bank.")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <Link href="/apply">
                  <Button size="lg" className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-white border-0 text-lg h-14 px-10 shadow-lg shadow-secondary/20 transition-all hover:-translate-y-1">
                    {s(settings, "home_hero_cta_primary", "Apply Now")}
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 transition-all hover:-translate-y-1" asChild>
                  <a href={tel}><Phone className="w-5 h-5 mr-2" /> {s(settings, "home_hero_cta_secondary", "Schedule a Call")}</a>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-secondary font-medium">
                {s(settings, "home_trust_badge_1", "VA Loan Specialist") && <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> {s(settings, "home_trust_badge_1", "VA Loan Specialist")}</div>}
                {s(settings, "home_trust_badge_2", "$0 Down VA Loans") && <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> {s(settings, "home_trust_badge_2", "$0 Down VA Loans")}</div>}
                {s(settings, "home_trust_badge_3", "50+ Lender Network") && <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> {s(settings, "home_trust_badge_3", "50+ Lender Network")}</div>}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 hidden lg:block relative"
            >
              <div className="relative w-full aspect-[3/4] max-w-md mx-auto">
                <div className="absolute -inset-4 bg-secondary/10 rounded-[2rem] transform -rotate-3 border border-secondary/10"></div>
                <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] transform rotate-2 border border-primary/10"></div>
                
                <PatrioticPhotoFrame
                  src={resolveImg(settings.headshot_url, "amanda-headshot.png")}
                  alt={s(settings, "site_name", "TBD")}
                  outerClassName="z-10 w-full h-full"
                  imgClassName="rounded-[1.5rem] shadow-2xl object-cover w-full h-full border border-white/10"
                />
                
                <div className="absolute -bottom-6 -left-8 bg-background rounded-xl p-5 shadow-2xl z-20 w-64 border border-border">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center overflow-hidden">
                          <Users className="w-4 h-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-secondary">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold text-foreground text-sm">{s(settings, "home_photo_card_rating", "5.0")}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{s(settings, "home_photo_card_text", "Trusted by 250+ PNW families")}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-background border-b border-border relative z-20 -mt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-2xl shadow-xl border border-border p-8 md:p-12">
            <div className={`grid grid-cols-2 ${(() => { const n = Math.min(stats.length || 4, 4); return n === 1 ? "md:grid-cols-1" : n === 2 ? "md:grid-cols-2" : n === 3 ? "md:grid-cols-3" : "md:grid-cols-4"; })()} gap-8 md:gap-4 divide-x-0 md:divide-x divide-border`}>
              {(stats.length ? stats : [{ id: -1, label: "…", value: "…", sort_order: 0 }, { id: -2, label: "…", value: "…", sort_order: 0 }, { id: -3, label: "…", value: "…", sort_order: 0 }, { id: -4, label: "…", value: "…", sort_order: 0 }]).map((stat) => (
                <div key={stat.id} className="text-center px-4">
                  <p className="text-5xl font-serif font-bold text-secondary mb-3">{stat.value}</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Veterans First Section */}
      <section className="py-24 bg-muted/30 text-foreground relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-secondary/10 text-secondary border border-secondary/20 mb-8">
                <ShieldCheck className="w-3.5 h-3.5" />
                Pacific Northwest Veterans
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6">
                {s(settings, "home_vet_heading", "Here for you — every step of the way.")}
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-10 font-light">
                {s(settings, "home_vet_subheading", "")}
              </p>
              <Link href="/contact">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white border-0 h-14 px-10 text-lg shadow-lg shadow-secondary/20 transition-all hover:-translate-y-1">
                  <HeartHandshake className="w-5 h-5 mr-2" />
                  {s(settings, "home_vet_cta", "Let's Talk — I'm Here")}
                </Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 gap-5">
              {[
                { key: "1", Icon: BadgeCheck },
                { key: "2", Icon: HeartHandshake },
                { key: "3", Icon: HomeIcon },
              ].map(({ key, Icon }, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="flex gap-5 bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-foreground">{s(settings, `home_vet_card_${key}_title`, "")}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{s(settings, `home_vet_card_${key}_body`, "")}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Loan Options */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-serif font-bold text-foreground mb-6">{s(settings, "home_loans_heading", "Loan Options to Meet Your Needs")}</h2>
            <p className="text-muted-foreground text-lg">{s(settings, "home_loans_subheading", "")}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((option, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={option.id} 
                className="bg-background border border-border p-8 rounded-xl shadow-sm hover:shadow-md transition-all group"
              >
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{option.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{option.short_desc}</p>
                <Link href="/loan-programs" className="text-primary font-semibold flex items-center hover:text-secondary transition-colors">
                  Learn more <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Testimonials */}
      <section className="py-24 bg-background text-foreground relative overflow-hidden">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <h2 className="text-4xl font-serif font-bold mb-6 leading-tight text-foreground">{s(settings, "home_testimonials_heading", "Clients love our transparent approach.")}</h2>
              <p className="text-muted-foreground mb-10 text-lg leading-relaxed font-light">
                {s(settings, "home_testimonials_subheading", "")}
              </p>
              <div className="flex flex-col gap-3">
                <span className="font-bold tracking-widest text-xs uppercase text-secondary">LENDING PARTNERS:</span>
                <div className="flex gap-6 items-center text-foreground">
                  <span className="font-serif text-xl italic">Fannie Mae</span>
                  <span className="font-serif text-xl italic">Freddie Mac</span>
                </div>
              </div>
            </motion.div>
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.slice(0, 4).map((t, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  key={t.id} 
                  className="bg-card p-8 rounded-2xl border border-border hover:shadow-md transition-all"
                >
                  <div className="flex mb-6">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} className="w-5 h-5 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-foreground/80 italic mb-8 leading-relaxed text-lg">"{t.text}"</p>
                  <div>
                    <p className="font-bold text-lg">{t.author}</p>
                    {t.location && (
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1 text-secondary" /> {t.location}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">{s(settings, "home_cta_heading", "Ready to make your move?")}</h2>
            <p className="text-xl text-muted-foreground mb-10 font-light">
              {s(settings, "home_cta_subheading", "")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white h-14 px-10 text-lg shadow-xl shadow-secondary/20 w-full sm:w-auto">
                  {s(settings, "home_cta_button", "Start Your Pre-Approval")}
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto" asChild>
                <a href={tel}><Phone className="w-5 h-5 mr-2" /> Call {phone}</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
