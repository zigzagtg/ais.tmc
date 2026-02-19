export default async function handler(req, res) {
  try {
    const folderPrefixRaw = req.query.prefix || "";  // e.g., "Section 4/"
    const folderPrefix = folderPrefixRaw.trim().replace(/\/$/, "");

    // Fetch media list from Worker KV
    const kvResponse = await fetch(process.env.WORKER_DOMAIN + "/media-list.json");
    const mediaList = await kvResponse.json();

    // Filter by folder (normalize %2F)
    const filtered = mediaList.filter(url => {
      const path = decodeURIComponent(url).replace(/^https?:\/\/[^/]+\/?/, ""); // remove domain
      return path.startsWith(folderPrefix);
    });

    // Fix URLs for front-end: convert %2F back to real slash
    const urls = filtered.map(url => url.replace(/%2F/g, "/"));

    res.status(200).json(urls);

  } catch (err) {
    console.error("Error fetching media list from KV:", err);
    res.status(500).json({ error: "Failed to fetch media" });
  }
}
