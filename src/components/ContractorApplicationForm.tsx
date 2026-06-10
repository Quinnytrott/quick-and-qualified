"use client";

import { useState, type FormEvent } from "react";
import {
  CONTRACTOR_APPLICATION_COPY,
  EMAIL,
  INSURANCE_STATUS_OPTIONS,
} from "@/lib/business";
import { primaryButtonClass } from "@/lib/ui";

type SubmitStatus = "idle" | "success" | "error";

const fieldClassName =
  "mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-[border-color,box-shadow] focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200";

function readFormString(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

export function ContractorApplicationForm() {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contractor-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: readFormString(formData, "companyName"),
          contactName: readFormString(formData, "contactName"),
          email: readFormString(formData, "email"),
          phone: readFormString(formData, "phone"),
          serviceArea: readFormString(formData, "serviceArea"),
          servicesOffered: readFormString(formData, "servicesOffered"),
          insuranceStatus: readFormString(formData, "insuranceStatus"),
          yearsInBusiness: readFormString(formData, "yearsInBusiness"),
          preferredJobTypes: readFormString(formData, "preferredJobTypes"),
          notes: readFormString(formData, "notes"),
        }),
      });

      if (!response.ok) {
        throw new Error("Contractor application failed");
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
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
        {CONTRACTOR_APPLICATION_COPY.heading}
      </h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        {CONTRACTOR_APPLICATION_COPY.description}
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="companyName">
            {CONTRACTOR_APPLICATION_COPY.companyNameLabel}
          </label>
          <input
            required
            className={fieldClassName}
            id="companyName"
            name="companyName"
            placeholder={CONTRACTOR_APPLICATION_COPY.companyNamePlaceholder}
            type="text"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="contactName">
            {CONTRACTOR_APPLICATION_COPY.contactNameLabel}
          </label>
          <input
            required
            className={fieldClassName}
            id="contactName"
            name="contactName"
            placeholder={CONTRACTOR_APPLICATION_COPY.contactNamePlaceholder}
            type="text"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="contractorEmail">
            {CONTRACTOR_APPLICATION_COPY.emailLabel}
          </label>
          <input
            required
            className={fieldClassName}
            id="contractorEmail"
            name="email"
            placeholder={CONTRACTOR_APPLICATION_COPY.emailPlaceholder}
            type="email"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="contractorPhone">
            {CONTRACTOR_APPLICATION_COPY.phoneLabel}
          </label>
          <input
            required
            className={fieldClassName}
            id="contractorPhone"
            name="phone"
            placeholder={CONTRACTOR_APPLICATION_COPY.phonePlaceholder}
            type="tel"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-zinc-800" htmlFor="serviceArea">
            {CONTRACTOR_APPLICATION_COPY.serviceAreaLabel}
          </label>
          <input
            required
            className={fieldClassName}
            id="serviceArea"
            name="serviceArea"
            placeholder={CONTRACTOR_APPLICATION_COPY.serviceAreaPlaceholder}
            type="text"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-zinc-800" htmlFor="servicesOffered">
            {CONTRACTOR_APPLICATION_COPY.servicesOfferedLabel}
          </label>
          <textarea
            required
            className={fieldClassName}
            id="servicesOffered"
            name="servicesOffered"
            placeholder={CONTRACTOR_APPLICATION_COPY.servicesOfferedPlaceholder}
            rows={3}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="insuranceStatus">
            {CONTRACTOR_APPLICATION_COPY.insuranceStatusLabel}
          </label>
          <select
            required
            className={fieldClassName}
            defaultValue=""
            id="insuranceStatus"
            name="insuranceStatus"
          >
            <option disabled value="">
              {CONTRACTOR_APPLICATION_COPY.insuranceStatusPlaceholder}
            </option>
            {INSURANCE_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="yearsInBusiness">
            {CONTRACTOR_APPLICATION_COPY.yearsInBusinessLabel}
          </label>
          <input
            required
            className={fieldClassName}
            id="yearsInBusiness"
            min="0"
            name="yearsInBusiness"
            placeholder={CONTRACTOR_APPLICATION_COPY.yearsInBusinessPlaceholder}
            step="1"
            type="number"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-zinc-800" htmlFor="preferredJobTypes">
            {CONTRACTOR_APPLICATION_COPY.preferredJobTypesLabel}
          </label>
          <textarea
            required
            className={fieldClassName}
            id="preferredJobTypes"
            name="preferredJobTypes"
            placeholder={CONTRACTOR_APPLICATION_COPY.preferredJobTypesPlaceholder}
            rows={3}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-zinc-800" htmlFor="contractorNotes">
            {CONTRACTOR_APPLICATION_COPY.notesLabel}
          </label>
          <textarea
            className={fieldClassName}
            id="contractorNotes"
            name="notes"
            placeholder={CONTRACTOR_APPLICATION_COPY.notesPlaceholder}
            rows={4}
          />
        </div>
      </div>
      <button
        className={`${primaryButtonClass} mt-6 inline-flex disabled:cursor-not-allowed disabled:opacity-70`}
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Submitting..." : CONTRACTOR_APPLICATION_COPY.submitLabel}
      </button>

      {submitStatus === "success" ? (
        <p className="mt-4 text-sm leading-6 text-zinc-700" role="status">
          {CONTRACTOR_APPLICATION_COPY.successMessage}
        </p>
      ) : null}

      {submitStatus === "error" ? (
        <p className="mt-4 text-sm leading-6 text-zinc-700" role="alert">
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
