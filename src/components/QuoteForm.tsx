"use client";

import { useState, type FormEvent } from "react";
import {
  CONTACT_METHOD_OPTIONS,
  CONTRACTOR_FORM_COPY,
  EMAIL,
  INSURANCE_STATUS_OPTIONS,
  JOB_TYPES,
  PHONE_TEL,
  QUOTE_FORM_COPY,
  REFERRAL_FEE_OPTIONS,
  SAFETY_STATUS_OPTIONS,
  URGENCY_OPTIONS,
  WSIB_STATUS_OPTIONS,
} from "@/lib/business";
import { primaryButtonClass } from "@/lib/ui";

type SubmitStatus = "idle" | "success" | "error";

const fieldClassName =
  "mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-[border-color,box-shadow] focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200";
const fileFieldClassName =
  "mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 transition-[border-color,box-shadow] file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-800 file:transition-colors hover:file:bg-zinc-200 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200";
const formClassName = "rounded-xl border border-zinc-200 bg-white p-6 sm:p-8";

export function QuoteForm() {
  const hasPhone = Boolean(PHONE_TEL);
  const [homeownerStatus, setHomeownerStatus] = useState<SubmitStatus>("idle");
  const [contractorStatus, setContractorStatus] = useState<SubmitStatus>("idle");
  const [isHomeownerSubmitting, setIsHomeownerSubmitting] = useState(false);
  const [isContractorSubmitting, setIsContractorSubmitting] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    setSubmitStatus: (status: SubmitStatus) => void,
    setIsSubmitting: (isSubmitting: boolean) => void,
  ) => {
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
        throw new Error("Submission failed");
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
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-zinc-600">Start Here</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
          Request an inspection or apply as a partner
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          className={formClassName}
          encType="multipart/form-data"
          onSubmit={(event) => handleSubmit(event, setHomeownerStatus, setIsHomeownerSubmitting)}
        >
          <input name="requestType" type="hidden" value="homeownerInspection" />
          <h3 className="text-2xl font-semibold tracking-tight text-zinc-900">{QUOTE_FORM_COPY.heading}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{QUOTE_FORM_COPY.description}</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-zinc-800" htmlFor="homeowner-name">
                {QUOTE_FORM_COPY.nameLabel}
              </label>
              <input
                required
                className={fieldClassName}
                id="homeowner-name"
                name="name"
                placeholder={QUOTE_FORM_COPY.namePlaceholder}
                type="text"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-800" htmlFor="homeowner-phone">
                {QUOTE_FORM_COPY.phoneLabel}
              </label>
              <input
                required
                className={fieldClassName}
                id="homeowner-phone"
                name="phone"
                placeholder={QUOTE_FORM_COPY.phonePlaceholder}
                type="tel"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-800" htmlFor="homeowner-email">
                {QUOTE_FORM_COPY.emailLabel}
              </label>
              <input
                required
                className={fieldClassName}
                id="homeowner-email"
                name="email"
                placeholder={QUOTE_FORM_COPY.emailPlaceholder}
                type="email"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-800" htmlFor="homeowner-address">
                {QUOTE_FORM_COPY.addressLabel}
              </label>
              <input
                required
                className={fieldClassName}
                id="homeowner-address"
                name="address"
                placeholder={QUOTE_FORM_COPY.addressPlaceholder}
                type="text"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-800" htmlFor="jobType">
                {QUOTE_FORM_COPY.jobTypeLabel}
              </label>
              <select required className={fieldClassName} defaultValue="" id="jobType" name="jobType">
                <option disabled value="">
                  {QUOTE_FORM_COPY.jobTypePlaceholder}
                </option>
                {JOB_TYPES.map((jobType) => (
                  <option key={jobType} value={jobType}>
                    {jobType}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-800" htmlFor="urgency">
                {QUOTE_FORM_COPY.urgencyLabel}
              </label>
              <select required className={fieldClassName} defaultValue="" id="urgency" name="urgency">
                <option disabled value="">
                  {QUOTE_FORM_COPY.urgencyPlaceholder}
                </option>
                {URGENCY_OPTIONS.map((urgency) => (
                  <option key={urgency} value={urgency}>
                    {urgency}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-zinc-800" htmlFor="preferredContactMethod">
                {QUOTE_FORM_COPY.preferredContactMethodLabel}
              </label>
              <select
                required
                className={fieldClassName}
                defaultValue=""
                id="preferredContactMethod"
                name="preferredContactMethod"
              >
                <option disabled value="">
                  {QUOTE_FORM_COPY.preferredContactMethodPlaceholder}
                </option>
                {CONTACT_METHOD_OPTIONS.map((contactMethod) => (
                  <option key={contactMethod} value={contactMethod}>
                    {contactMethod}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-zinc-800" htmlFor="files">
                Photos (optional)
              </label>
              <p className="mt-1 text-sm text-zinc-600">
                Photos help Q2 prepare the inspection package. Add 3-6 photos if you can.
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
                <li>Zoomed-in photo of the issue, taken safely from the ground</li>
                <li>View of the roofline or eavestrough from ground level</li>
                <li>Downspout or drainage area, if relevant</li>
              </ul>
              <p className="mt-2 text-sm text-zinc-600">
                Please do not climb on the roof. Ground-level photos are perfect.
              </p>
              {hasPhone ? (
                <p className="mt-3 text-sm text-zinc-600">
                  If attaching photos does not work, text or{" "}
                  <a className="text-blue-900 underline-offset-2 hover:underline" href={`mailto:${EMAIL}`}>
                    email
                  </a>{" "}
                  them after submitting.
                </p>
              ) : (
                <p className="mt-3 text-sm text-zinc-600">
                  If attaching photos does not work,{" "}
                  <a className="text-blue-900 underline-offset-2 hover:underline" href={`mailto:${EMAIL}`}>
                    email
                  </a>{" "}
                  them after submitting.
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-zinc-800" htmlFor="homeowner-notes">
                {QUOTE_FORM_COPY.notesLabel}
              </label>
              <textarea
                className={fieldClassName}
                id="homeowner-notes"
                name="notes"
                placeholder={QUOTE_FORM_COPY.notesPlaceholder}
                rows={5}
              />
            </div>
            <label className="flex gap-3 text-sm leading-6 text-zinc-700 sm:col-span-2" htmlFor="consentToShare">
              <input
                required
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-900 focus:ring-blue-200"
                id="consentToShare"
                name="consentToShare"
                type="checkbox"
                value="yes"
              />
              <span>{QUOTE_FORM_COPY.consentLabel}</span>
            </label>
          </div>
          <button
            className={`${primaryButtonClass} mt-6 inline-flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-70`}
            disabled={isHomeownerSubmitting}
            type="submit"
          >
            {isHomeownerSubmitting ? "Submitting..." : QUOTE_FORM_COPY.submitLabel}
          </button>

          {homeownerStatus === "success" ? (
            <p className="mt-4 text-sm text-zinc-700" role="status">
              Thanks - we received your inspection request. Q2 will follow up shortly.
            </p>
          ) : null}

          {homeownerStatus === "error" ? (
            <p className="mt-4 text-sm text-zinc-700" role="alert">
              Something went wrong - please email{" "}
              <a className="text-blue-900 underline-offset-2 hover:underline" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
              .
            </p>
          ) : null}
        </form>

        <form
          className={formClassName}
          onSubmit={(event) => handleSubmit(event, setContractorStatus, setIsContractorSubmitting)}
        >
          <input name="requestType" type="hidden" value="contractorApplication" />
          <h3 className="text-2xl font-semibold tracking-tight text-zinc-900">{CONTRACTOR_FORM_COPY.heading}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{CONTRACTOR_FORM_COPY.description}</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-zinc-800" htmlFor="companyName">
                {CONTRACTOR_FORM_COPY.companyNameLabel}
              </label>
              <input required className={fieldClassName} id="companyName" name="companyName" type="text" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-800" htmlFor="contactName">
                {CONTRACTOR_FORM_COPY.contactNameLabel}
              </label>
              <input required className={fieldClassName} id="contactName" name="contactName" type="text" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-800" htmlFor="contractorPhone">
                {CONTRACTOR_FORM_COPY.phoneLabel}
              </label>
              <input required className={fieldClassName} id="contractorPhone" name="phone" type="tel" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-800" htmlFor="contractorEmail">
                {CONTRACTOR_FORM_COPY.emailLabel}
              </label>
              <input required className={fieldClassName} id="contractorEmail" name="email" type="email" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-zinc-800" htmlFor="website">
                {CONTRACTOR_FORM_COPY.websiteLabel}
              </label>
              <input className={fieldClassName} id="website" name="website" type="text" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-zinc-800" htmlFor="serviceAreas">
                {CONTRACTOR_FORM_COPY.serviceAreasLabel}
              </label>
              <textarea required className={fieldClassName} id="serviceAreas" name="serviceAreas" rows={3} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-zinc-800" htmlFor="servicesOffered">
                {CONTRACTOR_FORM_COPY.servicesOfferedLabel}
              </label>
              <textarea required className={fieldClassName} id="servicesOffered" name="servicesOffered" rows={3} />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-800" htmlFor="minimumJobSize">
                {CONTRACTOR_FORM_COPY.minimumJobSizeLabel}
              </label>
              <input className={fieldClassName} id="minimumJobSize" name="minimumJobSize" type="text" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-800" htmlFor="insuranceStatus">
                {CONTRACTOR_FORM_COPY.insuranceStatusLabel}
              </label>
              <select required className={fieldClassName} defaultValue="" id="insuranceStatus" name="insuranceStatus">
                <option disabled value="">
                  Select one
                </option>
                {INSURANCE_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-800" htmlFor="wsibStatus">
                {CONTRACTOR_FORM_COPY.wsibStatusLabel}
              </label>
              <select required className={fieldClassName} defaultValue="" id="wsibStatus" name="wsibStatus">
                <option disabled value="">
                  Select one
                </option>
                {WSIB_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-800" htmlFor="safetyStatus">
                {CONTRACTOR_FORM_COPY.safetyStatusLabel}
              </label>
              <select required className={fieldClassName} defaultValue="" id="safetyStatus" name="safetyStatus">
                <option disabled value="">
                  Select one
                </option>
                {SAFETY_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-zinc-800" htmlFor="preferredLeadTypes">
                {CONTRACTOR_FORM_COPY.preferredLeadTypesLabel}
              </label>
              <textarea className={fieldClassName} id="preferredLeadTypes" name="preferredLeadTypes" rows={3} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-zinc-800" htmlFor="referralFeeOpen">
                {CONTRACTOR_FORM_COPY.referralFeeOpenLabel}
              </label>
              <select required className={fieldClassName} defaultValue="" id="referralFeeOpen" name="referralFeeOpen">
                <option disabled value="">
                  Select one
                </option>
                {REFERRAL_FEE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-zinc-800" htmlFor="contractorNotes">
                {CONTRACTOR_FORM_COPY.notesLabel}
              </label>
              <textarea className={fieldClassName} id="contractorNotes" name="notes" rows={5} />
            </div>
          </div>
          <button
            className={`${primaryButtonClass} mt-6 inline-flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-70`}
            disabled={isContractorSubmitting}
            type="submit"
          >
            {isContractorSubmitting ? "Submitting..." : CONTRACTOR_FORM_COPY.submitLabel}
          </button>

          {contractorStatus === "success" ? (
            <p className="mt-4 text-sm text-zinc-700" role="status">
              Thanks - Q2 received your contractor partner application.
            </p>
          ) : null}

          {contractorStatus === "error" ? (
            <p className="mt-4 text-sm text-zinc-700" role="alert">
              Something went wrong - please email{" "}
              <a className="text-blue-900 underline-offset-2 hover:underline" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
              .
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
