import { Metadata } from "next";
import { getMonthlyTopArtists, getMonthlyTopTracks } from "@/lib/lastfm";

export const metadata: Metadata = {
  title: "Listening Stats",
  description: "What I've been listening to this month.",
};

export default async function ListeningStatsPage() {
  const [artists, tracks] = await Promise.all([
    getMonthlyTopArtists(10),
    getMonthlyTopTracks(10),
  ]);

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
        {artists && artists.length > 0 ? (
          <div className="space-y-2">
            {artists.map((artist) => (
              <a
                key={artist.name}
                href={artist.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group py-1"
              >
                <span className="text-sm text-foreground/40 w-6 text-right font-mono">
                  {artist["@attr"].rank}
                </span>
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
        {tracks && tracks.length > 0 ? (
          <div className="space-y-2">
            {tracks.map((track) => (
              <a
                key={`${track.name}-${track.artist.name}`}
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group py-1"
              >
                <span className="text-sm text-foreground/40 w-6 text-right font-mono">
                  {track["@attr"].rank}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:underline">
                    {track.name}
                  </p>
                  <p className="text-xs text-foreground/50 truncate">
                    {track.artist.name}
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
