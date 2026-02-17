import { LastFmTrack, LastFmTopArtist, LastFmTopTrack, AggregatedArtist, AggregatedTrack } from "@/types/lastfm";

const LASTFM_BASE_URL = "https://ws.audioscrobbler.com/2.0";

export async function getRecentTracks(
  limit: number = 5
): Promise<LastFmTrack[] | null> {
  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USERNAME;

  if (!apiKey || !username) {
    console.error("Last.fm: Missing API key or username");
    return null;
  }

  try {
    const params = new URLSearchParams({
      method: "user.getrecenttracks",
      user: username,
      api_key: apiKey,
      format: "json",
      limit: limit.toString(),
    });

    const res = await fetch(`${LASTFM_BASE_URL}?${params}`, {
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      console.error("Last.fm API error:", res.status);
      return null;
    }

    const data = await res.json();
    return data.recenttracks?.track ?? null;
  } catch (error) {
    console.error("Last.fm fetch error:", error);
    return null;
  }
}

export async function getMonthlyListeningData(
  limit: number = 10
): Promise<{ topArtists: AggregatedArtist[]; topTracks: AggregatedTrack[] } | null> {
  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USERNAME;

  if (!apiKey || !username) return null;

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const from = Math.floor(startOfMonth.getTime() / 1000).toString();
    const to = Math.floor(now.getTime() / 1000).toString();

    // Paginate through all tracks for the month
    const allTracks: LastFmTrack[] = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const params = new URLSearchParams({
        method: "user.getrecenttracks",
        user: username,
        api_key: apiKey,
        format: "json",
        limit: "200",
        from,
        to,
        page: page.toString(),
      });

      const res = await fetch(`${LASTFM_BASE_URL}?${params}`, {
        next: { revalidate: 3600 },
      });

      if (!res.ok) break;
      const data = await res.json();
      const pageTracks: LastFmTrack[] = data.recenttracks?.track ?? [];
      if (pageTracks.length === 0) break;

      allTracks.push(...pageTracks);
      totalPages = parseInt(data.recenttracks?.["@attr"]?.totalPages ?? "1", 10);
      page++;
    }

    const tracks = allTracks;

    // Aggregate top artists
    const artistMap = new Map<string, { playcount: number; image: string; url: string }>();
    for (const track of tracks) {
      if (track["@attr"]?.nowplaying === "true") continue;
      const name = track.artist["#text"];
      const existing = artistMap.get(name);
      const image = track.image?.find((img) => img.size === "large")?.["#text"] || "";
      if (existing) {
        existing.playcount++;
        if (!existing.image && image) existing.image = image;
      } else {
        artistMap.set(name, { playcount: 1, image, url: track.url.split("/_/")[0] || track.url });
      }
    }

    const topArtists: AggregatedArtist[] = [...artistMap.entries()]
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.playcount - a.playcount)
      .slice(0, limit);

    // Aggregate top tracks
    const trackMap = new Map<string, { artist: string; playcount: number; image: string; url: string }>();
    for (const track of tracks) {
      if (track["@attr"]?.nowplaying === "true") continue;
      const key = `${track.name}|||${track.artist["#text"]}`;
      const existing = trackMap.get(key);
      const image = track.image?.find((img) => img.size === "large")?.["#text"] || "";
      if (existing) {
        existing.playcount++;
      } else {
        trackMap.set(key, { artist: track.artist["#text"], playcount: 1, image, url: track.url });
      }
    }

    const topTracks: AggregatedTrack[] = [...trackMap.entries()]
      .map(([key, data]) => ({ name: key.split("|||")[0], ...data }))
      .sort((a, b) => b.playcount - a.playcount)
      .slice(0, limit);

    return { topArtists, topTracks };
  } catch (error) {
    console.error("Last.fm monthly listening data error:", error);
    return null;
  }
}

export async function getMonthlyTopArtists(
  limit: number = 10
): Promise<LastFmTopArtist[] | null> {
  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USERNAME;

  if (!apiKey || !username) return null;

  try {
    const params = new URLSearchParams({
      method: "user.gettopartists",
      user: username,
      api_key: apiKey,
      format: "json",
      period: "1month",
      limit: limit.toString(),
    });

    const res = await fetch(`${LASTFM_BASE_URL}?${params}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.topartists?.artist ?? null;
  } catch (error) {
    console.error("Last.fm top artists error:", error);
    return null;
  }
}

export async function getMonthlyTopTracks(
  limit: number = 10
): Promise<LastFmTopTrack[] | null> {
  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USERNAME;

  if (!apiKey || !username) return null;

  try {
    const params = new URLSearchParams({
      method: "user.gettoptracks",
      user: username,
      api_key: apiKey,
      format: "json",
      period: "1month",
      limit: limit.toString(),
    });

    const res = await fetch(`${LASTFM_BASE_URL}?${params}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.toptracks?.track ?? null;
  } catch (error) {
    console.error("Last.fm top tracks error:", error);
    return null;
  }
}
