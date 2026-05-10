"use client";

import { useState, type FormEvent } from "react";
import {
  buildSiteVisitCalendarEvent,
  buildSiteVisitCalendarFilename,
} from "@/lib/calendar";
import { primaryButtonClass, secondaryButtonClass } from "@/lib/ui";

type LeadActionsProps = {
  leadId: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  jobType: string;
  notes: string;
  viewerUrl: string;
  viewerToken: string;
  initialConversionStatus: string;
  initialMeasureAgentProjectId: string;
  initialMeasureAgentProjectUrl: string;
};

function toTelHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function toMailtoHref(email: string): string {
  const params = new URLSearchParams({
    subject: "Quick & Qualified quote request",
  });

  return `mailto:${email}?${params.toString()}`;
}

export function LeadActions(props: LeadActionsProps) {
  const {
    leadId,
    customerName,
    phone,
    email,
    address,
    jobType,
    notes,
    viewerUrl,
    viewerToken,
    initialConversionStatus,
    initialMeasureAgentProjectId,
    initialMeasureAgentProjectUrl,
  } = props;
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [visitNotes, setVisitNotes] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [conversionStatus, setConversionStatus] = useState(initialConversionStatus);
  const [measureAgentProjectId, setMeasureAgentProjectId] = useState(initialMeasureAgentProjectId);
  const [measureAgentProjectUrl, setMeasureAgentProjectUrl] = useState(initialMeasureAgentProjectUrl);

  const canCall = Boolean(phone.trim());
  const canEmail = Boolean(email.trim());
  const hasMeasureAgentProject = Boolean(measureAgentProjectId || measureAgentProjectUrl);

  const handleConvertToMeasureAgent = async () => {
    setStatusMessage("");
    setIsConverting(true);

    try {
      const response = await fetch(`/api/lead/${leadId}/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: viewerToken }),
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            success?: boolean;
            message?: string;
            projectId?: string;
            projectUrl?: string;
            conversionStatus?: string;
          }
        | null;

      if (!response.ok || !payload?.success || !payload.projectId || !payload.projectUrl) {
        throw new Error(payload?.message || "Could not convert the lead to MeasureAgent.");
      }

      setMeasureAgentProjectId(payload.projectId);
      setMeasureAgentProjectUrl(payload.projectUrl);
      setConversionStatus(payload.conversionStatus || "converted");
      setStatusMessage("Converted to MeasureAgent.");
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Could not convert the lead to MeasureAgent.",
      );
    } finally {
      setIsConverting(false);
    }
  };

  const handleScheduleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");

    const parsedDuration = Number.parseInt(durationMinutes, 10);
    const startAt = new Date(`${scheduleDate}T${scheduleTime}`);

    if (!scheduleDate || !scheduleTime || Number.isNaN(startAt.getTime())) {
      setStatusMessage("Enter a valid visit date and time.");
      return;
    }

    if (!Number.isFinite(parsedDuration) || parsedDuration <= 0) {
      setStatusMessage("Enter a valid visit duration.");
      return;
    }

    const ics = buildSiteVisitCalendarEvent({
      leadId,
      customerName,
      address,
      phone,
      email,
      jobType,
      notes,
      viewerUrl,
      startAt,
      durationMinutes: parsedDuration,
      visitNotes,
    });

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = objectUrl;
    anchor.download = buildSiteVisitCalendarFilename(customerName);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);

    setStatusMessage("Calendar file downloaded.");
    setIsScheduleOpen(false);
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap gap-3">
        {canCall ? (
          <a className={secondaryButtonClass} href={toTelHref(phone)}>
            Call
          </a>
        ) : null}
        {canEmail ? (
          <a className={secondaryButtonClass} href={toMailtoHref(email)}>
            Email
          </a>
        ) : null}
        <button
          className={primaryButtonClass}
          onClick={() => {
            setStatusMessage("");
            setIsScheduleOpen((current) => !current);
          }}
          type="button"
        >
          Schedule Visit
        </button>
        {hasMeasureAgentProject ? (
          <a
            className={secondaryButtonClass}
            href={measureAgentProjectUrl}
            rel="noreferrer"
            target="_blank"
          >
            Open MeasureAgent Project
          </a>
        ) : (
          <button
            className={secondaryButtonClass}
            disabled={isConverting}
            onClick={handleConvertToMeasureAgent}
            type="button"
          >
            {isConverting ? "Converting..." : "Convert to MeasureAgent Project"}
          </button>
        )}
      </div>

      {isScheduleOpen ? (
        <form
          className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5"
          onSubmit={handleScheduleSubmit}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-zinc-700">
              <span className="font-medium text-zinc-900">Date</span>
              <input
                required
                className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                onChange={(event) => setScheduleDate(event.target.value)}
                type="date"
                value={scheduleDate}
              />
            </label>
            <label className="text-sm text-zinc-700">
              <span className="font-medium text-zinc-900">Time</span>
              <input
                required
                className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                onChange={(event) => setScheduleTime(event.target.value)}
                type="time"
                value={scheduleTime}
              />
            </label>
            <label className="text-sm text-zinc-700">
              <span className="font-medium text-zinc-900">Duration (minutes)</span>
              <input
                min="15"
                required
                className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                onChange={(event) => setDurationMinutes(event.target.value)}
                step="15"
                type="number"
                value={durationMinutes}
              />
            </label>
            <label className="text-sm text-zinc-700 sm:col-span-2">
              <span className="font-medium text-zinc-900">Visit Notes</span>
              <textarea
                className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                onChange={(event) => setVisitNotes(event.target.value)}
                placeholder="Access notes, parking details, or anything to remember."
                rows={4}
                value={visitNotes}
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button className={primaryButtonClass} type="submit">
              Download .ics
            </button>
            <button
              className={secondaryButtonClass}
              onClick={() => {
                setIsScheduleOpen(false);
                setStatusMessage("");
              }}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {conversionStatus === "converted" ? (
        <p className="text-sm text-zinc-600">
          Converted to MeasureAgent{measureAgentProjectId ? ` · ${measureAgentProjectId}` : ""}.
        </p>
      ) : null}
      {statusMessage ? <p className="text-sm text-zinc-600">{statusMessage}</p> : null}
    </div>
  );
}
