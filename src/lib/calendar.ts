function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function formatUtcTimestamp(value: Date): string {
  const year = value.getUTCFullYear();
  const month = `${value.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${value.getUTCDate()}`.padStart(2, "0");
  const hours = `${value.getUTCHours()}`.padStart(2, "0");
  const minutes = `${value.getUTCMinutes()}`.padStart(2, "0");
  const seconds = `${value.getUTCSeconds()}`.padStart(2, "0");

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

function foldIcsLine(value: string): string {
  if (value.length <= 75) {
    return value;
  }

  const chunks = [value.slice(0, 75)];

  for (let index = 75; index < value.length; index += 74) {
    chunks.push(` ${value.slice(index, index + 74)}`);
  }

  return chunks.join("\r\n");
}

export type SiteVisitCalendarParams = {
  leadId: string;
  customerName: string;
  address: string;
  phone: string;
  email: string;
  jobType: string;
  notes: string;
  viewerUrl: string;
  startAt: Date;
  durationMinutes: number;
  visitNotes?: string;
};

export function buildSiteVisitCalendarEvent(params: SiteVisitCalendarParams): string {
  const {
    leadId,
    customerName,
    address,
    phone,
    email,
    jobType,
    notes,
    viewerUrl,
    startAt,
    durationMinutes,
    visitNotes,
  } = params;

  const endAt = new Date(startAt.getTime() + durationMinutes * 60 * 1000);
  const description = [
    `Phone: ${phone || "—"}`,
    `Email: ${email || "—"}`,
    `Job Type: ${jobType || "—"}`,
    `Lead Notes: ${notes || "—"}`,
    `Lead Reference: ${leadId}`,
    `Lead Viewer: ${viewerUrl}`,
    `Visit Notes: ${visitNotes?.trim() || "—"}`,
  ].join("\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Quick & Qualified Exteriors//Lead Visit//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:q2-site-visit-${leadId}-${startAt.getTime()}@quickandqualified.ca`,
    `DTSTAMP:${formatUtcTimestamp(new Date())}`,
    `DTSTART:${formatUtcTimestamp(startAt)}`,
    `DTEND:${formatUtcTimestamp(endAt)}`,
    `SUMMARY:${escapeIcsText(`Q2 Site Visit — ${customerName || "Customer"}`)}`,
    `LOCATION:${escapeIcsText(address || "Address unavailable")}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
}

export function buildSiteVisitCalendarFilename(customerName: string): string {
  const safeCustomerName = (customerName || "customer")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${safeCustomerName || "customer"}-site-visit.ics`;
}
