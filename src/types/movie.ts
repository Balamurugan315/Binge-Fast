
export interface Platform {
  name: string;
  url: string;
  logo: string;
  logoUrl?: string;
  streamingLink?: string;
}

export interface Movie {
  id: string;
  title: string;
  type: "movie" | "series" | "short";
  poster: string;
  backdrop?: string;
  year: number;
  director: string;
  genres: string[];
  cast: string[];
  languages: string[];
  platforms: Platform[];
  regions: string[];
  imdbRating: number;
  imdbVotes?: number;
  rottenTomatoesRating?: number;
  synopsis: string;
  duration?: string;
  seasons?: number;
  trending?: boolean;
  streamingLink?: string;
}

export interface FilterState {
  genres: string[];
  languages: string[];
  platforms: string[];
  minRating: number;
}

export interface WatchlistItem {
  movieId: string;
  addedAt: Date;
}
