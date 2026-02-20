export const BUSINESS_NAME = "Quick & Qualified Exteriors";
export const TAGLINE = "Roofing • Eavestrough • Repairs";
export const SERVICE_AREA = "Georgina, Ontario + surrounding area";
export const PHONE_DISPLAY = "";
export const PHONE_TEL = "";
export const EMAIL = "quinnytrott@gmail.com";

export const SECTION_IDS = {
  hero: "hero",
  trust: "trust",
  services: "services",
  process: "process",
  serviceArea: "service-area",
  quote: "quote",
  footer: "footer",
} as const;

export const CALL_TO_ACTION_LABEL = "Call / Text";
export const REQUEST_QUOTE_LABEL = "Request Quote";

export const SITE_METADATA = {
  title: `${BUSINESS_NAME} | ${TAGLINE}`,
  description:
    "Roof repairs, small roof replacements, eavestrough replacement, and exterior trim repairs in Georgina, Ontario.",
};

export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Services", href: `#${SECTION_IDS.services}` },
  { label: "Process", href: `#${SECTION_IDS.process}` },
  { label: REQUEST_QUOTE_LABEL, href: `#${SECTION_IDS.quote}` },
];

export const HERO_COPY = {
  eyebrow: TAGLINE,
  heading: "Quick exterior fixes. Qualified workmanship.",
  description: `Roof repairs • small roofs • eavestrough • soffit/fascia • leak diagnostics — serving ${SERVICE_AREA}.`,
};

export const TRUST_ITEMS = [
  "Clear communication from first message to completion",
  "Fast quoting when photos and address are provided",
  `Local service across ${SERVICE_AREA}`,
];

export const SERVICES_SECTION_COPY = {
  eyebrow: "Services",
  heading: `What ${BUSINESS_NAME} handles best`,
  bestFitTitle: "Best Fit Jobs",
  notFitTitle: "Not A Fit",
};

export type Service = {
  title: string;
  description: string;
};

export const SERVICES: Service[] = [
  {
    title: "Roof Repairs",
    description:
      "Targeted roof repairs to stop leaks and protect your home without overselling full replacements.",
  },
  {
    title: "Small Roof Replacements",
    description:
      "Ideal for garages, sheds, and smaller roof sections that need quality workmanship done efficiently.",
  },
  {
    title: "Eavestrough Replacement & Repairs",
    description:
      "Repairing or replacing eavestrough systems to improve drainage and reduce water-related damage.",
  },
  {
    title: "Soffit / Fascia Repairs",
    description:
      "Clean, durable soffit and fascia repairs that restore airflow, function, and curb appeal.",
  },
  {
    title: "Leak Diagnostics & Prevention",
    description:
      "Photo-guided diagnostics and practical prevention to resolve the root cause before it gets worse.",
  },
];

export const BEST_FIT_JOBS = [
  "Roof leak and shingle repair calls",
  "Garages, sheds, and small roof sections",
  "Eavestrough and exterior trim repairs",
];

export const NOT_A_FIT_JOBS = [
  "Commercial projects",
  "Multi-crew production jobs",
  "Low-margin bidding projects",
];

export const PROCESS_SECTION_COPY = {
  eyebrow: "Process",
  heading: "Simple and fast from first message to finished work",
};

export type ProcessStep = {
  title: string;
  description: string;
};

export const PROCESS_STEPS: ProcessStep[] = [
  {
    title: "Send photos",
    description: "Text or email photos plus your address so we can quickly understand the issue.",
  },
  {
    title: "Get a clear quote",
    description: "Receive a straightforward quote with scope, pricing, and expected timeline.",
  },
  {
    title: "Schedule fast",
    description: "Pick the soonest practical slot that works for your timeline and weather.",
  },
  {
    title: "Done right",
    description: "Work is completed with qualified workmanship and a clean finish.",
  },
];

export const SERVICE_AREA_SECTION_COPY = {
  eyebrow: "Service Area",
  description:
    "Need help nearby? Share photos, address, and a quick description so we can confirm fit and quote speed.",
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
    question: "Do you do full re-roofs?",
    answer: "Yes, smaller roofs and garages are the best fit.",
  },
  {
    question: "Do you handle full roof replacements or larger projects?",
    answer:
      "For larger scopes or multi-crew projects, we coordinate with trusted partners to ensure quality execution and oversight from estimate through completion.",
  },
  {
    question: "Do you do commercial?",
    answer: "Not at this time.",
  },
  {
    question: "Do you work with insurance?",
    answer: "Limited, case-by-case.",
  },
  {
    question: "How fast can you quote?",
    answer: "Often same day or next day if photos and address are provided.",
  },
];

export const QUOTE_FORM_COPY = {
  heading: REQUEST_QUOTE_LABEL,
  description: "Share a few details and we will follow up quickly.",
  nameLabel: "Name",
  namePlaceholder: "Your name",
  phoneLabel: "Phone",
  phonePlaceholder: "Your best contact number",
  emailLabel: "Email",
  emailPlaceholder: EMAIL,
  addressLabel: "Address",
  addressPlaceholder: "Service address",
  jobTypeLabel: "Job Type",
  jobTypePlaceholder: "Select one",
  notesLabel: "Notes",
  notesPlaceholder: "Describe the issue, timeline, and anything else helpful.",
  submitLabel: "Submit",
};

export const JOB_TYPES = [
  "Roof Repairs",
  "Small Roof Replacements",
  "Eavestrough Replacement & Repairs",
  "Soffit / Fascia Repairs",
  "Leak Diagnostics & Prevention",
  "Other",
];

export const FOOTER_COPY = {
  phoneLabel: "Phone",
  rightsLabel: "All rights reserved.",
};
