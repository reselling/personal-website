import { NotionBlock, NotionRichText } from "@/types/blog";

function RichTextSpan({ segment }: { segment: NotionRichText }) {
  let content: React.ReactNode = segment.plainText;

  if (segment.annotations.code) {
    content = (
      <code className="bg-foreground/5 rounded px-1.5 py-0.5 font-mono text-sm">
        {content}
      </code>
    );
  }
  if (segment.annotations.bold) {
    content = <strong>{content}</strong>;
  }
  if (segment.annotations.italic) {
    content = <em>{content}</em>;
  }
  if (segment.annotations.strikethrough) {
    content = <s>{content}</s>;
  }
  if (segment.annotations.underline) {
    content = <u>{content}</u>;
  }
  if (segment.href) {
    content = (
      <a
        href={segment.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-foreground"
      >
        {content}
      </a>
    );
  }

  return <>{content}</>;
}

function RichText({ richText }: { richText?: NotionRichText[] }) {
  if (!richText || richText.length === 0) return null;
  return (
    <>
      {richText.map((segment, i) => (
        <RichTextSpan key={i} segment={segment} />
      ))}
    </>
  );
}

function BlockRenderer({ block }: { block: NotionBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-foreground/80 leading-relaxed">
          <RichText richText={block.richText} />
        </p>
      );

    case "heading_1":
      return (
        <h1 className="text-2xl font-bold mt-8 mb-3">
          <RichText richText={block.richText} />
        </h1>
      );

    case "heading_2":
      return (
        <h2 className="text-xl font-semibold mt-6 mb-2">
          <RichText richText={block.richText} />
        </h2>
      );

    case "heading_3":
      return (
        <h3 className="text-lg font-semibold mt-4 mb-2">
          <RichText richText={block.richText} />
        </h3>
      );

    case "code":
      return (
        <pre className="bg-foreground/5 rounded-lg p-4 overflow-x-auto text-sm font-mono">
          <code>
            <RichText richText={block.richText} />
          </code>
        </pre>
      );

    case "image":
      return (
        <figure className="my-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.imageUrl}
            alt={block.imageCaption || ""}
            className="w-full rounded-lg"
          />
          {block.imageCaption && (
            <figcaption className="text-sm text-foreground/40 mt-2 text-center italic">
              {block.imageCaption}
            </figcaption>
          )}
        </figure>
      );

    case "quote":
      return (
        <blockquote className="border-l-2 border-foreground/20 pl-4 italic text-foreground/70">
          <RichText richText={block.richText} />
        </blockquote>
      );

    case "divider":
      return <hr className="border-foreground/10 my-6" />;

    case "callout":
      return (
        <div className="bg-foreground/5 rounded-lg p-4 text-foreground/80">
          <RichText richText={block.richText} />
        </div>
      );

    default:
      return null;
  }
}

export function NotionRenderer({ blocks }: { blocks: NotionBlock[] }) {
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    // Group consecutive bulleted list items
    if (block.type === "bulleted_list_item") {
      const items: NotionBlock[] = [];
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        items.push(blocks[i]);
        i++;
      }
      elements.push(
        <ul
          key={`list-${items[0].id}`}
          className="list-disc list-inside space-y-1 text-foreground/80"
        >
          {items.map((item) => (
            <li key={item.id}>
              <RichText richText={item.richText} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Group consecutive numbered list items
    if (block.type === "numbered_list_item") {
      const items: NotionBlock[] = [];
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        items.push(blocks[i]);
        i++;
      }
      elements.push(
        <ol
          key={`list-${items[0].id}`}
          className="list-decimal list-inside space-y-1 text-foreground/80"
        >
          {items.map((item) => (
            <li key={item.id}>
              <RichText richText={item.richText} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    elements.push(<BlockRenderer key={block.id} block={block} />);
    i++;
  }

  return <div className="space-y-4">{elements}</div>;
}
