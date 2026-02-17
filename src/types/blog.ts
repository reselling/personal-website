export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  type: "typed" | "handwritten";
  published: boolean;
}

export interface NotionBlock {
  id: string;
  type: string;
  richText?: NotionRichText[];
  language?: string;
  imageUrl?: string;
  imageCaption?: string;
  children?: NotionBlock[];
}

export interface NotionRichText {
  plainText: string;
  href: string | null;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
  };
}
