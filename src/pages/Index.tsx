import { useState, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { MovieGrid } from "@/components/MovieGrid";
import { TrendingSection } from "@/components/TrendingSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Movie, FilterState } from "@/types/movie";
import { useEnhancedSearch } from "@/hooks/useEnhancedSearch";
import { useTrendingMovies } from "@/hooks/useTrendingMovies";
import { usePopularMovies } from "@/hooks/usePopularMovies";
import { geolocationService } from "@/services/geolocationApi";
import { Filter, AlertCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [userCountry, setUserCountry] = useState<string>('');
  const [userRegion, setUserRegion] = useState<string>('');
  const [regionPreference, setRegionPreference] = useState<{ region: string; languages: string[]; displayName: string } | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    genres: [],
    languages: [],
    platforms: [],
    minRating: 0,
  });

  const { searchResults, isLoading: isSearchLoading, handleSearch, searchQuery } = useEnhancedSearch();
  const { trendingMovies, isLoading: isTrendingLoading } = useTrendingMovies();
  const { popularMovies, isLoading: isPopularLoading } = usePopularMovies();

  // Fetch user's location and preferences on component mount
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const locationData = await geolocationService.getUserLocationData();
        setUserCountry(locationData.country);
        setUserRegion(locationData.region);
        setRegionPreference(locationData.regionPreference);
        
        console.log('Location data loaded:', locationData);
      } catch (error) {
        console.error('Failed to fetch user location:', error);
        setUserCountry('US');
      }
    };
    fetchUserLocation();
  }, []);

  // Determine which movies to display (search results or popular movies)
  const currentMovies = searchQuery ? searchResults : popularMovies;
  const isLoading = searchQuery ? isSearchLoading : isPopularLoading;

  // Filter movies based on search and filters
  useEffect(() => {
    let result = currentMovies;

    console.log('Total movies before regional filtering:', result.length);
    console.log('Region preference:', regionPreference);

    // Apply regional language preference sorting for India
    if (regionPreference && regionPreference.languages.length > 0) {
      const preferredLanguages = regionPreference.languages.map(lang => lang.toLowerCase());
      console.log('Preferred languages:', preferredLanguages);
      
      // Log languages found in movies
      const allLanguages = [...new Set(result.flatMap(movie => movie.languages))];
      console.log('All languages in movies:', allLanguages);
      
      // Language mapping for Tamil script to English
      const languageMap: { [key: string]: string[] } = {
        'தமிழ்': ['tamil', 'ta'],
        'english': ['english', 'en'],
        'हिन्दी': ['hindi', 'hi'],
        'తెలుగు': ['telugu', 'te'],
        'ಕನ್ನಡ': ['kannada', 'kn'],
        'മലയാളം': ['malayalam', 'ml']
      };
      
      const normalizeLanguage = (lang: string): string[] => {
        const lower = lang.toLowerCase();
        // Check if it's in the mapping
        if (languageMap[lang]) return languageMap[lang];
        // Find reverse mapping
        for (const [native, variants] of Object.entries(languageMap)) {
          if (variants.includes(lower)) return [lower, ...variants];
        }
        return [lower];
      };
      
      // Filter movies to prioritize regional languages first
      const regionalMovies = result.filter((movie) => {
        const hasPreferred = movie.languages.some(lang => {
          const normalizedMovieLangs = normalizeLanguage(lang);
          return preferredLanguages.some(prefLang => 
            normalizedMovieLangs.some(normalizedLang => 
              normalizedLang.includes(prefLang) || prefLang.includes(normalizedLang) || 
              (normalizedLang.startsWith(prefLang.substring(0, 3)) && prefLang.length > 3) ||
              (prefLang.startsWith(normalizedLang.substring(0, 3)) && normalizedLang.length > 3)
            )
          );
        });
        
        if (hasPreferred) {
          console.log(`Found regional movie: ${movie.title} - Languages: ${movie.languages.join(', ')}`);
        }
        
        return hasPreferred;
      });
      
      const otherMovies = result.filter((movie) => {
        return !movie.languages.some(lang => {
          const normalizedMovieLangs = normalizeLanguage(lang);
          return preferredLanguages.some(prefLang => 
            normalizedMovieLangs.some(normalizedLang => 
              normalizedLang.includes(prefLang) || prefLang.includes(normalizedLang) || 
              (normalizedLang.startsWith(prefLang.substring(0, 3)) && prefLang.length > 3) ||
              (prefLang.startsWith(normalizedLang.substring(0, 3)) && normalizedLang.length > 3)
            )
          );
        });
      });
      
      console.log(`Regional movies found: ${regionalMovies.length}`);
      console.log(`Other movies: ${otherMovies.length}`);
      
      // Prioritize regional movies first
      result = [...regionalMovies, ...otherMovies];
    }

    // Apply filters
    if (filters.genres.length > 0) {
      result = result.filter((movie) =>
        movie.genres.some((genre) => filters.genres.includes(genre))
      );
    }

    if (filters.languages.length > 0) {
      result = result.filter((movie) => {
        // Check if any of the movie's languages match the filter
        // Convert to lowercase for case-insensitive comparison
        const movieLanguages = movie.languages.map(lang => lang.toLowerCase());
        const filterLanguages = filters.languages.map(lang => lang.toLowerCase());
        
        return movieLanguages.some((lang) => 
          filterLanguages.some(filterLang => 
            lang.includes(filterLang) || filterLang.includes(lang)
          )
        );
      });
    }

    if (filters.platforms.length > 0) {
      result = result.filter((movie) =>
        movie.platforms.some((platform) => filters.platforms.includes(platform.name))
      );
    }

    if (filters.minRating > 0) {
      result = result.filter((movie) => movie.imdbRating >= filters.minRating);
    }

    console.log('Filtered movies:', result.length, 'from', currentMovies.length);
    console.log('Applied filters:', filters);
    setFilteredMovies(result);
  }, [currentMovies, filters, regionPreference]);

  // Only show API key warning when there are no results at all AND we're searching
  const showAPIKeyWarning = searchQuery && filteredMovies.length === 0 && !isLoading && searchResults.length === 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-primary">Binge Fast</h1>
              <p className="text-sm text-muted-foreground italic">Hit play, sit back, and Binge Fast.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <SearchBar onSearch={handleSearch} />
            </div>
            <ThemeToggle />
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* API Key Warning - only show when no results found at all */}
        {showAPIKeyWarning && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No results found for "{searchQuery}". Try a different search term or add your RapidAPI key for enhanced streaming data from{" "}
              <a 
                href="https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                RapidAPI Streaming Availability
              </a>.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'}`}>
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              className="w-full md:w-64"
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Trending Section - only show when not searching */}
            {!searchQuery && (
              <div className="mb-8">
                {isTrendingLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <TrendingSection movies={trendingMovies} />
                )}
              </div>
            )}

            {/* Search Results */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold">
                    {searchQuery ? `Enhanced Search Results for "${searchQuery}"` : "Popular Movies & Series"}
                  </h2>
                  {(regionPreference || userCountry) && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {regionPreference ? regionPreference.displayName : userCountry}
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isLoading ? "Loading..." : `${filteredMovies.length} results`}
                </div>
              </div>
              {searchQuery && filteredMovies.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Enhanced with direct streaming platform links
                </p>
              )}
              {regionPreference && !searchQuery && (
                <p className="text-sm text-muted-foreground mt-1">
                  Content prioritized for {regionPreference.languages.join(', ')} languages
                </p>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">
                    {searchQuery ? "Searching with enhanced streaming data..." : "Loading popular content..."}
                  </p>
                </div>
              </div>
            ) : (
              <MovieGrid movies={filteredMovies} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
