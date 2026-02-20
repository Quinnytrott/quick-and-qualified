import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

type FirebaseAdminState = {
  app?: App;
  db?: Firestore;
  envLogged?: boolean;
};

const globalForFirebase = globalThis as typeof globalThis & {
  __firebaseAdminState__?: FirebaseAdminState;
};

const firebaseState =
  globalForFirebase.__firebaseAdminState__ ??
  (globalForFirebase.__firebaseAdminState__ = {});

function logEnvPresence() {
  if (process.env.NODE_ENV !== "development" || firebaseState.envLogged) {
    return;
  }

  console.log("[firebaseAdmin] HAS FIREBASE_PROJECT_ID?", Boolean(process.env.FIREBASE_PROJECT_ID));
  console.log("[firebaseAdmin] HAS FIREBASE_CLIENT_EMAIL?", Boolean(process.env.FIREBASE_CLIENT_EMAIL));
  console.log("[firebaseAdmin] HAS FIREBASE_PRIVATE_KEY?", Boolean(process.env.FIREBASE_PRIVATE_KEY));
  firebaseState.envLogged = true;
}

function getFirebaseAdminConfig(): {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  storageBucket: string;
} {
  logEnvPresence();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const missing = [
    !projectId ? "FIREBASE_PROJECT_ID" : null,
    !clientEmail ? "FIREBASE_CLIENT_EMAIL" : null,
    !privateKey ? "FIREBASE_PRIVATE_KEY" : null,
  ].filter(Boolean) as string[];

  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase Admin credentials: ${missing.join(", ")}. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.`,
    );
  }

  const resolvedProjectId = projectId as string;

  return {
    projectId: resolvedProjectId,
    clientEmail: clientEmail as string,
    privateKey: privateKey as string,
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET || `${resolvedProjectId}.appspot.com`,
  };
}

function getFirebaseAdminApp(): App {
  if (firebaseState.app) {
    return firebaseState.app;
  }

  const existingApp = getApps()[0];
  if (existingApp) {
    firebaseState.app = existingApp;
    return existingApp;
  }

  const config = getFirebaseAdminConfig();
  const app = initializeApp({
    credential: cert({
      projectId: config.projectId,
      clientEmail: config.clientEmail,
      privateKey: config.privateKey,
    }),
    storageBucket: config.storageBucket,
  });
  firebaseState.app = app;
  return app;
}

export function getDb(): Firestore {
  if (firebaseState.db) {
    return firebaseState.db;
  }

  firebaseState.db = getFirestore(getFirebaseAdminApp());
  return firebaseState.db;
}

export function getStorageBucket() {
  const app = getFirebaseAdminApp();
  const fallbackProjectId =
    process.env.FIREBASE_PROJECT_ID ||
    (typeof app.options.projectId === "string" ? app.options.projectId : "");
  const bucketName =
    process.env.FIREBASE_STORAGE_BUCKET ||
    (typeof app.options.storageBucket === "string"
      ? app.options.storageBucket
      : "") ||
    (fallbackProjectId ? `${fallbackProjectId}.appspot.com` : "");

  if (!bucketName) {
    throw new Error(
      "Missing storage bucket configuration. Set FIREBASE_STORAGE_BUCKET or FIREBASE_PROJECT_ID.",
    );
  }

  return getStorage(app).bucket(bucketName);
}
