// /api/list-media.js
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

export default async function handler(req, res) {
  try {
    // Initialize S3 client pointing to Cloudflare R2
    const s3 = new S3Client({
      endpoint: process.env.R2_ENDPOINT,
      region: "auto", // R2 ignores region
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });

    // List objects in bucket
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
    });

    const data = await s3.send(command);

    // Map keys to public URLs
    const urls = data.Contents.map(
      (obj) => `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${obj.Key}`
    );

    // Return JSON array
    res.status(200).json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list media" });
  }
}
