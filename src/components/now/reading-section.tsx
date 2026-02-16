import Image from "next/image";
import { HardcoverUserBook } from "@/types/hardcover";

export function ReadingSection({
  books,
}: {
  books: HardcoverUserBook[] | null;
}) {
  if (!books || books.length === 0) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <a href="https://hardcover.app/@resell" target="_blank" rel="noopener noreferrer" className="text-xl font-semibold hover:underline">Reading</a>
          <a href="/now/reading" className="text-sm text-foreground/50 hover:text-foreground">See more →</a>
        </div>
        <p className="text-sm text-foreground/50">
          {books === null
            ? "Unable to load reading list."
            : "Not reading anything right now."}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <a href="https://hardcover.app/@resell" target="_blank" rel="noopener noreferrer" className="text-xl font-semibold hover:underline">Reading</a>
        <a href="/now/reading" className="text-sm text-foreground/50 hover:text-foreground">See more →</a>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {books.map((item) => {
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
    </section>
  );
}
