"use client";

import { useState, type FormEvent } from "react";
import { AddressAutocompleteField } from "@/components/AddressAutocompleteField";
import { EMAIL, JOB_TYPES, PHONE_TEL, QUOTE_FORM_COPY } from "@/lib/business";
import { primaryButtonClass } from "@/lib/ui";

type SubmitStatus = "idle" | "success" | "error";

type QuoteFormProps = {
  source?: string;
  intent?: string;
  heading?: string;
  description?: string;
  jobTypeLabel?: string;
  jobTypePlaceholder?: string;
  jobTypes?: string[];
  defaultJobType?: string;
  submitLabel?: string;
  successMessage?: string;
};

const fieldClassName =
  "mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-[border-color,box-shadow] focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200";
const fileFieldClassName =
  "mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 transition-[border-color,box-shadow] file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-800 file:transition-colors hover:file:bg-zinc-200 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200";

export function QuoteForm({
  source = "q2_homepage_quote_form",
  intent = "q2_exterior_report_request",
  heading = QUOTE_FORM_COPY.heading,
  description = QUOTE_FORM_COPY.description,
  jobTypeLabel = QUOTE_FORM_COPY.jobTypeLabel,
  jobTypePlaceholder = QUOTE_FORM_COPY.jobTypePlaceholder,
  jobTypes = JOB_TYPES,
  defaultJobType = "",
  submitLabel = QUOTE_FORM_COPY.submitLabel,
  successMessage = "Thanks — we received your Q2 exterior report request. We’ll reply within 24 hours.",
}: QuoteFormProps) {
  const hasPhone = Boolean(PHONE_TEL);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Lead submission failed");
      }

      setSubmitStatus("success");
      form.reset();
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      <input name="source" type="hidden" defaultValue={source} />
      <input name="intent" type="hidden" defaultValue={intent} />
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">{heading}</h2>
      <p className="mt-2 text-sm text-zinc-600">{description}</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="name">
            {QUOTE_FORM_COPY.nameLabel}
          </label>
          <input
            required
            className={fieldClassName}
            id="name"
            name="name"
            placeholder={QUOTE_FORM_COPY.namePlaceholder}
            type="text"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="phone">
            {QUOTE_FORM_COPY.phoneLabel}
          </label>
          <input
            required
            className={fieldClassName}
            id="phone"
            name="phone"
            placeholder={QUOTE_FORM_COPY.phonePlaceholder}
            type="tel"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="email">
            {QUOTE_FORM_COPY.emailLabel}
          </label>
          <input
            required
            className={fieldClassName}
            id="email"
            name="email"
            placeholder={QUOTE_FORM_COPY.emailPlaceholder}
            type="email"
          />
        </div>
        <AddressAutocompleteField className={fieldClassName} />
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-zinc-800" htmlFor="jobType">
            {jobTypeLabel}
          </label>
          <select required className={fieldClassName} defaultValue={defaultJobType} id="jobType" name="jobType">
            <option disabled value="">
              {jobTypePlaceholder}
            </option>
            {jobTypes.map((jobType) => (
              <option key={jobType} value={jobType}>
                {jobType}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-zinc-800" htmlFor="files">
            Photos (optional)
          </label>
          <p className="mt-1 text-sm text-zinc-600">
            Photos help Q2 understand the visible concern before scheduling your report. Add 3–6 photos if you can.
          </p>
          <input
            accept="image/*"
            className={fileFieldClassName}
            id="files"
            multiple
            name="files"
            type="file"
          />
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
            <li>Wide shot of the home or affected area</li>
            <li>Zoomed-in photo of the issue (taken safely from the ground)</li>
            <li>View of the roofline or eavestrough from ground level</li>
            <li>Downspout or drainage area (if relevant)</li>
          </ul>
          <p className="mt-2 text-sm text-zinc-600">Please do not climb on the roof. Ground-level photos are perfect.</p>
          <p className="mt-2 text-sm text-zinc-600">
            If photos aren’t available, Q2 can still follow up about the best next step.
          </p>
          {hasPhone ? (
            <p className="mt-3 text-sm text-zinc-600">
              If attaching photos doesn&apos;t work, just{" "}
              <a className="text-blue-900 underline-offset-2 hover:underline" href={`tel:${PHONE_TEL}`}>
                text
              </a>{" "}
              or{" "}
              <a className="text-blue-900 underline-offset-2 hover:underline" href={`mailto:${EMAIL}`}>
                email
              </a>{" "}
              them after submitting.
            </p>
          ) : (
            <p className="mt-3 text-sm text-zinc-600">
              If attaching photos doesn&apos;t work, just{" "}
              <a className="text-blue-900 underline-offset-2 hover:underline" href={`mailto:${EMAIL}`}>
                email
              </a>{" "}
              them after submitting.
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-zinc-800" htmlFor="notes">
            {QUOTE_FORM_COPY.notesLabel}
          </label>
          <textarea
            className={fieldClassName}
            id="notes"
            name="notes"
            placeholder={QUOTE_FORM_COPY.notesPlaceholder}
            rows={5}
          />
        </div>
      </div>
      <button
        className={`${primaryButtonClass} mt-6 inline-flex disabled:cursor-not-allowed disabled:opacity-70`}
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Submitting..." : submitLabel}
      </button>

      {submitStatus === "success" ? (
        <p className="mt-4 text-sm text-zinc-700" role="status">
          {successMessage}
        </p>
      ) : null}

      {submitStatus === "error" ? (
        <p className="mt-4 text-sm text-zinc-700" role="alert">
          Something went wrong — please email{" "}
          <a className="text-blue-900 underline-offset-2 hover:underline" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}
