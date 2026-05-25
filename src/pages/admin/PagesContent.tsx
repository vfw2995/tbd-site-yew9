import { SettingsEditor, type FieldSection } from "@/components/admin/SettingsEditor";

const SECTIONS: FieldSection[] = [
  {
    title: "About Page",
    fields: [
      { key: "about_hero_heading", label: "Hero heading" },
      { key: "about_hero_subheading", label: "Hero subheading", type: "textarea", rows: 2 },
      { key: "about_title_line", label: "Sidebar title line" },
      { key: "about_bio_heading", label: "Bio heading" },
      { key: "about_bio_markdown", label: "Bio body (markdown)", type: "markdown", rows: 12 },
      { key: "about_broker_section_heading", label: "Broker section heading" },
      { key: "about_broker_card_1_title", label: "Card 1 title" },
      { key: "about_broker_card_1_body", label: "Card 1 body", type: "textarea", rows: 3 },
      { key: "about_broker_card_2_title", label: "Card 2 title" },
      { key: "about_broker_card_2_body", label: "Card 2 body", type: "textarea", rows: 3 },
      { key: "about_broker_card_3_title", label: "Card 3 title" },
      { key: "about_broker_card_3_body", label: "Card 3 body", type: "textarea", rows: 3 },
      { key: "about_cta_heading", label: "Bottom CTA heading" },
      { key: "about_cta_button", label: "Bottom CTA button label" },
    ],
  },
  {
    title: "Loan Programs Page",
    fields: [
      { key: "loan_programs_hero_heading", label: "Hero heading" },
      { key: "loan_programs_hero_subheading", label: "Hero subheading", type: "textarea", rows: 2 },
      { key: "loan_programs_cta_heading", label: "Bottom CTA heading" },
      { key: "loan_programs_cta_subheading", label: "Bottom CTA subheading", type: "textarea", rows: 2 },
      { key: "loan_programs_cta_button", label: "Bottom CTA button label" },
    ],
  },
  {
    title: "Calculators Page",
    fields: [
      { key: "calculators_hero_heading", label: "Hero heading" },
      { key: "calculators_hero_subheading", label: "Hero subheading", type: "textarea", rows: 2 },
      { key: "calculators_tab_payment_label", label: "Monthly Payment — tab label" },
      { key: "calculators_tab_payment_desc", label: "Monthly Payment — description", type: "textarea", rows: 2 },
      { key: "calculators_tab_affordability_label", label: "Affordability — tab label" },
      { key: "calculators_tab_affordability_desc", label: "Affordability — description", type: "textarea", rows: 2 },
      { key: "calculators_tab_refinance_label", label: "Refinance — tab label" },
      { key: "calculators_tab_refinance_desc", label: "Refinance — description", type: "textarea", rows: 2 },
      { key: "calculators_disclaimer", label: "Disclaimer", type: "textarea", rows: 3 },
    ],
  },
  {
    title: "Contact Page — Header & Intro",
    fields: [
      { key: "contact_hero_heading", label: "Hero heading" },
      { key: "contact_hero_subheading", label: "Hero subheading", type: "textarea", rows: 2 },
      { key: "contact_intro_heading", label: "Intro heading" },
      { key: "contact_intro_body", label: "Intro body", type: "textarea", rows: 4 },
      { key: "contact_hours", label: "Hours line" },
    ],
  },
  {
    title: "Contact Page — Info Card Labels",
    description: "Section labels next to phone, email, areas served, hours, company.",
    fields: [
      { key: "contact_form_label_phone_section", label: "Phone section label" },
      { key: "contact_form_label_email_section", label: "Email section label" },
      { key: "contact_form_label_areas", label: "Areas Served label" },
      { key: "contact_form_label_hours", label: "Hours label" },
      { key: "contact_form_label_company", label: "Company label" },
    ],
  },
  {
    title: "Contact Page — Form",
    description: "All labels, dropdown options, button, and confirmation text for the contact form.",
    fields: [
      { key: "contact_form_heading", label: "Form card heading" },
      { key: "contact_form_field_name", label: "Full Name field label" },
      { key: "contact_form_field_phone", label: "Phone field label" },
      { key: "contact_form_field_email", label: "Email field label" },
      { key: "contact_form_field_inquiry", label: "Inquiry-type field label" },
      { key: "contact_form_field_message", label: "Message field label" },
      { key: "contact_form_inquiry_purchase", label: "Inquiry option — Purchase" },
      { key: "contact_form_inquiry_preapproval", label: "Inquiry option — Pre-Approval" },
      { key: "contact_form_inquiry_refinance", label: "Inquiry option — Refinance" },
      { key: "contact_form_inquiry_cashout", label: "Inquiry option — Cash-Out" },
      { key: "contact_form_inquiry_questions", label: "Inquiry option — Questions" },
      { key: "contact_form_submit_label", label: "Submit button label" },
      { key: "contact_form_consent", label: "Consent line below button", type: "textarea", rows: 3 },
      { key: "contact_form_success_title", label: "Success toast — title" },
      { key: "contact_form_success_body", label: "Success toast — body", type: "textarea", rows: 2 },
    ],
  },
  {
    title: "Blog Page",
    fields: [
      { key: "blog_hero_heading", label: "Hero heading" },
      { key: "blog_hero_subheading", label: "Hero subheading", type: "textarea", rows: 2 },
    ],
  },
];

export default function PagesContent() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-widest text-muted-foreground font-bold mb-2">Pages Content</p>
        <h1 className="text-3xl font-serif font-bold">Edit page copy</h1>
        <p className="text-muted-foreground mt-2">All editable text on About, Loan Programs, Calculators, Contact, and Blog pages.</p>
      </header>
      <SettingsEditor sections={SECTIONS} />
    </div>
  );
}
