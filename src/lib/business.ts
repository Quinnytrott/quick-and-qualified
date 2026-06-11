export const BUSINESS_NAME = "Quick & Qualified Exteriors";
export const SHORT_BUSINESS_NAME = "Q2";
export const REPORT_NAME = "Q2 Exterior Reports";
export const TAGLINE = "Exterior Reports • Contractor Handoff";
export const SERVICE_AREA = "Georgina, Ontario + surrounding area";
export const PHONE_DISPLAY = "289-338-9804";
export const PHONE_TEL = "+12893389804";
export const EMAIL = "info@quickandqualified.ca";
export const HOME_PATH = "/";
export const REPORT_PAGE_PATH = "/roof-condition-report";
export const HOMEOWNER_PAGE_PATH = "/homeowners";
export const REAL_ESTATE_AGENT_PAGE_PATH = "/real-estate-agents";
export const CONTRACTOR_APPLICATION_PATH = "/contractors";

export const SECTION_IDS = {
  hero: "hero",
  trust: "trust",
  audience: "exterior-report-lanes",
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
export const REQUEST_QUOTE_LABEL = "Request an Exterior Check";
export const CONTRACTOR_APPLY_LABEL = "Partner With Q2";

export const SITE_METADATA = {
  title: `${REPORT_NAME} | ${BUSINESS_NAME}`,
  description:
    "Drone-based exterior condition reports, visible-condition notes, and qualified contractor handoffs for homeowners, real estate agents, and contractors in Georgina, Ontario.",
};

export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: HOME_PATH },
  { label: "Reports", href: REPORT_PAGE_PATH },
  { label: "Homeowners", href: HOMEOWNER_PAGE_PATH },
  { label: "Real Estate Agents", href: REAL_ESTATE_AGENT_PAGE_PATH },
  { label: "Contractors", href: CONTRACTOR_APPLICATION_PATH },
];

export const HERO_COPY = {
  eyebrow: REPORT_NAME,
  heading: "Make faster exterior decisions with first-look condition reports.",
  description:
    "Q2 helps homeowners, real estate agents, and contractors make faster exterior decisions with drone-based condition reports, visible condition notes, urgency context, and qualified contractor handoffs.",
};

export const TRUST_ITEMS = [
  "Homeowner-requested and consent-based",
  "Photo documentation for visible exterior conditions",
  `Local service across ${SERVICE_AREA}`,
];

export const AUDIENCE_SECTION_COPY = {
  eyebrow: "Q2 Exterior Reports",
  heading: "Exterior reports for every side of the job",
};

export type AudienceCard = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
};

export const HOMEOWNER_CARD: AudienceCard = {
  eyebrow: "Q2 Exterior Check",
  title: "For Homeowners",
  description:
    "Know what is happening before calling multiple contractors. Get drone photos, visible condition notes, and a clear next step.",
  ctaLabel: REQUEST_QUOTE_LABEL,
  href: HOMEOWNER_PAGE_PATH,
};

export const REAL_ESTATE_AGENT_CARD: AudienceCard = {
  eyebrow: "Q2 Pre-Listing Exterior Snapshot",
  title: "For Real Estate Agents",
  description:
    "Prepare listings with roof and exterior snapshots that help avoid surprises and support repair decisions.",
  ctaLabel: "Book a Pre-Listing Snapshot",
  href: REAL_ESTATE_AGENT_PAGE_PATH,
};

export const CONTRACTOR_CARD: AudienceCard = {
  eyebrow: "Q2 Lead Qualification Report",
  title: "For Contractors",
  description:
    "Receive better-qualified exterior opportunities with photos, notes, urgency, and homeowner context.",
  ctaLabel: CONTRACTOR_APPLY_LABEL,
  href: CONTRACTOR_APPLICATION_PATH,
};

export const CONTRACTOR_PAGE_COPY = {
  eyebrow: "Q2 Lead Qualification Report",
  heading: "Better-qualified exterior opportunities before the truck roll.",
  description:
    "Q2 documents first-look exterior requests with drone photos, visible condition notes, rough scope context, urgency, and homeowner details before handing qualified opportunities to reviewed contractor partners.",
  trust:
    "Q2 does not sell homeowner information to an open list of contractors. Contractor partners are reviewed before receiving permission-based homeowner opportunities.",
  fitNote:
    "Applications are reviewed for service area, exterior trade fit, communication standards, and available project types. This does not guarantee lead volume, exclusive territory, lead quality, job award, or contractor selection for every homeowner request.",
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
      "Visible exterior conditions are organized into a simple customer report.",
  },
  {
    title: "Review",
    description:
      "The homeowner sees photos, notes, urgency, and a recommended next step.",
  },
  {
    title: "Connect",
    description:
      "With permission, Q2 sends the package to a reviewed contractor partner.",
  },
];

export const REPORT_INCLUDED_SECTION_COPY = {
  eyebrow: "What’s Included",
  heading: `What’s included in ${REPORT_NAME}`,
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
      "A clean summary that can be shared with a reviewed local exterior contractor.",
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
    "A Q2 exterior report is first-look visual documentation of what can be seen from the exterior. It is designed to help homeowners, agents, and contractors understand visible concerns and prepare for the next conversation.",
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
    "Q2 provides exterior reports and contractor handoff support in Georgina, Ontario and the surrounding area. Share your address, photos if available, and a short description so we can confirm fit and next steps.",
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
      "No. A Q2 exterior report documents visible exterior conditions only. It is not a structural engineering report, home inspection, code-compliance review, or warranty.",
  },
  {
    question: "Do I need to climb on the roof?",
    answer:
      "No. Please do not climb ladders or get on the roof. Q2 uses exterior photos and drone views where safe, legal, and appropriate.",
  },
  {
    question: "What happens after I receive the report?",
    answer:
      "You can keep it for homeowner records, monitor visible concerns, request a repair or replacement quote, or ask Q2 to send the package to a reviewed local contractor partner.",
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
  jobTypeLabel: "Reason For Request",
  jobTypePlaceholder: "Select one",
  notesLabel: "Notes",
  notesPlaceholder:
    "Describe what you can see, recent weather, leaks, timing, or anything else helpful.",
  submitLabel: "Submit Exterior Check Request",
};

export const JOB_TYPES = [
  "Visible roof concern",
  "Leak or water entry concern",
  "Storm, wind, hail, or tree-related exterior concern",
  "Eavestrough, fascia, or roof-edge concern",
  "Pre-listing exterior snapshot",
  "Pre-quote documentation",
  "Homeowner records / monitor",
  "Other",
];

export const FOOTER_COPY = {
  phoneLabel: "Phone",
  emailLabel: "Email",
  rightsLabel: "All rights reserved.",
  disclaimer:
    "Q2 provides visual exterior documentation, exterior reports, and contractor referral services. Reports are based on visible exterior conditions only. Contractor quotes, repair work, warranties, and project execution are provided by independent contractor partners unless otherwise stated. Q2 only shares customer information with contractor partners after permission.",
};
