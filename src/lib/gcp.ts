// Server-side helpers for Google Cloud Storage
// Do NOT import this file in client components

import { Storage } from "@google-cloud/storage";

export function createGcsClient(): Storage {
  const projectId = process.env.GCP_PROJECT_ID;
  const json = process.env.GCP_SERVICE_ACCOUNT_JSON;
  if (!projectId || !json) {
    throw new Error("GCP credentials are not configured");
  }
  const creds = JSON.parse(json);
  return new Storage({
    projectId,
    credentials: {
      client_email: creds.client_email,
      private_key: creds.private_key,
    },
  });
}

export function getGcsBucketName(): string {
  const bucket = process.env.GCP_BUCKET_NAME;
  if (!bucket) throw new Error("GCP_BUCKET_NAME is not configured");
  return bucket;
}
