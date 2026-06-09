export const BUSINESS_NAME = "Quick & Qualified Exteriors";
export const TAGLINE = "Exterior inspection, documentation & contractor handoff";
export const SERVICE_AREA = "Georgina, Ontario + surrounding area";
export const PHONE_DISPLAY = "";
export const PHONE_TEL = "";
export const EMAIL = "info@quickandqualified.ca";

export const SECTION_IDS = {
  hero: "hero",
  trust: "trust",
  homeowners: "homeowners",
  contractors: "contractors",
  vetting: "vetting",
  services: "services",
  process: "process",
  serviceArea: "service-area",
  quote: "quote",
  footer: "footer",
} as const;

export const CALL_TO_ACTION_LABEL = "Call / Text";
export const REQUEST_QUOTE_LABEL = "Book an Inspection";
export const CONTRACTOR_APPLICATION_LABEL = "Apply as a Contractor Partner";

export const SITE_METADATA = {
  title: `${BUSINESS_NAME} | ${TAGLINE}`,
  description:
    "Drone roof and eavestrough inspections, photo documentation, measurement-supported reports, and vetted contractor handoff in Georgina, Ontario.",
};

export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Homeowners", href: `#${SECTION_IDS.homeowners}` },
  { label: "How It Works", href: `#${SECTION_IDS.process}` },
  { label: "Contractors", href: `#${SECTION_IDS.contractors}` },
  { label: "Pricing", href: `#${SECTION_IDS.services}` },
  { label: REQUEST_QUOTE_LABEL, href: `#${SECTION_IDS.quote}` },
];

export const HERO_COPY = {
  eyebrow: TAGLINE,
  heading: "Drone roof & eavestrough inspections with trusted contractor handoff",
  description:
    "Q2 helps homeowners document visible exterior issues using photos, drone inspection, and measurement-supported reports - then connects them with vetted local contractors when a quote is needed.",
};

export const TRUST_ITEMS = [
  "Drone roof & eavestrough inspections",
  "Photo documentation and measurement-supported reports",
  "Private contractor partner network - not an open marketplace",
];

export const HOMEOWNER_SECTION_COPY = {
  eyebrow: "For Homeowners",
  heading: "Start with documentation before you start comparing quotes",
  description:
    "Q2 gives homeowners a clearer front-end inspection package before repair or replacement quotes are requested.",
};

export const HOMEOWNER_ITEMS = [
  "Free neighbourhood quick checks may be available when Q2 is already in your area.",
  "Scheduled exterior inspections start at $149.",
  "Inspection includes a visible roof/eavestrough check, photos, issue summary, and contractor-ready documentation.",
  "Repairs, emergency leak service, and contractor quotes are sold separately.",
  "If you move forward with a vetted Q2 contractor partner, the inspection fee may be credited toward the final project invoice.",
  "Select small repairs may be completed directly by Q2 where available. Larger projects are handled by vetted contractor partners.",
];

export const SERVICES_SECTION_COPY = {
  eyebrow: "Services & Pricing",
  heading: "Inspection-first exterior help",
  note: "Repairs and contractor quotes are sold separately.",
};

export type Service = {
  title: string;
  description: string;
};

export const SERVICES: Service[] = [
  {
    title: "Quick Neighbourhood Check",
    description:
      "Free when Q2 is already nearby and a visible ground-level or drone quick check is practical.",
  },
  {
    title: "Scheduled Exterior Inspection",
    description:
      "From $149 for a planned visible roof, eavestrough, soffit/fascia, siding, or leak-area inspection.",
  },
  {
    title: "Drone/Photo Report",
    description:
      "From $149-$249 for photo documentation, issue notes, and measurement-supported contractor-ready details.",
  },
  {
    title: "Emergency Leak Visit",
    description:
      "Quoted separately based on timing, access, weather, and whether a direct Q2 visit or partner handoff is best.",
  },
];

export const PROCESS_SECTION_COPY = {
  eyebrow: "Homeowner Process",
  heading: "How Q2 turns an exterior concern into a contractor-ready package",
};

export type ProcessStep = {
  title: string;
  description: string;
};

export const PROCESS_STEPS: ProcessStep[] = [
  {
    title: "Request or receive a Q2 check",
    description: "Start with the form or a neighbourhood quick check when Q2 is already in your area.",
  },
  {
    title: "Document visible issues",
    description: "Q2 captures photos, drone views where practical, issue notes, and basic exterior details.",
  },
  {
    title: "Review the summary",
    description: "You see the photo-backed issue summary before any contractor quote is requested.",
  },
  {
    title: "Approve a handoff",
    description: "With your permission, Q2 shares the package with a vetted contractor partner.",
  },
  {
    title: "Receive a quote",
    description: "The contractor uses the documentation to prepare a repair or replacement quote.",
  },
  {
    title: "Apply inspection credit",
    description: "Your inspection fee may be credited if the project moves forward with a vetted Q2 partner.",
  },
];

export const CONTRACTOR_SECTION_COPY = {
  eyebrow: "Contractor Partners",
  heading: "Apply to receive qualified exterior opportunities",
  description:
    "Q2 inspects, documents, and qualifies homeowners before sending opportunities to reviewed contractor partners.",
};

export const CONTRACTOR_ITEMS = [
  "Contractors are reviewed before receiving homeowner information.",
  "Q2 is a private partner network, not open access and not an open lead marketplace.",
  "Opportunities may include drone photos, homeowner notes, issue type, address, urgency, and basic measurements.",
  "During the pilot model, contractor partners may pay a referral or qualification fee only when a job closes.",
];

export const VETTING_SECTION_COPY = {
  eyebrow: "Partner Vetting",
  heading: "What Q2 reviews before sharing homeowner information",
};

export const CONTRACTOR_VETTING_ITEMS = [
  "Liability insurance",
  "WSIB status or clearance where applicable",
  "Working at Heights / safety readiness where applicable",
  "Past work photos",
  "References or reputation",
  "Service area",
  "Job types accepted",
  "Warranty and quote process",
  "Agreement to Q2 homeowner communication standards",
];

export const SERVICE_AREA_SECTION_COPY = {
  eyebrow: "Local Coverage",
  description:
    "Q2 currently focuses on exterior inspection and documentation across the local service area before matching homeowners with suitable contractor partners.",
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
    question: "Is Q2 a roofing contractor?",
    answer:
      "Q2 is positioned first as an inspection, documentation, and contractor referral service. Select small repairs may be completed directly by Q2 where available.",
  },
  {
    question: "Is this an open contractor marketplace?",
    answer:
      "No. Q2 uses a private contractor partner network. Contractors must apply and be reviewed before receiving homeowner information.",
  },
  {
    question: "Do I have to request a contractor quote?",
    answer:
      "No. You can start with an inspection and documentation package. Q2 only shares your information with a contractor partner after you give permission.",
  },
  {
    question: "What does the inspection fee cover?",
    answer:
      "Scheduled inspections start at $149 and include visible exterior review, photos, issue notes, and contractor-ready documentation. Repairs and contractor quotes are separate.",
  },
  {
    question: "Can the inspection fee be credited?",
    answer:
      "The inspection fee may be credited toward the final project invoice if you proceed with a vetted Q2 contractor partner.",
  },
];

export const QUOTE_FORM_COPY = {
  heading: REQUEST_QUOTE_LABEL,
  description:
    "Share the property details and what you are seeing. Q2 will confirm whether a free neighbourhood check is available or schedule an inspection starting at $149.",
  nameLabel: "Name",
  namePlaceholder: "Your name",
  phoneLabel: "Phone",
  phonePlaceholder: "Your best contact number",
  emailLabel: "Email",
  emailPlaceholder: "your@email.com",
  addressLabel: "Address",
  addressPlaceholder: "Property address",
  jobTypeLabel: "Issue Type",
  jobTypePlaceholder: "Select one",
  urgencyLabel: "Urgency",
  urgencyPlaceholder: "Select one",
  preferredContactMethodLabel: "Preferred Contact Method",
  preferredContactMethodPlaceholder: "Select one",
  consentLabel:
    "I agree Q2 may contact me about my request. If I request a contractor quote, I authorize Q2 to share my inspection details with a vetted contractor partner.",
  notesLabel: "Notes",
  notesPlaceholder:
    "Describe the visible issue, access notes, timing, and whether you want inspection only or a contractor quote after review.",
  submitLabel: "Send Inspection Request",
};

export const JOB_TYPES = [
  "Roof",
  "Leak",
  "Eavestrough",
  "Soffit/Fascia",
  "Siding",
  "Other",
];

export const URGENCY_OPTIONS = [
  "Emergency",
  "Soon",
  "1-3 months",
  "Planning/research",
];

export const CONTACT_METHOD_OPTIONS = ["Phone", "Text", "Email"];

export const CONTRACTOR_FORM_COPY = {
  heading: CONTRACTOR_APPLICATION_LABEL,
  description:
    "Apply for Q2's private contractor partner network. Homeowner information is shared only after review and homeowner permission.",
  companyNameLabel: "Company Name",
  contactNameLabel: "Contact Name",
  phoneLabel: "Phone",
  emailLabel: "Email",
  websiteLabel: "Website / Social Link",
  serviceAreasLabel: "Service Areas",
  servicesOfferedLabel: "Services Offered",
  minimumJobSizeLabel: "Minimum Job Size",
  insuranceStatusLabel: "Insurance Status",
  wsibStatusLabel: "WSIB Status",
  safetyStatusLabel: "Working at Heights / Safety Status",
  preferredLeadTypesLabel: "Preferred Lead Types",
  referralFeeOpenLabel: "Open to referral/qualification fee on closed jobs?",
  notesLabel: "Notes",
  submitLabel: "Submit Contractor Application",
};

export const INSURANCE_STATUS_OPTIONS = [
  "Active liability insurance",
  "Pending / can provide proof",
  "Not currently insured",
];

export const WSIB_STATUS_OPTIONS = [
  "Active / clearance available",
  "Not applicable",
  "Pending / unsure",
];

export const SAFETY_STATUS_OPTIONS = [
  "Working at Heights / safety ready",
  "Partial / updating",
  "Not currently available",
];

export const REFERRAL_FEE_OPTIONS = ["Yes", "Depends on job type", "No"];

export const FOOTER_COPY = {
  phoneLabel: "Phone",
  rightsLabel: "All rights reserved.",
  disclaimer:
    "Q2 provides inspection, documentation, and contractor referral services. Contractor quotes, repair work, warranties, and project execution are provided by independent contractor partners unless otherwise stated.",
  privacy:
    "Q2 only shares homeowner information with contractor partners after homeowner permission.",
};
