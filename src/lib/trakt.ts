import {
  TraktHistoryItem,
  TraktHistoryItemWithPoster,
  TraktWatchingItem,
  TraktWatchingItemWithPoster,
} from "@/types/trakt";
import { getMoviePoster, getShowPoster } from "./tmdb";

const TRAKT_BASE_URL = "https://api.trakt.tv";
const TRAKT_USER_AGENT = "mariobarraza-personal-site/1.0";

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
          "User-Agent": TRAKT_USER_AGENT,
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
          "User-Agent": TRAKT_USER_AGENT,
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

async function fetchUserRatings(): Promise<Map<number, number>> {
  const clientId = process.env.TRAKT_CLIENT_ID;
  const username = process.env.TRAKT_USERNAME;
  const ratings = new Map<number, number>();

  if (!clientId || !username) return ratings;

  try {
    const [moviesRes, showsRes] = await Promise.all([
      fetch(`${TRAKT_BASE_URL}/users/${username}/ratings/movies`, {
        headers: {
          "Content-Type": "application/json",
          "trakt-api-version": "2",
          "trakt-api-key": clientId,
          "User-Agent": TRAKT_USER_AGENT,
        },
        next: { revalidate: 900 },
      }),
      fetch(`${TRAKT_BASE_URL}/users/${username}/ratings/shows`, {
        headers: {
          "Content-Type": "application/json",
          "trakt-api-version": "2",
          "trakt-api-key": clientId,
          "User-Agent": TRAKT_USER_AGENT,
        },
        next: { revalidate: 900 },
      }),
    ]);

    if (moviesRes.ok) {
      const movies = await moviesRes.json();
      for (const item of movies) {
        if (item.movie?.ids?.trakt && item.rating) {
          ratings.set(item.movie.ids.trakt, item.rating);
        }
      }
    }

    if (showsRes.ok) {
      const shows = await showsRes.json();
      for (const item of shows) {
        if (item.show?.ids?.trakt && item.rating) {
          ratings.set(item.show.ids.trakt, item.rating);
        }
      }
    }
  } catch (error) {
    console.error("Trakt ratings fetch error:", error);
  }

  return ratings;
}

export async function getRecentlyWatched(
  limit: number = 5
): Promise<TraktHistoryItemWithPoster[] | null> {
  const [items, ratings] = await Promise.all([
    fetchTraktHistory(limit),
    fetchUserRatings(),
  ]);
  if (!items) return null;

  const withPosters = await Promise.all(
    items.map(async (item) => {
      let posterUrl: string | null = null;

      if (item.type === "movie" && item.movie?.ids.tmdb) {
        posterUrl = await getMoviePoster(item.movie.ids.tmdb);
      } else if (item.type === "episode" && item.show?.ids.tmdb) {
        posterUrl = await getShowPoster(item.show.ids.tmdb);
      }

      const traktId =
        item.type === "movie"
          ? item.movie?.ids.trakt
          : item.show?.ids.trakt;
      const rating = traktId ? (ratings.get(traktId) ?? null) : null;

      return { ...item, posterUrl, rating };
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
  const [items, ratings] = await Promise.all([
    fetchTraktHistory(100),
    fetchUserRatings(),
  ]);
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
      const rating = item.movie?.ids.trakt
        ? (ratings.get(item.movie.ids.trakt) ?? null)
        : null;
      return { ...item, posterUrl, rating };
    })
  );

  const episodesWithPosters = await Promise.all(
    episodes.map(async (item) => {
      let posterUrl: string | null = null;
      if (item.show?.ids.tmdb) {
        posterUrl = await getShowPoster(item.show.ids.tmdb);
      }
      const rating = item.show?.ids.trakt
        ? (ratings.get(item.show.ids.trakt) ?? null)
        : null;
      return { ...item, posterUrl, rating };
    })
  );

  return {
    movieCount: movies.length,
    episodeCount: episodes.length,
    movies: moviesWithPosters,
    episodes: episodesWithPosters,
  };
}
