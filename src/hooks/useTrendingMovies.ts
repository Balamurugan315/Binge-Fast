
import { useQuery } from "@tanstack/react-query";
import { Movie } from "@/types/movie";
import { tmdbService } from "@/services/tmdbApi";
import { convertMovieToMovieInterface, convertTVToMovieInterface } from "@/utils/tmdbConverter";

export const useTrendingMovies = () => {
  const { data: trendingMovies, isLoading, error } = useQuery({
    queryKey: ['trending-movies'],
    queryFn: async () => {
      console.log('Fetching trending content...');
      
      // Get trending movies and TV shows
      const [trendingMovies, trendingTV] = await Promise.all([
        tmdbService.getTrendingMovies(),
        tmdbService.getTrendingTV()
      ]);

      // Mix movies and TV shows for better variety
      const allTrending = [...trendingMovies.slice(0, 10), ...trendingTV.slice(0, 10)];
      
      // Get detailed info for trending items
      const detailedResults = await Promise.allSettled(
        allTrending.map(async (item) => {
          try {
            if (item.media_type === 'movie') {
              const movieDetails = await tmdbService.getMovieDetails(item.id);
              return convertMovieToMovieInterface(movieDetails);
            } else if (item.media_type === 'tv') {
              const tvDetails = await tmdbService.getTVDetails(item.id);
              return convertTVToMovieInterface(tvDetails);
            }
            return null;
          } catch (error) {
            console.error(`Error fetching details for ${item.media_type} ${item.id}:`, error);
            return null;
          }
        })
      );

      const movies: Movie[] = detailedResults
        .filter((result): result is PromiseFulfilledResult<Movie> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => ({ ...result.value, trending: true }));

      console.log('Trending movies and series fetched:', movies.length);
      return movies;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return {
    trendingMovies: trendingMovies || [],
    isLoading,
    error
  };
};
