import { Metadata } from "next";
import { getRecentTracks } from "@/lib/lastfm";
import { getRecentlyWatched } from "@/lib/trakt";
import { getCurrentlyReading } from "@/lib/hardcover";
import { ListeningSection } from "@/components/now/listening-section";
import { WatchingSection } from "@/components/now/watching-section";
import { ReadingSection } from "@/components/now/reading-section";

export const metadata: Metadata = {
  title: "Now",
  description: "What I'm currently into.",
};

export default async function NowPage() {
  const [tracks, watched, reading] = await Promise.all([
    getRecentTracks(5),
    getRecentlyWatched(5),
    getCurrentlyReading(),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold">Now</h1>
        <p className="text-foreground/60 mt-2">
          What I&apos;m currently listening to, watching, and reading.
          Automatically updates throughout the day.
        </p>
      </div>

      <ListeningSection tracks={tracks} />
      <WatchingSection items={watched} />
      <ReadingSection books={reading} />
    </div>
  );
}
