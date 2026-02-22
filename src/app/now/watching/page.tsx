import { Metadata } from "next";
import Image from "next/image";
import { getMonthlyWatchStats } from "@/lib/trakt";
import { timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Watching Stats",
  description: "What I've been watching this month.",
};

export default async function WatchingStatsPage() {
  const stats = await getMonthlyWatchStats();

  const monthName = new Date().toLocaleString("default", { month: "long" });

  return (
    <div className="space-y-10">
      <div>
        <a href="/now" className="text-sm text-foreground/50 hover:text-foreground">
          ← Back to Now
        </a>
        <h1 className="text-3xl font-bold mt-2">Watching</h1>
        <p className="text-foreground/60 mt-1">{monthName} overview</p>
      </div>

      {!stats ? (
        <p className="text-sm text-foreground/50">Unable to load watch stats.</p>
      ) : (
        <>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{stats.movieCount}</p>
              <p className="text-sm text-foreground/50">
                {stats.movieCount === 1 ? "movie" : "movies"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{stats.episodeCount}</p>
              <p className="text-sm text-foreground/50">
                {stats.episodeCount === 1 ? "episode" : "episodes"}
              </p>
            </div>
          </div>

          {stats.movies.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Movies</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {stats.movies.map((item) => (
                  <div key={item.id} className="flex-shrink-0 w-32 space-y-2">
                    <div className="relative aspect-[2/3] rounded overflow-hidden bg-foreground/5">
                      {item.posterUrl ? (
                        <Image
                          src={item.posterUrl}
                          alt={item.movie?.title ?? ""}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-foreground/30">
                          No poster
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate">
                        {item.movie?.title}
                      </p>
                      <p className="text-xs text-foreground/50">
                        {timeAgo(item.watched_at)}
                      </p>
                      {item.rating && (
                        <p className="text-xs text-foreground/40 mt-0.5">
                          ★ {item.rating}/10
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {stats.episodes.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Episodes</h2>
              <div className="space-y-3">
                {stats.episodes.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-12 w-8 flex-shrink-0 rounded overflow-hidden bg-foreground/5">
                      {item.posterUrl ? (
                        <Image
                          src={item.posterUrl}
                          alt={item.show?.title ?? ""}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.show?.title}
                      </p>
                      <p className="text-xs text-foreground/50 truncate">
                        {item.episode
                          ? `S${String(item.episode.season).padStart(2, "0")}E${String(item.episode.number).padStart(2, "0")} · ${item.episode.title}`
                          : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {item.rating && (
                        <span className="text-xs text-foreground/40">
                          ★ {item.rating}/10
                        </span>
                      )}
                      <span className="text-xs text-foreground/40">
                        {timeAgo(item.watched_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
