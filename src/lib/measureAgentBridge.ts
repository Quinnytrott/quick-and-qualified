import "server-only";

import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

const DEFAULT_MEASURE_AGENT_SITE_URL = "https://measureagent.ca";
const APP_NAME = "measureagent-bridge";

type MeasureAgentBridgeState = {
  app?: App;
  db?: Firestore;
};

const globalForMeasureAgent = globalThis as typeof globalThis & {
  __measureAgentBridgeState__?: MeasureAgentBridgeState;
};

const bridgeState =
  globalForMeasureAgent.__measureAgentBridgeState__ ??
  (globalForMeasureAgent.__measureAgentBridgeState__ = {});

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name}.`);
  }

  return value;
}

function getMeasureAgentFirestoreConfig() {
  return {
    projectId: process.env.MEASUREAGENT_FIREBASE_PROJECT_ID?.trim() || "roofmeasure-8g2ch",
    clientEmail: requireEnv("MEASUREAGENT_FIREBASE_CLIENT_EMAIL"),
    privateKey: requireEnv("MEASUREAGENT_FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
  };
}

function getMeasureAgentBridgeConfig() {
  return {
    ownerUid: requireEnv("MEASUREAGENT_OWNER_UID"),
    companyId: requireEnv("MEASUREAGENT_COMPANY_ID"),
  };
}

function getMeasureAgentSiteUrl(): string {
  return process.env.MEASUREAGENT_SITE_URL?.trim().replace(/\/$/, "") || DEFAULT_MEASURE_AGENT_SITE_URL;
}

function getMeasureAgentApp(): App {
  if (bridgeState.app) {
    return bridgeState.app;
  }

  const existing = getApps().find((app) => app.name === APP_NAME);
  if (existing) {
    bridgeState.app = existing;
    return existing;
  }

  const firestoreConfig = getMeasureAgentFirestoreConfig();
  bridgeState.app = initializeApp(
    {
      credential: cert({
        projectId: firestoreConfig.projectId,
        clientEmail: firestoreConfig.clientEmail,
        privateKey: firestoreConfig.privateKey,
      }),
      projectId: firestoreConfig.projectId,
    },
    APP_NAME,
  );

  return bridgeState.app;
}

export function getMeasureAgentDb(): Firestore {
  if (bridgeState.db) {
    return bridgeState.db;
  }

  bridgeState.db = getFirestore(getMeasureAgentApp());
  return bridgeState.db;
}

export function getMeasureAgentOwnerUid(): string {
  return getMeasureAgentBridgeConfig().ownerUid;
}

export function getMeasureAgentCompanyId(): string {
  return getMeasureAgentBridgeConfig().companyId;
}

export function buildMeasureAgentProjectUrl(projectId: string): string {
  const url = new URL("/measurements", getMeasureAgentSiteUrl());
  url.searchParams.set("id", projectId);
  return url.toString();
}
