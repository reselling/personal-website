export interface HardcoverBook {
  title: string;
  slug: string;
  image?: { url: string };
  contributions: { author: { name: string } }[];
}

export interface HardcoverUserBook {
  book: HardcoverBook;
}

export interface HardcoverUserBookWithDate {
  book: HardcoverBook;
  finished_at?: string;
}
