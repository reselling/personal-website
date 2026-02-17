export interface LastFmImage {
  "#text": string;
  size: "small" | "medium" | "large" | "extralarge";
}

export interface LastFmTrack {
  name: string;
  artist: { "#text": string };
  album: { "#text": string };
  image: LastFmImage[];
  url: string;
  "@attr"?: { nowplaying: string };
  date?: { uts: string; "#text": string };
}

export interface LastFmTopArtist {
  name: string;
  playcount: string;
  url: string;
  image: LastFmImage[];
  "@attr": { rank: string };
}

export interface LastFmTopTrack {
  name: string;
  playcount: string;
  url: string;
  artist: { name: string; url: string };
  image: LastFmImage[];
  "@attr": { rank: string };
}

export interface AggregatedArtist {
  name: string;
  playcount: number;
  image: string;
  url: string;
}

export interface AggregatedTrack {
  name: string;
  artist: string;
  playcount: number;
  image: string;
  url: string;
}
