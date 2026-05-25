import { Link } from "wouter";
import { Home, Facebook, Instagram, Globe } from "lucide-react";
import { useAmandaContent, s } from "@/hooks/useAmandaContent";

export function Footer() {
  const { data } = useAmandaContent();
  const settings = data?.settings ?? {};
  const phone = s(settings, "phone", "206-496-2282");
  const email = s(settings, "email", "clubmanager@vfwredmond.org");
  const fb = s(settings, "facebook_url", "");
  const ig = s(settings, "instagram_url", "");
  const tel = `tel:${phone.replace(/[^0-9+]/g, "")}`;

  return (
    <footer className="bg-primary text-primary-foreground pt-20 pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <span className="font-serif font-bold text-3xl tracking-tight text-white">{s(settings, "site_name", "TBD")}</span>
              <p className="text-primary-foreground/70 mt-1 uppercase tracking-widest text-sm font-semibold">{s(settings, "site_title_suffix", "Mortgage Loan Officer")}</p>
              {s(settings, "website_url", "") && (
                <a
                  href={s(settings, "website_url", "")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-secondary/20 hover:bg-secondary/30 transition-colors text-secondary font-bold text-sm tracking-wide"
                >
                  <Globe className="w-4 h-4" />
                  {s(settings, "website_url", "").replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
            <div className="space-y-2 text-sm text-primary-foreground/80 mb-8 max-w-sm leading-relaxed">
              <p>{s(settings, "footer_about", "")}</p>
            </div>
            <div className="flex gap-4">
              {fb && (
                <a href={fb} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-colors text-white" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {ig && (
                <a href={ig} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-colors text-white" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase mb-6 text-white">{s(settings, "footer_quick_links_heading", "Quick Links")}</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-primary-foreground/80 hover:text-secondary inline-block transition-colors">{s(settings, "nav_label_home", "Home")}</Link></li>
              <li><Link href="/about" className="text-primary-foreground/80 hover:text-secondary inline-block transition-colors">{s(settings, "footer_link_about_label", "About Amanda")}</Link></li>
              <li><Link href="/loan-programs" className="text-primary-foreground/80 hover:text-secondary inline-block transition-colors">{s(settings, "nav_label_loan_programs", "Loan Programs")}</Link></li>
              <li><Link href="/calculators" className="text-primary-foreground/80 hover:text-secondary inline-block transition-colors">{s(settings, "nav_label_calculators", "Calculators")}</Link></li>
              <li><Link href="/blog" className="text-primary-foreground/80 hover:text-secondary inline-block transition-colors">{s(settings, "nav_label_blog", "Blog")}</Link></li>
              <li><Link href="/contact" className="text-primary-foreground/80 hover:text-secondary inline-block transition-colors">{s(settings, "nav_label_contact", "Contact")}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase mb-6 text-white">{s(settings, "footer_contact_heading", "Contact")}</h3>
            <ul className="space-y-4 text-primary-foreground/80">
              <li><a href={tel} className="hover:text-secondary transition-colors flex items-center gap-2"><span className="font-bold text-white">P:</span> {phone}</a></li>
              <li><a href={`mailto:${email}`} className="hover:text-secondary transition-colors flex items-start gap-2 break-all"><span className="font-bold text-white">E:</span> {email}</a></li>
            </ul>
            
            <div className="mt-8 flex items-start gap-3 text-primary-foreground/60 bg-primary-foreground/5 p-4 rounded-lg">
              <Home className="h-6 w-6 shrink-0 text-white" />
              <div className="text-xs leading-relaxed">
                <strong className="text-white block mb-1">{s(settings, "footer_legal_lender", "Equal Housing Lender")}</strong>
                <p>{s(settings, "footer_legal_body", "")}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/50">
          <p>&copy; {new Date().getFullYear()} {s(settings, "site_name", "TBD")}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>NMLS #{s(settings, "nmls", "")}</span>
            <span className="w-1 h-1 bg-primary-foreground/30 rounded-full"></span>
            <span>{s(settings, "company_name", "Home Lending")}, NMLS #{s(settings, "company_nmls", "")}</span>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-primary-foreground/5 text-center text-xs text-primary-foreground/30">
          Developed &amp; hosted by{" "}
          <a href="https://patriotwebworks.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground/60 transition-colors underline underline-offset-2">
            PatriotWebWorks.com
          </a>
        </div>
      </div>
    </footer>
  );
}
