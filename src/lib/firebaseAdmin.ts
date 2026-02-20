import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let firestoreInstance: Firestore | null = null;

function getFirebaseAdminConfig() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.",
    );
  }

  return { projectId, clientEmail, privateKey };
}

export function getDb(): Firestore {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  const existingApp = getApps()[0];
  const app =
    existingApp ??
    initializeApp({
      credential: cert(getFirebaseAdminConfig()),
    });

  firestoreInstance = getFirestore(app);
  return firestoreInstance;
}
