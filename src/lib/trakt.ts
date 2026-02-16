import {
  TraktHistoryItem,
  TraktHistoryItemWithPoster,
  TraktWatchingItem,
  TraktWatchingItemWithPoster,
} from "@/types/trakt";
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

export async function getCurrentlyWatching(): Promise<TraktWatchingItemWithPoster | null> {
  const clientId = process.env.TRAKT_CLIENT_ID;
  const username = process.env.TRAKT_USERNAME;

  if (!clientId || !username) return null;

  try {
    const res = await fetch(
      `${TRAKT_BASE_URL}/users/${username}/watching`,
      {
        headers: {
          "Content-Type": "application/json",
          "trakt-api-version": "2",
          "trakt-api-key": clientId,
        },
        next: { revalidate: 60 },
      }
    );

    if (res.status === 204 || !res.ok) return null;

    const item: TraktWatchingItem = await res.json();
    let posterUrl: string | null = null;

    if (item.type === "movie" && item.movie?.ids.tmdb) {
      posterUrl = await getMoviePoster(item.movie.ids.tmdb);
    } else if (item.type === "episode" && item.show?.ids.tmdb) {
      posterUrl = await getShowPoster(item.show.ids.tmdb);
    }

    return { ...item, posterUrl };
  } catch (error) {
    console.error("Trakt watching fetch error:", error);
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

export interface MonthlyWatchStats {
  movieCount: number;
  episodeCount: number;
  movies: TraktHistoryItemWithPoster[];
  episodes: TraktHistoryItemWithPoster[];
}

export async function getMonthlyWatchStats(): Promise<MonthlyWatchStats | null> {
  const items = await fetchTraktHistory(100);
  if (!items) return null;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisMonth = items.filter(
    (item) => new Date(item.watched_at) >= startOfMonth
  );

  const movies = thisMonth.filter((item) => item.type === "movie");
  const episodes = thisMonth.filter((item) => item.type === "episode");

  const moviesWithPosters = await Promise.all(
    movies.map(async (item) => {
      let posterUrl: string | null = null;
      if (item.movie?.ids.tmdb) {
        posterUrl = await getMoviePoster(item.movie.ids.tmdb);
      }
      return { ...item, posterUrl };
    })
  );

  const episodesWithPosters = await Promise.all(
    episodes.map(async (item) => {
      let posterUrl: string | null = null;
      if (item.show?.ids.tmdb) {
        posterUrl = await getShowPoster(item.show.ids.tmdb);
      }
      return { ...item, posterUrl };
    })
  );

  return {
    movieCount: movies.length,
    episodeCount: episodes.length,
    movies: moviesWithPosters,
    episodes: episodesWithPosters,
  };
}
