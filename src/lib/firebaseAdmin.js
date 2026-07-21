import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function credentials() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    return JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf8")
    );
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin environment variables are missing");
  }
  return { projectId, clientEmail, privateKey };
}

function getFirebaseApp() {
  if (getApps().length) return getApps()[0];
  const serviceAccount = credentials();
  return initializeApp({
    credential: cert(serviceAccount),
  });
}

export function getFirebaseDb() {
  return getFirestore(getFirebaseApp());
}

export function serializeProduct(document) {
  const data = document.data();
  return {
    id: document.id,
    ...data,
    created_at: data.created_at?.toDate?.().toISOString() || data.created_at || null,
    updated_at: data.updated_at?.toDate?.().toISOString() || data.updated_at || null,
  };
}
