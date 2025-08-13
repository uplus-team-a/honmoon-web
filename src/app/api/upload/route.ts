import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createGcsClient, getGcsBucketName } from "../../../lib/gcp";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { message: "Invalid content type" },
        { status: 400 }
      );
    }
    const body = await req.json();
    const { fileName, mimeType } = body || {};
    if (!fileName || !mimeType) {
      return NextResponse.json(
        { message: "fileName and mimeType are required" },
        { status: 400 }
      );
    }

    const storage = createGcsClient();
    const bucketName = getGcsBucketName();
    const bucket = storage.bucket(bucketName);

    const now = new Date();
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, "0");
    const d = String(now.getUTCDate()).padStart(2, "0");
    const randomId = crypto.randomBytes(16).toString("hex");
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const objectName = `uploads/${y}/${m}/${d}/${randomId}_${safeName}`;

    const file = bucket.file(objectName);
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    const [url] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: expiresAt,
      contentType: mimeType,
    });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${objectName}`;
    return NextResponse.json({ uploadUrl: url, fileId: objectName, publicUrl });
  } catch (e) {
    console.error("GCS upload route error", e);
    return NextResponse.json(
      { message: "Upload setup failed" },
      { status: 500 }
    );
  }
}
