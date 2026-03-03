export interface HardcoverBook {
  title: string;
  slug: string;
  image?: { url: string };
  contributions: { author: { name: string } }[];
}

export interface HardcoverUserBook {
  book: HardcoverBook;
  rating?: number | null;
}

export interface HardcoverUserBookWithDate {
  book: HardcoverBook;
  finished_at?: string;
  rating?: number | null;
}
