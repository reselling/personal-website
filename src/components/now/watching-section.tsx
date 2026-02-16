import Image from "next/image";
import { TraktHistoryItemWithPoster, TraktWatchingItemWithPoster } from "@/types/trakt";
import { timeAgo } from "@/lib/utils";

export function WatchingSection({
  items,
  currentlyWatching,
}: {
  items: TraktHistoryItemWithPoster[] | null;
  currentlyWatching: TraktWatchingItemWithPoster | null;
}) {
  if (!items && !currentlyWatching) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Watching</h2>
        <p className="text-sm text-foreground/50">
          Unable to load watch history.
        </p>
      </section>
    );
  }

  const nowTitle =
    currentlyWatching?.type === "movie"
      ? currentlyWatching.movie?.title
      : currentlyWatching?.show?.title;
  const nowSubtitle =
    currentlyWatching?.type === "episode" && currentlyWatching.episode
      ? `S${String(currentlyWatching.episode.season).padStart(2, "0")}E${String(currentlyWatching.episode.number).padStart(2, "0")} · ${currentlyWatching.episode.title}`
      : currentlyWatching?.type === "movie"
        ? `${currentlyWatching.movie?.year}`
        : "";

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Watching</h2>

      {currentlyWatching && (
        <div className="flex items-center gap-4 p-3 rounded-lg bg-foreground/5">
          <div className="relative flex-shrink-0 w-16 aspect-[2/3] rounded overflow-hidden bg-foreground/5">
            {currentlyWatching.posterUrl ? (
              <Image
                src={currentlyWatching.posterUrl}
                alt={nowTitle ?? ""}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-foreground/30">
                No poster
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-xs text-green-500 font-medium">Watching now</span>
            </div>
            <p className="text-sm font-medium truncate">{nowTitle}</p>
            <p className="text-xs text-foreground/50">{nowSubtitle}</p>
          </div>
        </div>
      )}

      {items && items.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {items.map((item) => {
            const title =
              item.type === "movie"
                ? item.movie?.title
                : item.show?.title;
            const subtitle =
              item.type === "episode" && item.episode
                ? `S${String(item.episode.season).padStart(2, "0")}E${String(item.episode.number).padStart(2, "0")}`
                : item.type === "movie"
                  ? `${item.movie?.year}`
                  : "";

            return (
              <div
                key={item.id}
                className="flex-shrink-0 w-32 space-y-2"
              >
                <div className="relative aspect-[2/3] rounded overflow-hidden bg-foreground/5">
                  {item.posterUrl ? (
                    <Image
                      src={item.posterUrl}
                      alt={title ?? ""}
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
                  <p className="text-sm font-medium truncate">{title}</p>
                  <p className="text-xs text-foreground/50">
                    {subtitle}
                    {subtitle && " · "}
                    {timeAgo(item.watched_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
