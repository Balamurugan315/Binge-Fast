
const RAPIDAPI_KEY = '42fb4ea654msh73cab5522d2a693p105459jsn70923751635f';
const RAPIDAPI_HOST = 'streaming-availability.p.rapidapi.com';
const BASE_URL = 'https://streaming-availability.p.rapidapi.com';

export interface StreamingSearchResult {
  id: string;
  title: string;
  type: 'movie' | 'series';
  year?: number;
  posterURLs?: {
    '92'?: string;
    '154'?: string;
    '185'?: string;
    '342'?: string;
  };
  streamingInfo?: {
    [country: string]: {
      [platform: string]: Array<{
        link: string;
        videoQuality?: string;
        audios?: Array<{ language: string; region: string }>;
      }>;
    };
  };
}

export interface StreamingDetails {
  id: string;
  title: string;
  type: 'movie' | 'series';
  streamingInfo: {
    [country: string]: {
      [platform: string]: Array<{
        link: string;
        videoQuality?: string;
        audios?: Array<{ language: string; region: string }>;
      }>;
    };
  };
}

export interface StreamingPlatform {
  name: string;
  link: string;
  logo: string;
}

const platformLogos: { [key: string]: string } = {
  netflix: '🎬',
  prime: '📺',
  hotstar: '⭐',
  zee5: '🎪',
  sonyliv: '📱',
  voot: '🔷',
  mxplayer: '🎮',
  youtube: '📹',
  hulu: '🟢',
  disney: '🏰',
  hbo: '🎭',
  apple: '🍎',
  paramount: '⛰️'
};

const platformNames: { [key: string]: string } = {
  netflix: 'Netflix',
  prime: 'Prime Video',
  hotstar: 'Disney+ Hotstar',
  zee5: 'ZEE5',
  sonyliv: 'Sony LIV',
  voot: 'Voot',
  mxplayer: 'MX Player',
  youtube: 'YouTube',
  hulu: 'Hulu',
  disney: 'Disney+',
  hbo: 'HBO Max',
  apple: 'Apple TV+',
  paramount: 'Paramount+'
};

class StreamingAvailabilityService {
  private async makeRequest(endpoint: string): Promise<any> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Streaming API error: ${response.statusText}`);
    }

    return response.json();
  }

  async searchByTitle(title: string, country: string = 'IN'): Promise<StreamingSearchResult[]> {
    try {
      const movieResults = await this.makeRequest(
        `/search/title?title=${encodeURIComponent(title)}&country=${country}&show_type=movie`
      );
      
      const seriesResults = await this.makeRequest(
        `/search/title?title=${encodeURIComponent(title)}&country=${country}&show_type=series`
      );

      return [...(movieResults || []), ...(seriesResults || [])];
    } catch (error) {
      console.error('Error searching streaming platforms:', error);
      return [];
    }
  }

  async getShowDetails(type: 'movie' | 'series', id: string): Promise<StreamingDetails | null> {
    try {
      const result = await this.makeRequest(`/shows/${type}/${id}`);
      return result;
    } catch (error) {
      console.error('Error fetching show details:', error);
      return null;
    }
  }

  extractStreamingPlatforms(streamingInfo: any, country: string = 'in'): StreamingPlatform[] {
    const platforms: StreamingPlatform[] = [];
    const countryData = streamingInfo?.[country];

    if (!countryData) return platforms;

    Object.entries(countryData).forEach(([platformKey, platformData]: [string, any]) => {
      if (Array.isArray(platformData) && platformData.length > 0) {
        const link = platformData[0]?.link;
        if (link) {
          platforms.push({
            name: platformNames[platformKey] || platformKey,
            link: link,
            logo: platformLogos[platformKey] || '📱'
          });
        }
      }
    });

    return platforms;
  }
}

export const streamingAvailabilityService = new StreamingAvailabilityService();
