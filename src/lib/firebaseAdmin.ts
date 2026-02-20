import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

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

  return {
    projectId: projectId as string,
    clientEmail: clientEmail as string,
    privateKey: privateKey as string,
  };
}

export function getDb(): Firestore {
  if (firebaseState.db) {
    return firebaseState.db;
  }

  const existingApp = getApps()[0];
  const app =
    existingApp ??
    firebaseState.app ??
    initializeApp({
      credential: cert(getFirebaseAdminConfig()),
    });
  firebaseState.app = app;

  firebaseState.db = getFirestore(app);
  return firebaseState.db;
}
