
const TMDB_API_KEY = 'cc3472b68490bae7b5c5771d0b606720';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export interface TMDBSearchResult {
  id: number;
  media_type: 'movie' | 'tv';
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
  spoken_languages: { iso_639_1: string; name: string }[];
  vote_average: number;
  vote_count: number;
  credits: {
    cast: { id: number; name: string; character: string }[];
    crew: { id: number; name: string; job: string }[];
  };
  'watch/providers': {
    results: {
      [countryCode: string]: {
        link?: string;
        flatrate?: { provider_id: number; provider_name: string; logo_path: string }[];
        rent?: { provider_id: number; provider_name: string; logo_path: string }[];
        buy?: { provider_id: number; provider_name: string; logo_path: string }[];
      };
    };
  };
}

export interface TMDBTVDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  first_air_date: string;
  number_of_seasons: number;
  genres: { id: number; name: string }[];
  spoken_languages: { iso_639_1: string; name: string }[];
  vote_average: number;
  vote_count: number;
  credits: {
    cast: { id: number; name: string; character: string }[];
    crew: { id: number; name: string; job: string }[];
  };
  'watch/providers': {
    results: {
      [countryCode: string]: {
        link?: string;
        flatrate?: { provider_id: number; provider_name: string; logo_path: string }[];
        rent?: { provider_id: number; provider_name: string; logo_path: string }[];
        buy?: { provider_id: number; provider_name: string; logo_path: string }[];
      };
    };
  };
}

class TMDBService {
  private async fetchFromTMDB(endpoint: string): Promise<any> {
    const response = await fetch(`${TMDB_BASE_URL}${endpoint}&api_key=${TMDB_API_KEY}`);
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }
    return response.json();
  }

  async searchMulti(query: string): Promise<TMDBSearchResult[]> {
    const data = await this.fetchFromTMDB(`/search/multi?query=${encodeURIComponent(query)}`);
    return data.results.filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv');
  }

  async getTrendingMovies(): Promise<TMDBSearchResult[]> {
    const data = await this.fetchFromTMDB(`/trending/movie/week?`);
    return data.results.map((item: any) => ({ ...item, media_type: 'movie' }));
  }

  async getTrendingTV(): Promise<TMDBSearchResult[]> {
    const data = await this.fetchFromTMDB(`/trending/tv/week?`);
    return data.results.map((item: any) => ({ ...item, media_type: 'tv' }));
  }

  async getPopularMovies(): Promise<TMDBSearchResult[]> {
    const data = await this.fetchFromTMDB(`/movie/popular?`);
    return data.results.map((item: any) => ({ ...item, media_type: 'movie' }));
  }

  async getPopularTV(): Promise<TMDBSearchResult[]> {
    const data = await this.fetchFromTMDB(`/tv/popular?`);
    return data.results.map((item: any) => ({ ...item, media_type: 'tv' }));
  }

  async getMovieDetails(id: number, region: string = 'US'): Promise<TMDBMovieDetails> {
    return this.fetchFromTMDB(`/movie/${id}?append_to_response=credits,watch/providers&watch_providers_region=${region}`);
  }

  async getTVDetails(id: number, region: string = 'US'): Promise<TMDBTVDetails> {
    return this.fetchFromTMDB(`/tv/${id}?append_to_response=credits,watch/providers&watch_providers_region=${region}`);
  }

  getImageUrl(path: string): string {
    return `${TMDB_IMAGE_BASE_URL}${path}`;
  }

  getPlatformLogo(logoPath: string): string {
    return `https://image.tmdb.org/t/p/w45${logoPath}`;
  }

  getStreamingLink(watchProviders: any, region: string = 'US'): string | null {
    const regionData = watchProviders.results?.[region];
    if (regionData?.link) {
      return regionData.link;
    }
    return null;
  }
}

export const tmdbService = new TMDBService();
