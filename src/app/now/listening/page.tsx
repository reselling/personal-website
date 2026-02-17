import { Metadata } from "next";
import Image from "next/image";
import { getMonthlyListeningData } from "@/lib/lastfm";

export const metadata: Metadata = {
  title: "Listening Stats",
  description: "What I've been listening to this month.",
};

export default async function ListeningStatsPage() {
  const data = await getMonthlyListeningData(10);
  const artists = data?.topArtists ?? [];
  const tracks = data?.topTracks ?? [];

  const monthName = new Date().toLocaleString("default", { month: "long" });

  return (
    <div className="space-y-10">
      <div>
        <a href="/now" className="text-sm text-foreground/50 hover:text-foreground">
          ← Back to Now
        </a>
        <h1 className="text-3xl font-bold mt-2">Listening</h1>
        <p className="text-foreground/60 mt-1">{monthName} overview</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Top Artists</h2>
        {artists.length > 0 ? (
          <div className="space-y-2">
            {artists.map((artist, i) => (
              <a
                key={artist.name}
                href={artist.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group py-1"
              >
                <span className="text-sm text-foreground/40 w-6 text-right font-mono">
                  {i + 1}
                </span>
                <div className="relative h-10 w-10 flex-shrink-0 rounded overflow-hidden bg-foreground/5">
                  {artist.image && (
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  )}
                </div>
                <span className="text-sm font-medium truncate flex-1 group-hover:underline">
                  {artist.name}
                </span>
                <span className="text-xs text-foreground/40 flex-shrink-0">
                  {artist.playcount} plays
                </span>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground/50">No data available.</p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Top Tracks</h2>
        {tracks.length > 0 ? (
          <div className="space-y-2">
            {tracks.map((track, i) => (
              <a
                key={`${track.name}-${track.artist}`}
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group py-1"
              >
                <span className="text-sm text-foreground/40 w-6 text-right font-mono">
                  {i + 1}
                </span>
                <div className="relative h-10 w-10 flex-shrink-0 rounded overflow-hidden bg-foreground/5">
                  {track.image && (
                    <Image
                      src={track.image}
                      alt={track.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:underline">
                    {track.name}
                  </p>
                  <p className="text-xs text-foreground/50 truncate">
                    {track.artist}
                  </p>
                </div>
                <span className="text-xs text-foreground/40 flex-shrink-0">
                  {track.playcount} plays
                </span>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground/50">No data available.</p>
        )}
      </section>
    </div>
  );
}
