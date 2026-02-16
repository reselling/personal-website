import { LastFmTrack, LastFmTopArtist, LastFmTopTrack } from "@/types/lastfm";

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
