"use client";

import { useState, type FormEvent } from "react";
import { primaryButtonClass, secondaryButtonClass } from "@/lib/ui";

type ContractorApplicationStatus = "new" | "reviewing" | "approved" | "rejected" | "paused";

type ContractorApplicationActionsProps = {
  applicationId: string;
  viewerToken: string;
  initialStatus: ContractorApplicationStatus;
  initialInternalNotes: string;
};

const statusActions: Array<{
  label: string;
  status: ContractorApplicationStatus;
}> = [
  { label: "Mark Reviewing", status: "reviewing" },
  { label: "Approve", status: "approved" },
  { label: "Reject", status: "rejected" },
  { label: "Pause", status: "paused" },
];

const fieldClassName =
  "mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-[border-color,box-shadow] focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200";
const activeStatusButtonClass =
  "cursor-default rounded-xl border border-blue-900 bg-blue-900 px-6 py-3 text-sm font-semibold text-white shadow-sm ring-2 ring-blue-200 transition-colors";

export function ContractorApplicationActions(props: ContractorApplicationActionsProps) {
  const { applicationId, viewerToken, initialStatus, initialInternalNotes } = props;
  const [status, setStatus] = useState<ContractorApplicationStatus>(initialStatus);
  const [internalNotes, setInternalNotes] = useState(initialInternalNotes);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function updateApplication(payload: {
    status?: ContractorApplicationStatus;
    internalNotes?: string;
  }) {
    setIsSaving(true);
    setStatusMessage("");

    try {
      const response = await fetch(`/api/contractor-applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: viewerToken,
          ...payload,
        }),
      });
      const responseBody = (await response.json().catch(() => null)) as
        | {
            success?: boolean;
            message?: string;
            status?: ContractorApplicationStatus;
            internalNotes?: string;
          }
        | null;

      if (!response.ok || !responseBody?.success) {
        throw new Error(responseBody?.message || "Could not update application.");
      }

      if (responseBody.status) {
        setStatus(responseBody.status);
      }

      if (typeof responseBody.internalNotes === "string") {
        setInternalNotes(responseBody.internalNotes);
      }

      setStatusMessage("Saved.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Could not update application.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleNotesSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void updateApplication({ internalNotes });
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">Vetting Status</p>
        <p className="mt-1 text-lg font-semibold capitalize text-zinc-900">{status}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {statusActions.map((action) => {
          const isActive = status === action.status;

          return (
            <button
              aria-pressed={isActive}
              aria-disabled={isActive || isSaving}
              key={action.status}
              className={isActive ? activeStatusButtonClass : secondaryButtonClass}
              disabled={isSaving}
              onClick={() => {
                if (isActive) {
                  return;
                }

                updateApplication({ status: action.status });
              }}
              type="button"
            >
              {action.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleNotesSubmit}>
        <label className="text-sm font-medium text-zinc-900" htmlFor="internalNotes">
          Internal Notes
        </label>
        <textarea
          className={fieldClassName}
          id="internalNotes"
          name="internalNotes"
          onChange={(event) => setInternalNotes(event.target.value)}
          placeholder="Admin-only vetting notes, follow-up questions, or approval context."
          rows={6}
          value={internalNotes}
        />
        <button
          className={`${primaryButtonClass} mt-3 disabled:cursor-not-allowed disabled:opacity-70`}
          disabled={isSaving}
          type="submit"
        >
          {isSaving ? "Saving..." : "Save Internal Notes"}
        </button>
      </form>

      {statusMessage ? <p className="text-sm text-zinc-600">{statusMessage}</p> : null}
    </div>
  );
}
