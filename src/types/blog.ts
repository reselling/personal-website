export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  type: string;
  tags: string[];
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
