import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";

const serviceAccountUrl = new URL(
  "../forest-multiagent-bf09b-firebase-adminsdk-fbsvc-c81f64b253.json",
  import.meta.url
);
const serviceAccount = JSON.parse(readFileSync(serviceAccountUrl, "utf8"));

export const app = initializeApp({
  credential: cert(serviceAccount),
});
