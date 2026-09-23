const CHANNEL_ID = "UCdHWNYNLmBAjXOUo70GEa8w";
const CHANNEL_URL = "https://www.youtube.com/@centerforbiologicimaging8175";

const FALLBACK_VIDEOS = [
  { id: "OcxUMsXjL00", title: "Explaining the Nikon Elements interface update", published: "2026-09-01" },
  { id: "IGPYkoZ1Bic", title: "Setting up a Z-stack in NIS elements", published: "2026-09-01" }
];

function decodeEntities(s) {
  if (!s) return "";
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

module.exports = async function () {
  const feed = { channelId: CHANNEL_ID, channelUrl: CHANNEL_URL, videos: [] };
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { signal: AbortSignal.timeout(15000), headers: { "User-Agent": "Mozilla/5.0 (compatible; CBI-site build)" } }
    );
    if (!res.ok) throw new Error("HTTP " + res.status);
    const xml = await res.text();
    feed.videos = xml
      .split("<entry>")
      .slice(1)
      .map((e) => ({
        id: (e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1],
        title: decodeEntities((e.match(/<title>([\s\S]*?)<\/title>/) || [])[1]),
        published: (e.match(/<published>([^<]+)<\/published>/) || [])[1] || "",
        description: decodeEntities((e.match(/<media:description>([\s\S]*?)<\/media:description>/) || [])[1]),
      }))
      .filter((v) => v.id);
  } catch (err) {
    console.warn("YouTube feed fetch failed, using fallback list:", err.message);
    feed.videos = FALLBACK_VIDEOS;
  }
  return feed;
};
