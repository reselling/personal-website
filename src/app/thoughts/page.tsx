import { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/notion";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Thoughts",
  description: "Thoughts and notes.",
};

export const revalidate = 60;

export default async function ThoughtsPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Thoughts</h1>
        <p className="text-foreground/60 mt-2">Thoughts and notes.</p>
      </div>

      {!posts || posts.length === 0 ? (
        <p className="text-sm text-foreground/50">No posts yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/thoughts/${post.slug}`}
              className="block group"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-medium group-hover:underline truncate">
                  {post.title}
                </h2>
                <time className="text-sm text-foreground/40 flex-shrink-0 font-mono">
                  {formatDate(post.date)}
                </time>
              </div>
              {(post.type || post.tags.length > 0) && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {post.type && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/70">
                      {post.type}
                    </span>
                  )}
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {post.description && (
                <p className="text-sm text-foreground/50 mt-1">
                  {post.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
