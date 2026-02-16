import Image from "next/image";
import { LastFmTrack } from "@/types/lastfm";
import { timeAgo } from "@/lib/utils";

export function ListeningSection({
  tracks,
}: {
  tracks: LastFmTrack[] | null;
}) {
  if (!tracks) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <a href="https://last.fm/user/reselling" target="_blank" rel="noopener noreferrer" className="text-xl font-semibold hover:underline">Listening</a>
          <a href="/now/listening" className="text-sm text-foreground/50 hover:text-foreground">See more →</a>
        </div>
        <p className="text-sm text-foreground/50">
          Unable to load recent tracks.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <a href="https://last.fm/user/reselling" target="_blank" rel="noopener noreferrer" className="text-xl font-semibold hover:underline">Listening</a>
        <a href="/now/listening" className="text-sm text-foreground/50 hover:text-foreground">See more →</a>
      </div>
      <div className="space-y-3">
        {tracks.map((track, i) => {
          const isNowPlaying = track["@attr"]?.nowplaying === "true";
          const albumArt =
            track.image?.find((img) => img.size === "large")?.["#text"] || "";

          return (
            <a
              key={`${track.name}-${i}`}
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <div className="relative h-12 w-12 flex-shrink-0 rounded overflow-hidden bg-foreground/5">
                {albumArt && (
                  <Image
                    src={albumArt}
                    alt={track.album["#text"]}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate group-hover:underline">
                  {track.name}
                </p>
                <p className="text-xs text-foreground/50 truncate">
                  {track.artist["#text"]}
                </p>
              </div>
              <div className="flex-shrink-0">
                {isNowPlaying ? (
                  <span className="flex items-center gap-1.5 text-xs text-green-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    Now
                  </span>
                ) : track.date ? (
                  <span className="text-xs text-foreground/40">
                    {timeAgo(new Date(parseInt(track.date.uts) * 1000).toISOString())}
                  </span>
                ) : null}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
