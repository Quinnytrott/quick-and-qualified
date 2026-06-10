export const BUSINESS_NAME = "Quick & Qualified Exteriors";
export const SHORT_BUSINESS_NAME = "Q2";
export const REPORT_NAME = "Q2 Roof Condition Report";
export const TAGLINE = "Roof Condition Reports • Contractor Handoff";
export const SERVICE_AREA = "Georgina, Ontario + surrounding area";
export const PHONE_DISPLAY = "289-338-9804";
export const PHONE_TEL = "+12893389804";
export const EMAIL = "info@quickandqualified.ca";
export const HOME_PATH = "/";
export const REPORT_PAGE_PATH = "/roof-condition-report";
export const CONTRACTOR_APPLICATION_PATH = "/contractors";

export const SECTION_IDS = {
  hero: "hero",
  trust: "trust",
  audience: "homeowners-contractors",
  reportIncluded: "roof-condition-report",
  process: "how-it-works",
  whyHomeowners: "why-homeowners-use-q2",
  clarity: "what-it-is",
  partnerNetwork: "partner-network",
  serviceArea: "service-area",
  quote: "book-report",
  footer: "footer",
} as const;

export const CALL_TO_ACTION_LABEL = "Call / Text";
export const REQUEST_QUOTE_LABEL = "Book a Roof Condition Report";
export const CONTRACTOR_APPLY_LABEL = "Apply as a Contractor";

export const SITE_METADATA = {
  title: `${REPORT_NAME} | ${BUSINESS_NAME}`,
  description:
    "Homeowner-requested roof condition reports with drone photos, exterior photo documentation, visible-condition notes, and optional vetted contractor handoff in Georgina, Ontario.",
};

export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Reports", href: REPORT_PAGE_PATH },
  { label: "How It Works", href: `${HOME_PATH}#${SECTION_IDS.process}` },
  { label: "Contractors", href: CONTRACTOR_APPLICATION_PATH },
  { label: "Book Report", href: `${HOME_PATH}#${SECTION_IDS.quote}` },
];

export const HERO_COPY = {
  eyebrow: REPORT_NAME,
  heading: "Get a clear Roof Condition Report before you call around for quotes.",
  description:
    "Q2 documents the visible condition of your roof with drone photos, exterior photos, notes, and a contractor-ready summary — then connects you with a vetted local exterior contractor if repairs are needed.",
};

export const TRUST_ITEMS = [
  "Homeowner-requested and consent-based",
  "Photo documentation for visible exterior conditions",
  `Local service across ${SERVICE_AREA}`,
];

export const AUDIENCE_SECTION_COPY = {
  eyebrow: "For Homeowners And Contractors",
  heading: "Clarity before the quote conversation",
};

export type AudienceCard = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
};

export const HOMEOWNER_CARD: AudienceCard = {
  eyebrow: "Homeowners",
  title: "Know what’s happening on your roof before you chase quotes.",
  description:
    "Q2 helps homeowners understand the visible condition of their roof using photos, notes, and a simple report. Keep it for homeowner records or share it with a vetted contractor when a repair or replacement quote is needed.",
  ctaLabel: REQUEST_QUOTE_LABEL,
  href: `#${SECTION_IDS.quote}`,
};

export const CONTRACTOR_CARD: AudienceCard = {
  eyebrow: "Contractors",
  title: "Qualified exterior opportunities with better documentation.",
  description:
    "Apply to join Q2’s private contractor partner network for qualified exterior opportunities. Contractors receive better-documented homeowner requests, not cold leads from an open marketplace.",
  ctaLabel: CONTRACTOR_APPLY_LABEL,
  href: CONTRACTOR_APPLICATION_PATH,
};

export const CONTRACTOR_PAGE_COPY = {
  eyebrow: "Q2 Contractor Partner Network",
  heading: "Apply to join Q2’s contractor partner network.",
  description:
    "Q2 connects homeowners with reviewed local exterior contractors after a Roof Condition Report is completed and the homeowner gives permission to share their information.",
  trust:
    "Q2 does not sell homeowner information to an open list of contractors. Contractor partners are reviewed before receiving homeowner opportunities.",
  fitNote:
    "Applications are reviewed for service area, exterior trade fit, communication standards, and available project types. This does not guarantee lead volume, exclusive territory, or contractor selection for every homeowner request.",
};

export const CONTRACTOR_APPLICATION_COPY = {
  heading: "Contractor partner application",
  description:
    "Share the basics Q2 needs to review contractor fit for roof, eavestrough, fascia, soffit, and exterior repair opportunities.",
  companyNameLabel: "Company name",
  companyNamePlaceholder: "Company name",
  contactNameLabel: "Contact name",
  contactNamePlaceholder: "Primary contact",
  emailLabel: "Email",
  emailPlaceholder: "contractor@email.com",
  phoneLabel: "Phone",
  phonePlaceholder: "Best contact number",
  serviceAreaLabel: "Service area",
  serviceAreaPlaceholder: "Towns or regions you regularly serve",
  servicesOfferedLabel: "Services offered",
  servicesOfferedPlaceholder: "Roof repairs, eavestroughs, fascia, soffit, replacement work, etc.",
  insuranceStatusLabel: "Insurance / WSIB status",
  insuranceStatusPlaceholder: "Select one",
  yearsInBusinessLabel: "Years in business",
  yearsInBusinessPlaceholder: "Example: 8",
  preferredJobTypesLabel: "Preferred job types",
  preferredJobTypesPlaceholder: "Small repairs, replacement quotes, storm response, eavestrough work, etc.",
  notesLabel: "Notes",
  notesPlaceholder: "Trade details, crew capacity, scheduling preferences, or anything Q2 should know.",
  submitLabel: "Submit Contractor Application",
  successMessage:
    "Thanks — your contractor partner application has been received. Q2 will review your service area, fit, and trade details before sharing homeowner opportunities.",
};

export const INSURANCE_STATUS_OPTIONS = [
  "Insured and WSIB active",
  "Insured, WSIB exempt",
  "Insurance in place, WSIB pending",
  "Need to discuss",
];

export const PROCESS_SECTION_COPY = {
  eyebrow: "How Q2 Works",
  heading: "See the roof. Understand the issue. Choose the next step.",
};

export type ProcessStep = {
  title: string;
  description: string;
};

export const PROCESS_STEPS: ProcessStep[] = [
  {
    title: "Capture",
    description:
      "Q2 collects exterior photos and drone views where safe, legal, and appropriate.",
  },
  {
    title: "Report",
    description:
      "The visible roof condition is organized into a simple homeowner report.",
  },
  {
    title: "Review",
    description:
      "The homeowner sees photos, notes, urgency, and a recommended next step.",
  },
  {
    title: "Connect",
    description:
      "With permission, Q2 sends the package to a vetted contractor partner.",
  },
];

export const REPORT_INCLUDED_SECTION_COPY = {
  eyebrow: "What’s Included",
  heading: `What’s included in a ${REPORT_NAME}`,
  description:
    "Drone overview photos, exterior detail photos, visible-condition notes, basic measurement-supported context, urgency guidance, recommended next steps, and a contractor-ready summary.",
  ctaLabel: "Learn about the report",
};

export type ReportItem = {
  title: string;
  description: string;
};

export const REPORT_INCLUDED_ITEMS: ReportItem[] = [
  {
    title: "Drone overview photos",
    description:
      "Wide roof views captured from above where safe, legal, and appropriate.",
  },
  {
    title: "Exterior detail photos",
    description:
      "Closer photos of visible concerns such as missing shingles, lifted shingles, exposed areas, damaged flashing, clogged or damaged eavestroughs, fascia concerns, or storm-related exterior issues.",
  },
  {
    title: "Visible-condition notes",
    description:
      "Plain-language notes on visible roof and exterior concerns that may need contractor attention.",
  },
  {
    title: "Basic measurement-supported context",
    description:
      "A simple roof-area or scope context where available, used to help homeowners and contractors understand the job before a site visit.",
  },
  {
    title: "Urgency category",
    description:
      "Simple categories such as Monitor, Repair soon, or Urgent review recommended.",
  },
  {
    title: "Recommended next step",
    description:
      "Guidance such as keep for records, request a repair quote, request a replacement quote, or have a contractor review before the next storm or winter season.",
  },
  {
    title: "Contractor-ready summary",
    description:
      "A clean summary that can be shared with a vetted local exterior contractor.",
  },
  {
    title: "Optional contractor handoff",
    description:
      "With homeowner permission, Q2 can send the report to a reviewed contractor partner for quote follow-up.",
  },
];

export const WHY_HOMEOWNERS_SECTION_COPY = {
  eyebrow: "Why Homeowners Use Q2",
  heading: "Get clarity before you start calling around.",
};

export const WHY_HOMEOWNERS_ITEMS = [
  "Avoid climbing ladders or guessing from the ground.",
  "Understand visible roof concerns before calling around.",
  "Keep photo documentation for your own records.",
  "Get a clearer contractor conversation.",
  "Avoid sending your information to a random list of contractors.",
  "Move faster after storms, leaks, wind, hail, tree damage, or winter ice-damming concerns.",
];

export const CLARITY_SECTION_COPY = {
  eyebrow: "What It Is / What It Isn’t",
  heading: "Built for clarity, with clear limits.",
  isDescription:
    "A Q2 Roof Condition Report is visual documentation of what can be seen from the exterior. It is designed to help homeowners understand visible roof concerns and prepare for contractor conversations.",
  isNotDescription:
    "It is not a structural engineering report, home inspection, insurance adjustment, code-compliance review, workmanship warranty, or guarantee that hidden damage does or does not exist. Contractor quotes, repairs, warranties, and project execution are provided by independent contractor partners unless otherwise stated.",
};

export const PARTNER_NETWORK_COPY = {
  eyebrow: "Private Partner Network",
  heading: "Not an open contractor marketplace.",
  description:
    "Q2 does not sell homeowner information to an open list of contractors. Contractors apply and are reviewed before receiving homeowner opportunities. Homeowner information is only shared after permission.",
};

export const SERVICE_AREA_SECTION_COPY = {
  eyebrow: "Local Service Area",
  description:
    "Q2 provides roof condition reports and contractor handoff support in Georgina, Ontario and the surrounding area. Share your address, photos if available, and a short description so we can confirm fit and next steps.",
};

export const FAQ_SECTION_COPY = {
  heading: "Frequently Asked Questions",
};

export type FAQItem = {
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Is this a home inspection or engineering report?",
    answer:
      "No. A Q2 Roof Condition Report documents visible exterior conditions only. It is not a structural engineering report, home inspection, code-compliance review, or warranty.",
  },
  {
    question: "Do I need to climb on the roof?",
    answer:
      "No. Please do not climb ladders or get on the roof. Q2 uses exterior photos and drone views where safe, legal, and appropriate.",
  },
  {
    question: "What happens after I receive the report?",
    answer:
      "You can keep it for homeowner records, monitor visible concerns, request a repair or replacement quote, or ask Q2 to send the package to a vetted local contractor partner.",
  },
  {
    question: "Will my information be shared with contractors?",
    answer:
      "Only with your permission. Q2 does not sell homeowner information to an open list of contractors.",
  },
  {
    question: "Does Q2 handle insurance decisions?",
    answer:
      "No. The report can support your homeowner records, but Q2 is not an insurance adjuster and does not decide whether an insurer will approve, deny, or pay for a claim.",
  },
];

export const QUOTE_FORM_COPY = {
  heading: REQUEST_QUOTE_LABEL,
  description:
    "Share your address, contact details, and what prompted the request. Q2 will follow up to confirm fit, timing, and the next step.",
  nameLabel: "Name",
  namePlaceholder: "Your name",
  phoneLabel: "Phone",
  phonePlaceholder: "Your best contact number",
  emailLabel: "Email",
  emailPlaceholder: "your@email.com",
  addressLabel: "Address",
  addressPlaceholder: "Property address",
  jobTypeLabel: "Reason For Report",
  jobTypePlaceholder: "Select one",
  notesLabel: "Notes",
  notesPlaceholder:
    "Describe what you can see, recent weather, leaks, timing, or anything else helpful.",
  submitLabel: "Submit Report Request",
};

export const JOB_TYPES = [
  "Visible roof concern",
  "Leak or water entry concern",
  "Storm, wind, hail, or tree-related exterior concern",
  "Eavestrough, fascia, or roof-edge concern",
  "Pre-quote documentation",
  "Homeowner records / monitor",
  "Other",
];

export const FOOTER_COPY = {
  phoneLabel: "Phone",
  emailLabel: "Email",
  rightsLabel: "All rights reserved.",
  disclaimer:
    "Q2 provides visual exterior documentation, roof condition reports, and contractor referral services. Reports are based on visible exterior conditions only. Contractor quotes, repair work, warranties, and project execution are provided by independent contractor partners unless otherwise stated. Q2 only shares homeowner information with contractor partners after homeowner permission.",
};
