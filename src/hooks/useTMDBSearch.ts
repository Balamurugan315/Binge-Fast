
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Movie } from "@/types/movie";
import { tmdbService } from "@/services/tmdbApi";
import { convertMovieToMovieInterface, convertTVToMovieInterface } from "@/utils/tmdbConverter";
import { geolocationService } from "@/services/geolocationApi";
import { toast } from "@/hooks/use-toast";

export const useTMDBSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['tmdb-search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      
      console.log('Searching TMDB for:', searchQuery);
      
      // Get user's country for region-specific data
      const userCountry = await geolocationService.getUserCountry();
      const tmdbRegion = geolocationService.getTMDBRegion(userCountry);
      
      let results = await tmdbService.searchMulti(searchQuery);
      console.log('TMDB search results for "' + searchQuery + '":', results);
      
      // If no results and query contains language names, try without the language
      if (results.length === 0) {
        const languageWords = ['tamil', 'telugu', 'hindi', 'kannada', 'malayalam', 'bengali', 'marathi', 'gujarati'];
        let modifiedQuery = searchQuery.toLowerCase();
        
        languageWords.forEach(lang => {
          modifiedQuery = modifiedQuery.replace(new RegExp(`\\b${lang}\\b`, 'gi'), '').trim();
        });
        
        if (modifiedQuery && modifiedQuery !== searchQuery.toLowerCase()) {
          console.log('Trying search without language suffix:', modifiedQuery);
          results = await tmdbService.searchMulti(modifiedQuery);
          console.log('Secondary search results:', results);
        }
      }
      
      // Get detailed info for top 20 results (increased from 10)
      const detailedResults = await Promise.allSettled(
        results.slice(0, 20).map(async (item) => {
          try {
            if (item.media_type === 'movie') {
              const movieDetails = await tmdbService.getMovieDetails(item.id, tmdbRegion);
              return convertMovieToMovieInterface(movieDetails, tmdbRegion);
            } else if (item.media_type === 'tv') {
              const tvDetails = await tmdbService.getTVDetails(item.id, tmdbRegion);
              return convertTVToMovieInterface(tvDetails, tmdbRegion);
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

      console.log('Final converted movies for "' + searchQuery + '":', movies);
      console.log('Number of movies found:', movies.length);
      return movies;
    },
    enabled: !!searchQuery.trim(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    if (!query.trim()) {
      setIsSearching(false);
      return;
    }

    try {
      // The query will automatically trigger due to the queryKey change
      console.log('Starting search for:', query);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search movies. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchResults: searchResults || [],
    isLoading: isLoading || isSearching,
    error,
    handleSearch,
    searchQuery
  };
};
