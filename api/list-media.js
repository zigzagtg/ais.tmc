import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

export default async function handler(req, res) {
  try {
    const prefix = req.query.prefix || "";

    const s3 = new S3Client({
      endpoint: process.env.R2_ENDPOINT,
      region: "auto",
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.R2_KEY_ID,
        secretAccessKey: process.env.R2_APP_KEY,
      },
    });

    let continuationToken = undefined;
    let allObjects = [];

    // Handle pagination (important if bucket grows)
    do {
      const command = new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      });

      const data = await s3.send(command);

      if (data.Contents) {
        allObjects.push(...data.Contents);
      }

      continuationToken = data.IsTruncated
        ? data.NextContinuationToken
        : undefined;

    } while (continuationToken);

    // Build properly encoded URLs
const urls = allObjects
  .filter(obj => obj.Key && !obj.Key.endsWith("/")) 
  .map(obj => {
    return `${process.env.PUBLIC_BASE_URL}/${obj.Key
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`;
  });

    // Optional lightweight caching (5 minutes)
    res.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate"
    );

    res.status(200).json(urls);

  } catch (err) {
    console.error("R2 listing error:", err);
    res.status(500).json({ error: "Failed to list media" });
  }
}
