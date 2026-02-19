export default async function handler(req, res) {
  const folderPrefix = req.query.prefix || "";

  try {
    const kvUrl = process.env.WORKER_DOMAIN + "/media-list.json";
    console.log("Fetching from KV URL:", kvUrl);

    const kvResponse = await fetch(kvUrl);

    if (!kvResponse.ok) {
      console.error("KV fetch failed:", kvResponse.status, kvResponse.statusText);
      return res.status(500).json({ error: "Failed to fetch media from KV" });
    }

    const mediaList = await kvResponse.json();
    console.log("Media list length:", mediaList.length);

    const filtered = mediaList.filter(url => url.includes(folderPrefix));

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    res.status(200).json(filtered);

  } catch (err) {
    console.error("Error fetching media list from KV:", err);
    res.status(500).json({ error: "Failed to fetch media" });
  }
}
