import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

export default async function handler(req, res) {
  try {
    const s3 = new S3Client({
      endpoint: process.env.B2_ENDPOINT,
      region: "us-east-005", 
      credentials: {
        accessKeyId: process.env.B2_KEY_ID,
        secretAccessKey: process.env.B2_APP_KEY,
      },
    });

    const command = new ListObjectsV2Command({
      Bucket: process.env.B2_BUCKET_NAME,
    });

    const data = await s3.send(command);

    const urls = data.Contents.map(
      obj => `${process.env.PUBLIC_BASE_URL}/${obj.Key}`
    );

    res.status(200).json(urls);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list media" });
  }
}
