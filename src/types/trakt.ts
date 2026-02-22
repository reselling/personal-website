export interface TraktMovie {
  title: string;
  year: number;
  ids: { trakt: number; slug: string; imdb: string; tmdb: number };
}

export interface TraktShow {
  title: string;
  year: number;
  ids: { trakt: number; slug: string; imdb: string; tmdb: number };
}

export interface TraktEpisode {
  season: number;
  number: number;
  title: string;
  ids: { trakt: number; tvdb: number; imdb: string; tmdb: number };
}

export interface TraktHistoryItem {
  id: number;
  watched_at: string;
  action: string;
  type: "movie" | "episode";
  movie?: TraktMovie;
  show?: TraktShow;
  episode?: TraktEpisode;
}

export interface TraktHistoryItemWithPoster extends TraktHistoryItem {
  posterUrl: string | null;
  rating: number | null;
}

export interface TraktWatchingItem {
  expires_at: string;
  started_at: string;
  action: string;
  type: "movie" | "episode";
  movie?: TraktMovie;
  show?: TraktShow;
  episode?: TraktEpisode;
}

export interface TraktWatchingItemWithPoster extends TraktWatchingItem {
  posterUrl: string | null;
}
