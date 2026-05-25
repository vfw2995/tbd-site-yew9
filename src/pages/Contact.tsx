import { useState, useRef, useCallback } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { Seo } from "@/components/Seo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { NameField, EmailField, RequiredPhoneField, MessageField } from "@workspace/validators/fields";
import { Button } from "@workspace/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/form";
import { Input } from "@workspace/ui/input";
import { Textarea } from "@workspace/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/select";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { Phone, Mail, MapPin, Building, Clock, Globe, Loader2, Copy, Check, Download, QrCode } from "lucide-react";
import { useAmandaContent, s } from "@/hooks/useAmandaContent";
import { api } from "@/lib/api";

function ObfuscatedLink({ value, type, className }: { value: string; type: "email" | "phone"; className?: string }) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    window.location.href = type === "email" ? `mailto:${value}` : `tel:${value.replace(/[^0-9+]/g, "")}`;
  }
  const chars = value.split("");
  return (
    <a
      href="#"
      onClick={handleClick}
      aria-label={value}
      className={className}
    >
      {chars.map((ch, i) => (
        <span key={i}>
          {i % 3 === 1 && (
            <span aria-hidden="true" style={{ display: "none" }}>&#8203;</span>
          )}
          {ch}
        </span>
      ))}
    </a>
  );
}

const formSchema = z.object({
  name: NameField,
  email: EmailField,
  phone: RequiredPhoneField,
  loanType: z.string().min(1, "Please select an inquiry type"),
  message: MessageField,
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const { toast } = useToast();
  const { data } = useAmandaContent();
  const settings = data?.settings ?? {};
  const phone = s(settings, "phone", "206-496-2282");
  const email = s(settings, "email", "clubmanager@vfwredmond.org");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  const downloadQR = useCallback(() => {
    const canvas = qrCanvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "amanda-creter-qr.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "TBD QR Code" });
          return;
        } catch {
          // user cancelled — fall through to direct download
        }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "amanda-creter-qr.png";
      a.click();
      URL.revokeObjectURL(url);
    });
  }, []);

  const name = s(settings, "site_name", "TBD");
  const title = s(settings, "site_title_suffix", "Mortgage Loan Officer");
  const company = s(settings, "company_name", "Home Lending");
  const nmls = s(settings, "nmls", "");
  const websiteUrl = s(settings, "website_url", "https://creterhomelending.com");
  const websiteDisplay = websiteUrl.replace(/^https?:\/\//, "");

  const signatureText = [
    name,
    title,
    company,
    nmls ? `NMLS #${nmls}` : "",
    `📞 ${phone}`,
    `✉️ ${email}`,
    `🌐 ${websiteDisplay}`,
  ].filter(Boolean).join("\n");

  function handleCopy() {
    navigator.clipboard.writeText(signatureText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", loanType: "", message: "" }
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await api("/public/contact", {
        method: "POST",
        body: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          loanType: values.loanType,
          message: values.message,
          _trap: "",
        },
      });
      toast({
        title: s(settings, "contact_form_success_title", "Message Sent!"),
        description: s(settings, "contact_form_success_body", "Thank you for reaching out. I'll be in touch shortly."),
      });
      form.reset();
    } catch (e) {
      toast({
        title: "Submission failed",
        description: (e as Error).message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Seo
        title={s(settings, "contact_hero_heading", "Contact")}
        description={s(settings, "seo_contact_description", "") || s(settings, "contact_hero_subheading", "")}
        fullTitle={s(settings, "seo_contact_title", "") || undefined}
        ogImage={s(settings, "seo_contact_og_image", "") || s(settings, "seo_og_image", "") || undefined}
      />
      
      <div className="bg-primary text-primary-foreground py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{s(settings, "contact_hero_heading", "Contact Amanda")}</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mb-8">{s(settings, "contact_hero_subheading", "")}</p>
          <a href="#contact-form">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white h-14 px-10 text-lg shadow-xl shadow-secondary/20">
              {s(settings, "home_cta_button", "Start Your Pre-Approval")}
            </Button>
          </a>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">

          <div>
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">{s(settings, "contact_intro_heading", "Get in touch")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              {s(settings, "contact_intro_body", "")}
            </p>
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center shrink-0 mr-4">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">{s(settings, "contact_form_label_phone_section", "Phone")}</p>
                  <ObfuscatedLink value={phone} type="phone" className="text-xl font-semibold text-foreground hover:text-secondary transition-colors" />
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center shrink-0 mr-4">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">{s(settings, "contact_form_label_email_section", "Email")}</p>
                  <ObfuscatedLink value={email} type="email" className="text-xl font-semibold text-foreground hover:text-secondary transition-colors break-all" />
                </div>
              </div>
              
              {s(settings, "website_url", "") && (
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center shrink-0 mr-4">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Website</p>
                    <a
                      href={s(settings, "website_url", "")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-semibold text-secondary hover:text-secondary/80 transition-colors"
                    >
                      {s(settings, "website_url", "").replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center shrink-0 mr-4">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">{s(settings, "contact_form_label_areas", "Areas Served")}</p>
                  <p className="text-xl font-semibold text-foreground">{s(settings, "service_area", "Pacific Northwest · WA & CA")}</p>
                </div>
              </div>

              {settings.contact_hours && (
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center shrink-0 mr-4">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">{s(settings, "contact_form_label_hours", "Hours")}</p>
                    <p className="text-xl font-semibold text-foreground">{settings.contact_hours}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center shrink-0 mr-4">
                  <Building className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">{s(settings, "contact_form_label_company", "Company")}</p>
                  <p className="text-xl font-semibold text-foreground">{s(settings, "brand_name", "Creter Home Lending")}</p>
                  <p className="text-sm text-muted-foreground mt-1">{s(settings, "navbar_co_brand_text", "Powered by")} {s(settings, "company_name", "Home Lending")} · NMLS #{s(settings, "nmls", "")}</p>
                </div>
              </div>
            </div>
          </div>

          <div id="contact-form" className="bg-card border border-border rounded-xl shadow-lg p-8 md:p-10">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-6">{s(settings, "contact_form_heading", "Send a Message")}</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>{s(settings, "contact_form_field_name", "Full Name")}</FormLabel><FormControl><Input placeholder="Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>{s(settings, "contact_form_field_phone", "Phone Number")}</FormLabel><FormControl><Input placeholder="(555) 123-4567" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>{s(settings, "contact_form_field_email", "Email Address")}</FormLabel><FormControl><Input placeholder="jane@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="loanType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{s(settings, "contact_form_field_inquiry", "How can I help you?")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Purchase">{s(settings, "contact_form_inquiry_purchase", "Home Purchase")}</SelectItem>
                        <SelectItem value="Pre-Approval">{s(settings, "contact_form_inquiry_preapproval", "Get Pre-Approved")}</SelectItem>
                        <SelectItem value="Refinance">{s(settings, "contact_form_inquiry_refinance", "Refinance")}</SelectItem>
                        <SelectItem value="Cash-Out">{s(settings, "contact_form_inquiry_cashout", "Cash-Out Refinance")}</SelectItem>
                        <SelectItem value="Questions">{s(settings, "contact_form_inquiry_questions", "Just Have Questions")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem><FormLabel>{s(settings, "contact_form_field_message", "Message")}</FormLabel><FormControl><Textarea placeholder="Tell me a bit about what you're looking for..." className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" disabled={submitting} className="w-full bg-secondary hover:bg-secondary/90 text-white h-12 text-base">
                  {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending…</> : s(settings, "contact_form_submit_label", "Send Message")}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  {s(settings, "contact_form_consent", "By submitting this form, you agree to be contacted regarding your mortgage inquiry. Your information is kept strictly confidential.")}
                </p>
              </form>
            </Form>
          </div>

        </div>

        <div className="max-w-6xl mx-auto mt-16 pt-16 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Share My Info</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Copy the block below to use as an email signature, paste into a text, or share with anyone looking to connect.
              </p>
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm font-mono text-sm leading-relaxed text-foreground space-y-1 select-all">
                <p className="font-bold text-base font-sans">{name}</p>
                <p className="text-muted-foreground font-sans text-xs uppercase tracking-wide">{title} &mdash; {company}{nmls ? ` · NMLS #${nmls}` : ""}</p>
                <div className="border-t border-border my-3" />
                <p><span className="text-muted-foreground">📞</span> <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="hover:text-secondary transition-colors">{phone}</a></p>
                <p><span className="text-muted-foreground">✉️</span> <a href={`mailto:${email}`} className="hover:text-secondary transition-colors">{email}</a></p>
                <p><span className="text-muted-foreground">🌐</span> <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-secondary/80 transition-colors">{websiteDisplay}</a></p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 gap-2"
                onClick={handleCopy}
              >
                {copied ? <><Check className="w-4 h-4 text-green-500" />Copied!</> : <><Copy className="w-4 h-4" />Copy to clipboard</>}
              </Button>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Business Card</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Scan the QR code to visit <span className="font-semibold text-secondary">{websiteDisplay}</span> instantly — great for print materials and sharing in person.
              </p>
              <div className="bg-primary text-primary-foreground rounded-2xl shadow-xl p-8 max-w-sm">
                <p className="text-xs uppercase tracking-widest text-primary-foreground/60 mb-1">{company}</p>
                <h3 className="text-2xl font-serif font-bold mb-0.5">{name}</h3>
                <p className="text-sm text-primary-foreground/70 mb-5">{title}{nmls ? <> &middot; NMLS #{nmls}</> : null}</p>

                <div className="flex items-end gap-6">
                  <div className="space-y-2 text-sm flex-1">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary-foreground/50 shrink-0" />
                      <span>{phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary-foreground/50 shrink-0" />
                      <span className="break-all text-xs">{email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-secondary shrink-0" />
                      <span className="font-bold text-secondary">{websiteDisplay}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-center gap-1.5">
                    <div className="bg-white rounded-xl p-2 shadow-lg">
                      <QRCodeSVG
                        value={websiteUrl || "https://creterhomelending.com"}
                        size={88}
                        bgColor="#ffffff"
                        fgColor="#0f1f3d"
                        level="M"
                      />
                    </div>
                    <p className="text-[9px] text-primary-foreground/50 uppercase tracking-wider">Scan me</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div ref={qrCanvasRef} className="hidden">
                  <QRCodeCanvas
                    value={websiteUrl || "https://creterhomelending.com"}
                    size={512}
                    bgColor="#ffffff"
                    fgColor="#0f1f3d"
                    level="M"
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={downloadQR}>
                  <Download className="w-4 h-4" />
                  Download QR Code
                </Button>
                <span className="text-xs text-muted-foreground">PNG · 512×512 px</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
