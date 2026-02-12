// /api/list-media.js
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

export default async function handler(req, res) {
  try {
    // Get folder prefix from query string
    const folderPrefix = req.query.prefix || ""; // e.g., "Section 1/"

    // Initialize S3 client for Backblaze B2
    const s3 = new S3Client({
      endpoint: process.env.B2_ENDPOINT, // e.g., "https://s3.us-east-005.backblazeb2.com"
      region: "us-east-005",
      credentials: {
        accessKeyId: process.env.B2_KEY_ID,    // your Backblaze key ID
        secretAccessKey: process.env.B2_APP_KEY // your Backblaze application key
      },
    });

    // List objects in the bucket for this folder prefix
    const command = new ListObjectsV2Command({
      Bucket: process.env.B2_BUCKET_NAME,
      Prefix: folderPrefix // keep spaces as-is
    });

    const data = await s3.send(command);

    // Map each object to a public URL
    const urls = (data.Contents || []).map(
      obj => `${process.env.PUBLIC_BASE_URL}/${obj.Key}` // e.g., PUBLIC_BASE_URL = https://<bucket>.s3.us-east-005.backblazeb2.com
    );

    res.status(200).json(urls);

  } catch (err) {
    console.error("Error listing media:", err);
    res.status(500).json({ error: "Failed to list media" });
  }
}
