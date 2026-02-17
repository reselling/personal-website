import { Client } from "@notionhq/client";
import { BlogPost, NotionBlock, NotionRichText } from "@/types/blog";

function getClient(): Client | null {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    console.error("Notion: Missing API key");
    return null;
  }
  return new Client({ auth: apiKey });
}

export async function getPublishedPosts(): Promise<BlogPost[] | null> {
  const notion = getClient();
  const databaseId = process.env.NOTION_BLOG_DATABASE_ID;

  if (!notion || !databaseId) return null;

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Published",
        checkbox: { equals: true },
      },
      sorts: [{ property: "Date", direction: "descending" }],
    });

    const posts: BlogPost[] = [];

    for (const page of response.results) {
      if (!("properties" in page)) continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const props = page.properties as any;

      const title = props.Title?.title?.[0]?.plain_text ?? "";
      const slug = props.Slug?.rich_text?.[0]?.plain_text ?? "";
      const description = props.Description?.rich_text?.[0]?.plain_text ?? "";
      const date = props.Date?.date?.start ?? "";
      const type = props.Type?.select?.name ?? "typed";
      const tags: string[] = (props.Tags?.multi_select ?? []).map(
        (t: { name: string }) => t.name
      );

      if (!slug || !date) continue;

      posts.push({ id: page.id, title, slug, description, date, type, tags, published: true });
    }

    return posts;
  } catch (error) {
    console.error("Notion published posts error:", error);
    return null;
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const notion = getClient();
  const databaseId = process.env.NOTION_BLOG_DATABASE_ID;

  if (!notion || !databaseId) return null;

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          { property: "Published", checkbox: { equals: true } },
          { property: "Slug", rich_text: { equals: slug } },
        ],
      },
    });

    const page = response.results[0];
    if (!page || !("properties" in page)) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props = page.properties as any;

    const title = props.Title?.title?.[0]?.plain_text ?? "";
    const postSlug = props.Slug?.rich_text?.[0]?.plain_text ?? "";
    const description = props.Description?.rich_text?.[0]?.plain_text ?? "";
    const date = props.Date?.date?.start ?? "";
    const type = props.Type?.select?.name ?? "typed";
    const tags: string[] = (props.Tags?.multi_select ?? []).map(
      (t: { name: string }) => t.name
    );

    if (!postSlug || !date) return null;

    return { id: page.id, title, slug: postSlug, description, date, type, tags, published: true };
  } catch (error) {
    console.error("Notion post by slug error:", error);
    return null;
  }
}

export async function getPostBlocks(
  pageId: string
): Promise<NotionBlock[] | null> {
  const notion = getClient();
  if (!notion) return null;

  try {
    const blocks: NotionBlock[] = [];
    let cursor: string | undefined;

    do {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      });

      for (const block of response.results) {
        if (!("type" in block)) continue;
        const transformed = transformBlock(block);
        if (transformed) blocks.push(transformed);
      }

      cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
    } while (cursor);

    return blocks;
  } catch (error) {
    console.error("Notion post blocks error:", error);
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformBlock(block: any): NotionBlock | null {
  const type: string = block.type;
  const data = block[type];

  switch (type) {
    case "paragraph":
    case "heading_1":
    case "heading_2":
    case "heading_3":
    case "bulleted_list_item":
    case "numbered_list_item":
    case "quote":
    case "callout":
      return {
        id: block.id,
        type,
        richText: transformRichText(data?.rich_text ?? []),
      };

    case "code":
      return {
        id: block.id,
        type,
        richText: transformRichText(data?.rich_text ?? []),
        language: data?.language ?? "plain text",
      };

    case "image": {
      let imageUrl = "";
      if (data?.type === "file") {
        imageUrl = data.file?.url ?? "";
      } else if (data?.type === "external") {
        imageUrl = data.external?.url ?? "";
      }
      const caption = data?.caption?.[0]?.plain_text ?? "";
      return {
        id: block.id,
        type,
        imageUrl,
        imageCaption: caption || undefined,
      };
    }

    case "divider":
      return { id: block.id, type };

    default:
      return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformRichText(richTextArray: any[]): NotionRichText[] {
  return richTextArray.map((item) => ({
    plainText: item.plain_text ?? "",
    href: item.href ?? null,
    annotations: {
      bold: item.annotations?.bold ?? false,
      italic: item.annotations?.italic ?? false,
      strikethrough: item.annotations?.strikethrough ?? false,
      underline: item.annotations?.underline ?? false,
      code: item.annotations?.code ?? false,
    },
  }));
}
