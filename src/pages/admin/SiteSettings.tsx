import { SettingsEditor, type FieldSection } from "@/components/admin/SettingsEditor";

const SECTIONS: FieldSection[] = [
  {
    title: "Contact Info",
    description: "Your name, role, and contact details — shown on your business card and across the site.",
    cardPreview: true,
    fields: [
      { key: "site_name", label: "Full Name" },
      { key: "site_title_suffix", label: "Title / Role (e.g. 'Mortgage Loan Officer')" },
      { key: "nmls", label: "NMLS Number" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
      { key: "website_url", label: "Website URL (e.g. https://creterhomelending.com)" },
    ],
  },
  {
    title: "Identity",
    description: "Your brand details shown across every page.",
    fields: [
      { key: "brand_name", label: "Brand Name (e.g. 'Creter Home Lending')", help: "Shown in the navbar below your name and title." },
      { key: "tagline", label: "Tagline", type: "textarea", rows: 2 },
      { key: "company_name", label: "Company Name" },
      { key: "company_nmls", label: "Company NMLS" },
      { key: "service_area", label: "Service Area (e.g. 'Washington & California')" },
    ],
  },
  {
    title: "Social Links",
    fields: [
      { key: "facebook_url", label: "Facebook URL" },
      { key: "instagram_url", label: "Instagram URL" },
    ],
  },
  {
    title: "Images",
    description: "Headshot and hero background appear across the site.",
    fields: [
      { key: "headshot_url", label: "Headshot", type: "image", fallback: "amanda-headshot.png" },
      { key: "hero_bg_url", label: "Homepage Hero Background", type: "image", fallback: "hero-bg.png" },
      { key: "blog_default_cover", label: "Default Blog Cover", type: "image", fallback: "pnw-landscape.png" },
    ],
  },
  {
    title: "Navigation Labels",
    description: "Labels for the navigation menu items (shown in header and footer quick links).",
    fields: [
      { key: "nav_label_home", label: "Home" },
      { key: "nav_label_about", label: "About" },
      { key: "nav_label_loan_programs", label: "Loan Programs" },
      { key: "nav_label_calculators", label: "Calculators" },
      { key: "nav_label_blog", label: "Blog" },
      { key: "nav_label_contact", label: "Contact" },
    ],
  },
  {
    title: "Navbar",
    fields: [
      { key: "navbar_co_brand_text", label: "Co-brand line (e.g. 'Powered By')" },
      { key: "navbar_call_label", label: "Call button label (small caps)" },
      { key: "navbar_menu_label", label: "Mobile menu label" },
      { key: "navbar_schedule_label", label: "Schedule-a-call button label" },
      { key: "navbar_apply_label", label: "Apply Now button label" },
    ],
  },
  {
    title: "Footer",
    fields: [
      { key: "footer_about", label: "About blurb in footer", type: "textarea", rows: 3 },
      { key: "footer_quick_links_heading", label: "Quick Links heading" },
      { key: "footer_contact_heading", label: "Contact heading" },
      { key: "footer_link_about_label", label: "About Amanda link label" },
      { key: "footer_legal_lender", label: "Legal lender label" },
      { key: "footer_legal_body", label: "Legal body text", type: "textarea", rows: 2 },
    ],
  },
  {
    title: "SEO — Homepage",
    description: "Control how your homepage appears in Google search results and when shared on social media.",
    fields: [
      {
        key: "seo_meta_title",
        label: "Homepage Meta Title",
        help: "The title shown in Google results and browser tabs. Keep it under 60 characters.",
      },
      {
        key: "seo_meta_description",
        label: "Homepage Meta Description",
        type: "textarea",
        rows: 2,
        help: "A short summary shown under your link in Google. Aim for 140–160 characters.",
      },
      {
        key: "seo_og_image",
        label: "Social Share Image (OG Image)",
        type: "image",
        fallback: "hero-bg.png",
        help: "Image displayed when your site is shared on Facebook, iMessage, LinkedIn, etc. Recommended: 1200×630 px.",
        ogPreview: true,
        ogPagePath: "/",
      },
    ],
  },
  {
    title: "SEO — About Page",
    description: "How the About page appears in search results.",
    fields: [
      {
        key: "seo_about_title",
        label: "About Page Meta Title",
        help: "Keep it under 60 characters.",
      },
      {
        key: "seo_about_description",
        label: "About Page Meta Description",
        type: "textarea",
        rows: 2,
        help: "Aim for 140–160 characters.",
      },
      {
        key: "seo_about_og_image",
        label: "About Page Social Share Image",
        type: "image",
        fallback: "hero-bg.png",
        help: "1200×630 px recommended. Falls back to the homepage OG image if blank.",
        ogPreview: true,
        ogTitleKey: "seo_about_title",
        ogDescriptionKey: "seo_about_description",
        ogPagePath: "/about",
      },
    ],
  },
  {
    title: "SEO — Loan Programs Page",
    description: "How the Loan Programs page appears in search results.",
    fields: [
      {
        key: "seo_loans_title",
        label: "Loan Programs Meta Title",
        help: "Keep it under 60 characters.",
      },
      {
        key: "seo_loans_description",
        label: "Loan Programs Meta Description",
        type: "textarea",
        rows: 2,
        help: "Aim for 140–160 characters.",
      },
      {
        key: "seo_loans_og_image",
        label: "Loan Programs Social Share Image",
        type: "image",
        fallback: "hero-bg.png",
        help: "1200×630 px recommended. Falls back to the homepage OG image if blank.",
        ogPreview: true,
        ogTitleKey: "seo_loans_title",
        ogDescriptionKey: "seo_loans_description",
        ogPagePath: "/loans",
      },
    ],
  },
  {
    title: "SEO — Blog Page",
    description: "How the Blog index page appears in search results.",
    fields: [
      {
        key: "seo_blog_title",
        label: "Blog Meta Title",
        help: "Keep it under 60 characters.",
      },
      {
        key: "seo_blog_description",
        label: "Blog Meta Description",
        type: "textarea",
        rows: 2,
        help: "Aim for 140–160 characters.",
      },
      {
        key: "seo_blog_og_image",
        label: "Blog Social Share Image",
        type: "image",
        fallback: "hero-bg.png",
        help: "1200×630 px recommended. Falls back to the homepage OG image if blank.",
        ogPreview: true,
        ogTitleKey: "seo_blog_title",
        ogDescriptionKey: "seo_blog_description",
        ogPagePath: "/blog",
      },
    ],
  },
  {
    title: "SEO — Calculators Page",
    description: "How the Calculators page appears in search results.",
    fields: [
      {
        key: "seo_calculators_title",
        label: "Calculators Meta Title",
        help: "Keep it under 60 characters.",
      },
      {
        key: "seo_calculators_description",
        label: "Calculators Meta Description",
        type: "textarea",
        rows: 2,
        help: "Aim for 140–160 characters.",
      },
      {
        key: "seo_calculators_og_image",
        label: "Calculators Social Share Image",
        type: "image",
        fallback: "hero-bg.png",
        help: "1200×630 px recommended. Falls back to the homepage OG image if blank.",
        ogPreview: true,
        ogTitleKey: "seo_calculators_title",
        ogDescriptionKey: "seo_calculators_description",
        ogPagePath: "/calculators",
      },
    ],
  },
  {
    title: "SEO — Contact Page",
    description: "How the Contact page appears in search results.",
    fields: [
      {
        key: "seo_contact_title",
        label: "Contact Meta Title",
        help: "Keep it under 60 characters.",
      },
      {
        key: "seo_contact_description",
        label: "Contact Meta Description",
        type: "textarea",
        rows: 2,
        help: "Aim for 140–160 characters.",
      },
      {
        key: "seo_contact_og_image",
        label: "Contact Social Share Image",
        type: "image",
        fallback: "hero-bg.png",
        help: "1200×630 px recommended. Falls back to the homepage OG image if blank.",
        ogPreview: true,
        ogTitleKey: "seo_contact_title",
        ogDescriptionKey: "seo_contact_description",
        ogPagePath: "/contact",
      },
    ],
  },
  {
    title: "Email Notifications",
    description: "When someone submits the contact form, an email is sent to your address above. Configure the outgoing mail server here.",
    fields: [
      {
        key: "smtp_user",
        label: "SMTP Username (sending address)",
        help: "The email address used to send notifications — e.g. you@gmail.com",
      },
      {
        key: "smtp_pass",
        label: "SMTP Password / App Password",
        type: "password",
        help: "For Gmail, use an App Password (not your regular password). Never shared publicly.",
      },
      {
        key: "smtp_host",
        label: "SMTP Host",
        help: "Leave blank to use smtp.gmail.com",
      },
      {
        key: "smtp_port",
        label: "SMTP Port",
        help: "587 for TLS (recommended), 465 for SSL. Leave blank for 587.",
      },
      {
        key: "smtp_from",
        label: "From Address (optional)",
        help: "Defaults to the SMTP Username above if left blank.",
      },
    ],
  },
];

export default function SiteSettings() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-2">Site Settings</p>
        <h1 className="text-3xl font-serif font-bold">Identity &amp; brand</h1>
        <p className="text-muted-foreground mt-2">Your name, contact, images and footer.</p>
      </header>
      <SettingsEditor sections={SECTIONS} />
    </div>
  );
}
