// /api/list-media.js
export default async function handler(req, res) {
  const folderPrefix = req.query.prefix || ""; // e.g., "Section 1/"

  try {
    // Fetch the KV-updated list from the Worker
    const kvUrl = process.env.WORKER_DOMAIN + "/media-list.json";
    const kvResponse = await fetch(kvUrl);
    const mediaList = await kvResponse.json();

    // Filter by folder prefix (keeps old folder structure compatible)
    const filtered = mediaList.filter(url => url.includes(folderPrefix));

    // Cache on Vercel edge (optional)
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");

    res.status(200).json(filtered);

  } catch (err) {
    console.error("Error fetching media list from KV:", err);
    res.status(500).json({ error: "Failed to fetch media" });
  }
}
