export interface HardcoverBook {
  title: string;
  slug: string;
  image?: { url: string };
  contributions: { author: { name: string } }[];
}

export interface HardcoverUserBook {
  book: HardcoverBook;
}
