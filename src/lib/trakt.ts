import { TraktHistoryItem, TraktHistoryItemWithPoster } from "@/types/trakt";
import { getMoviePoster, getShowPoster } from "./tmdb";

const TRAKT_BASE_URL = "https://api.trakt.tv";

async function fetchTraktHistory(
  limit: number
): Promise<TraktHistoryItem[] | null> {
  const clientId = process.env.TRAKT_CLIENT_ID;
  const username = process.env.TRAKT_USERNAME;

  if (!clientId || !username) {
    console.error("Trakt: Missing client ID or username");
    return null;
  }

  try {
    const res = await fetch(
      `${TRAKT_BASE_URL}/users/${username}/history?limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
          "trakt-api-version": "2",
          "trakt-api-key": clientId,
        },
        next: { revalidate: 900 },
      }
    );

    if (!res.ok) {
      console.error("Trakt API error:", res.status);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Trakt fetch error:", error);
    return null;
  }
}

export async function getRecentlyWatched(
  limit: number = 5
): Promise<TraktHistoryItemWithPoster[] | null> {
  const items = await fetchTraktHistory(limit);
  if (!items) return null;

  const withPosters = await Promise.all(
    items.map(async (item) => {
      let posterUrl: string | null = null;

      if (item.type === "movie" && item.movie?.ids.tmdb) {
        posterUrl = await getMoviePoster(item.movie.ids.tmdb);
      } else if (item.type === "episode" && item.show?.ids.tmdb) {
        posterUrl = await getShowPoster(item.show.ids.tmdb);
      }

      return { ...item, posterUrl };
    })
  );

  return withPosters;
}
