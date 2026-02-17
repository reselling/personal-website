import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPosts, getPostBySlug, getPostBlocks } from "@/lib/notion";
import { NotionRenderer } from "@/components/blog/notion-renderer";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  if (!posts) return [];
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: `${post.title} — a thought by Mario Barraza`,
  };
}

async function TypedPostContent({ pageId }: { pageId: string }) {
  const blocks = await getPostBlocks(pageId);
  if (!blocks) {
    return <p className="text-sm text-foreground/50">Unable to load post content.</p>;
  }
  return <NotionRenderer blocks={blocks} />;
}

async function HandwrittenPostContent({ pageId }: { pageId: string }) {
  const blocks = await getPostBlocks(pageId);
  if (!blocks) {
    return <p className="text-sm text-foreground/50">Unable to load post content.</p>;
  }

  const images = blocks.filter((b) => b.type === "image" && b.imageUrl);

  if (images.length === 0) {
    return <p className="text-sm text-foreground/50">No content found.</p>;
  }

  return (
    <div className="space-y-6">
      {images.map((block) => (
        <figure
          key={block.id}
          className="border border-foreground/10 rounded-lg overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.imageUrl!}
            alt={block.imageCaption || "Handwritten note"}
            className="w-full"
          />
          {block.imageCaption && (
            <figcaption className="text-sm text-foreground/40 p-3 text-center italic">
              {block.imageCaption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

export default async function ThoughtPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="space-y-8">
      <header>
        <a
          href="/thoughts"
          className="text-sm text-foreground/50 hover:text-foreground"
        >
          ← Back to Thoughts
        </a>
        <h1 className="text-3xl font-bold mt-2">{post.title}</h1>
        <time className="text-sm text-foreground/40 mt-1 block font-mono">
          {formatDate(post.date)}
        </time>
      </header>

      {post.type === "typed" ? (
        <TypedPostContent pageId={post.id} />
      ) : (
        <HandwrittenPostContent pageId={post.id} />
      )}
    </article>
  );
}
