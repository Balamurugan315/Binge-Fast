
import { Movie, Platform } from "@/types/movie";
import { TMDBMovieDetails, TMDBTVDetails, tmdbService } from "@/services/tmdbApi";

const platformMapping: { [key: string]: { name: string; logo: string } } = {
  'Netflix': { name: 'Netflix', logo: '🎬' },
  'Amazon Prime Video': { name: 'Prime Video', logo: '📺' },
  'Disney Plus': { name: 'Disney+', logo: '🏰' },
  'Hotstar': { name: 'Hotstar', logo: '⭐' },
  'Disney+ Hotstar': { name: 'Hotstar', logo: '⭐' },
  'Hulu': { name: 'Hulu', logo: '🟢' },
  'HBO Max': { name: 'HBO Max', logo: '🎭' },
  'Apple TV Plus': { name: 'Apple TV+', logo: '🍎' },
  'Paramount Plus': { name: 'Paramount+', logo: '⛰️' },
  'YouTube': { name: 'YouTube', logo: '📹' },
  'Sony LIV': { name: 'Sony LIV', logo: '📱' },
  'ZEE5': { name: 'ZEE5', logo: '🎪' },
  'Voot': { name: 'Voot', logo: '🔷' },
  'MX Player': { name: 'MX Player', logo: '🎮' },
};

function convertWatchProvidersToPlatforms(watchProviders: any, region: string): { platforms: Platform[], streamingLink: string | null } {
  const platforms: Platform[] = [];
  const streamingLink = tmdbService.getStreamingLink(watchProviders, region);
  
  const regionData = watchProviders.results?.[region];
  
  if (!regionData) {
    return { platforms: [], streamingLink };
  }
  
  const allProviders = [
    ...(regionData.flatrate || []),
    ...(regionData.rent || []),
    ...(regionData.buy || [])
  ];

  const uniqueProviders = allProviders.filter((provider, index, self) => 
    index === self.findIndex(p => p.provider_id === provider.provider_id)
  );

  uniqueProviders.forEach(provider => {
    const platformInfo = platformMapping[provider.provider_name] || {
      name: provider.provider_name,
      logo: '📱'
    };

    platforms.push({
      name: platformInfo.name,
      url: streamingLink || `https://www.${provider.provider_name.toLowerCase().replace(/\s+/g, '')}.com`,
      logo: platformInfo.logo,
      logoUrl: provider.logo_path ? tmdbService.getPlatformLogo(provider.logo_path) : undefined,
      streamingLink: streamingLink || undefined
    });
  });

  return { platforms, streamingLink };
}

export function convertMovieToMovieInterface(movie: TMDBMovieDetails, region: string = 'US'): Movie {
  const director = movie.credits.crew.find(person => person.job === 'Director')?.name || 'Unknown';
  const cast = movie.credits.cast.slice(0, 5).map(actor => actor.name);
  const { platforms, streamingLink } = convertWatchProvidersToPlatforms(movie['watch/providers'], region);
  
  return {
    id: movie.id.toString(),
    title: movie.title,
    type: 'movie',
    poster: movie.poster_path ? tmdbService.getImageUrl(movie.poster_path) : '/placeholder.svg',
    backdrop: movie.backdrop_path ? tmdbService.getImageUrl(movie.backdrop_path) : undefined,
    year: new Date(movie.release_date).getFullYear(),
    director,
    genres: movie.genres.map(genre => genre.name),
    cast,
    languages: movie.spoken_languages.map(lang => lang.name),
    platforms,
    regions: platforms.length > 0 ? [region] : [],
    imdbRating: Math.round(movie.vote_average * 10) / 10,
    imdbVotes: movie.vote_count,
    synopsis: movie.overview,
    duration: `${movie.runtime} min`,
    trending: movie.vote_average > 7.5,
    streamingLink: streamingLink || undefined
  };
}

export function convertTVToMovieInterface(tv: TMDBTVDetails, region: string = 'US'): Movie {
  const director = tv.credits.crew.find(person => person.job === 'Director' || person.job === 'Creator')?.name || 'Unknown';
  const cast = tv.credits.cast.slice(0, 5).map(actor => actor.name);
  const { platforms, streamingLink } = convertWatchProvidersToPlatforms(tv['watch/providers'], region);
  
  return {
    id: tv.id.toString(),
    title: tv.name,
    type: 'series',
    poster: tv.poster_path ? tmdbService.getImageUrl(tv.poster_path) : '/placeholder.svg',
    backdrop: tv.backdrop_path ? tmdbService.getImageUrl(tv.backdrop_path) : undefined,
    year: new Date(tv.first_air_date).getFullYear(),
    director,
    genres: tv.genres.map(genre => genre.name),
    cast,
    languages: tv.spoken_languages.map(lang => lang.name),
    platforms,
    regions: platforms.length > 0 ? [region] : [],
    imdbRating: Math.round(tv.vote_average * 10) / 10,
    imdbVotes: tv.vote_count,
    synopsis: tv.overview,
    seasons: tv.number_of_seasons,
    trending: tv.vote_average > 7.5,
    streamingLink: streamingLink || undefined
  };
}
