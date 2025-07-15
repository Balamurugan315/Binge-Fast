
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Movie } from "@/types/movie";
import { useTMDBSearch } from "./useTMDBSearch";
import { streamingAvailabilityService } from "@/services/streamingAvailabilityApi";
import { geolocationService } from "@/services/geolocationApi";
import { toast } from "@/hooks/use-toast";

export const useEnhancedSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { searchResults: tmdbResults, isLoading: tmdbLoading, handleSearch: tmdbHandleSearch } = useTMDBSearch();

  const { data: enhancedResults, isLoading: streamingLoading } = useQuery({
    queryKey: ['enhanced-search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];

      console.log('Searching streaming platforms for:', searchQuery);
      
      try {
        // Get user's country
        const userCountry = await geolocationService.getUserCountry();
        const streamingCountry = geolocationService.getStreamingCountry(userCountry);
        
        console.log('User country:', userCountry, 'Streaming country:', streamingCountry);
        
        // Get streaming availability data for user's country
        const streamingResults = await streamingAvailabilityService.searchByTitle(searchQuery, streamingCountry);
        console.log('Streaming results:', streamingResults);

        if (streamingResults.length === 0) {
          // Don't show error toast, just fall back to TMDB results
          // Only log for debugging
          console.log('No streaming results found, using TMDB results only');
          return tmdbResults;
        }

        // Enhance TMDB results with streaming data
        const enhancedMovies = await Promise.allSettled(
          tmdbResults.map(async (movie) => {
            try {
              // Find matching streaming result
              const streamingMatch = streamingResults.find(sr => 
                sr.title.toLowerCase().includes(movie.title.toLowerCase()) ||
                movie.title.toLowerCase().includes(sr.title.toLowerCase())
              );

              if (streamingMatch && streamingMatch.streamingInfo) {
                // Extract streaming platforms for user's country
                const streamingPlatforms = streamingAvailabilityService.extractStreamingPlatforms(
                  streamingMatch.streamingInfo, 
                  streamingCountry
                );

                if (streamingPlatforms.length > 0) {
                  // Update movie with streaming platforms
                  const enhancedMovie: Movie = {
                    ...movie,
                    platforms: streamingPlatforms.map(sp => ({
                      name: sp.name,
                      url: sp.link,
                      logo: sp.logo,
                      streamingLink: sp.link
                    })),
                    regions: [userCountry]
                  };

                  return enhancedMovie;
                }
              }

              // If no direct match, try to get detailed streaming info for first result
              if (streamingResults.length > 0 && streamingResults[0]) {
                const details = await streamingAvailabilityService.getShowDetails(
                  streamingResults[0].type,
                  streamingResults[0].id
                );

                if (details?.streamingInfo) {
                  const streamingPlatforms = streamingAvailabilityService.extractStreamingPlatforms(
                    details.streamingInfo,
                    streamingCountry
                  );

                  if (streamingPlatforms.length > 0) {
                    const enhancedMovie: Movie = {
                      ...movie,
                      platforms: streamingPlatforms.map(sp => ({
                        name: sp.name,
                        url: sp.link,
                        logo: sp.logo,
                        streamingLink: sp.link
                      })),
                      regions: [userCountry]
                    };

                    return enhancedMovie;
                  }
                }
              }

              return movie;
            } catch (error) {
              console.error('Error enhancing movie with streaming data:', error);
              return movie;
            }
          })
        );

        const results = enhancedMovies
          .filter((result): result is PromiseFulfilledResult<Movie> => 
            result.status === 'fulfilled'
          )
          .map(result => result.value);

        console.log('Enhanced search results:', results);
        return results;
      } catch (error) {
        console.error('Enhanced search error:', error);
        // Only show toast if there are no TMDB results either
        if (tmdbResults.length === 0) {
          toast({
            title: "Search Error",
            description: "No results found. Try a different search term.",
            variant: "destructive"
          });
        }
        return tmdbResults;
      }
    },
    enabled: !!searchQuery.trim() && tmdbResults.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    tmdbHandleSearch(query); // Also trigger TMDB search
  };

  return {
    searchResults: enhancedResults || tmdbResults,
    isLoading: tmdbLoading || streamingLoading,
    handleSearch,
    searchQuery
  };
};
