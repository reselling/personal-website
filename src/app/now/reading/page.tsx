import { Metadata } from "next";
import Image from "next/image";
import { getCurrentlyReading, getRecentlyFinished } from "@/lib/hardcover";

export const metadata: Metadata = {
  title: "Reading Stats",
  description: "What I'm reading and what I've finished this month.",
};

export default async function ReadingStatsPage() {
  const [reading, finished] = await Promise.all([
    getCurrentlyReading(),
    getRecentlyFinished(),
  ]);

  const monthName = new Date().toLocaleString("default", { month: "long" });

  return (
    <div className="space-y-10">
      <div>
        <a href="/now" className="text-sm text-foreground/50 hover:text-foreground">
          ← Back to Now
        </a>
        <h1 className="text-3xl font-bold mt-2">Reading</h1>
        <p className="text-foreground/60 mt-1">{monthName} overview</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Currently Reading</h2>
        {reading && reading.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {reading.map((item) => {
              const authors = item.book.contributions
                .map((c) => c.author.name)
                .join(", ");

              return (
                <a
                  key={item.book.slug}
                  href={`https://hardcover.app/books/${item.book.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-32 space-y-2 group"
                >
                  <div className="relative aspect-[2/3] rounded overflow-hidden bg-foreground/5">
                    {item.book.image?.url ? (
                      <Image
                        src={item.book.image.url}
                        alt={item.book.title}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-foreground/30">
                        No cover
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate group-hover:underline">
                      {item.book.title}
                    </p>
                    <p className="text-xs text-foreground/50 truncate">
                      {authors}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-foreground/50">
            {reading === null
              ? "Unable to load reading list."
              : "Not reading anything right now."}
          </p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Finished This Month</h2>
        {finished && finished.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {finished.map((item) => {
              const authors = item.book.contributions
                .map((c) => c.author.name)
                .join(", ");

              return (
                <a
                  key={item.book.slug}
                  href={`https://hardcover.app/books/${item.book.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-32 space-y-2 group"
                >
                  <div className="relative aspect-[2/3] rounded overflow-hidden bg-foreground/5">
                    {item.book.image?.url ? (
                      <Image
                        src={item.book.image.url}
                        alt={item.book.title}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-foreground/30">
                        No cover
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate group-hover:underline">
                      {item.book.title}
                    </p>
                    <p className="text-xs text-foreground/50 truncate">
                      {authors}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-foreground/50">No books finished this month yet.</p>
        )}
      </section>
    </div>
  );
}
