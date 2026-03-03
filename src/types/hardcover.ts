export interface HardcoverBook {
  title: string;
  slug: string;
  pages?: number | null;
  image?: { url: string };
  contributions: { author: { name: string } }[];
}

export interface HardcoverUserBook {
  book: HardcoverBook;
  rating?: number | null;
  current_page?: number | null;
}

export interface HardcoverUserBookWithDate {
  book: HardcoverBook;
  finished_at?: string;
  rating?: number | null;
}
