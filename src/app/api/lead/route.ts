import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

type LeadPayload = {
  name: string;
  email: string;
  phone: string;
  address: string;
  jobType: string;
  notes: string;
};

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: Partial<LeadPayload>;

  try {
    body = (await request.json()) as Partial<LeadPayload>;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const lead: LeadPayload = {
    name: asTrimmedString(body.name),
    email: asTrimmedString(body.email),
    phone: asTrimmedString(body.phone),
    address: asTrimmedString(body.address),
    jobType: asTrimmedString(body.jobType),
    notes: asTrimmedString(body.notes),
  };

  const missing = (
    ["name", "email", "phone", "address", "jobType"] as const
  ).filter((field) => !lead[field]);

  if (missing.length > 0) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing required fields.",
        fields: missing,
      },
      { status: 400 },
    );
  }

  try {
    const db = getDb();

    await db.collection("leads").add({
      ...lead,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to create lead", error);
    return NextResponse.json(
      { success: false, message: "Failed to save lead." },
      { status: 500 },
    );
  }
}
