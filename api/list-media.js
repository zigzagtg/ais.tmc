export default async function handler(req, res) {
  const folderPrefix = req.query.prefix || "";

  try {
    const kvUrl = process.env.WORKER_DOMAIN + "/media-list.json";
    const kvResponse = await fetch(kvUrl);
    const mediaList = await kvResponse.json();

    // NORMALIZE folder name for URL matching
    const normalizedPrefix = folderPrefix.replace(/ /g, "%20").replace(/\/$/, "");
    const filtered = mediaList.filter(url => {
      const path = new URL(url).pathname.replace(/\/$/, "");
      return path.includes(normalizedPrefix);
    });

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    res.status(200).json(filtered);

  } catch (err) {
    console.error("Error fetching media list from KV:", err);
    res.status(500).json({ error: "Failed to fetch media" });
  }
}
