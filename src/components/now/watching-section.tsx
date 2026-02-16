import Image from "next/image";
import { TraktHistoryItemWithPoster } from "@/types/trakt";
import { timeAgo } from "@/lib/utils";

export function WatchingSection({
  items,
}: {
  items: TraktHistoryItemWithPoster[] | null;
}) {
  if (!items) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Watching</h2>
        <p className="text-sm text-foreground/50">
          Unable to load watch history.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Watching</h2>
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
    </section>
  );
}
