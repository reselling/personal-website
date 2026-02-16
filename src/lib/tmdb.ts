const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export function getTMDBPosterUrl(
  posterPath: string,
  size: string = "w342"
): string {
  return `${TMDB_IMAGE_BASE}/${size}${posterPath}`;
}

export async function getMoviePoster(
  tmdbId: number
): Promise<string | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data.poster_path ? getTMDBPosterUrl(data.poster_path) : null;
  } catch {
    return null;
  }
}

export async function getShowPoster(
  tmdbId: number
): Promise<string | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${apiKey}`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data.poster_path ? getTMDBPosterUrl(data.poster_path) : null;
  } catch {
    return null;
  }
}
