
import { useQuery } from "@tanstack/react-query";
import { Movie } from "@/types/movie";
import { tmdbService } from "@/services/tmdbApi";
import { convertMovieToMovieInterface, convertTVToMovieInterface } from "@/utils/tmdbConverter";

export const usePopularMovies = () => {
  const { data: popularMovies, isLoading, error } = useQuery({
    queryKey: ['popular-movies'],
    queryFn: async () => {
      console.log('Fetching popular content...');
      
      // Get popular movies and TV shows
      const [popularMovies, popularTV] = await Promise.all([
        tmdbService.getPopularMovies(),
        tmdbService.getPopularTV()
      ]);

      // Mix movies and TV shows for better variety
      const allPopular = [...popularMovies.slice(0, 25), ...popularTV.slice(0, 25)];
      
      // Get detailed info for popular items
      const detailedResults = await Promise.allSettled(
        allPopular.map(async (item) => {
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
        .map(result => result.value);

      console.log('Popular movies and series fetched:', movies.length);
      return movies;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return {
    popularMovies: popularMovies || [],
    isLoading,
    error
  };
};
