
import { useState } from "react";
import { Movie } from "@/types/movie";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MovieDetailsModal } from "./MovieDetailsModal";
import { Star, TrendingUp, Clock, Calendar, Eye } from "lucide-react";

interface TrendingSectionProps {
  movies: Movie[];
}

export const TrendingSection = ({ movies }: TrendingSectionProps) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  if (movies.length === 0) return null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-red-500" />
            Trending Now
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {movies.slice(0, 9).map((movie) => (
              <div key={movie.id} className="flex space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-20 h-28 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2 mb-1">{movie.title}</h4>
                  
                  <div className="flex items-center text-xs text-muted-foreground mb-2">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                    <span>{movie.imdbRating}</span>
                    <span className="mx-1">•</span>
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{movie.year}</span>
                  </div>

                  <div className="flex items-center text-xs text-muted-foreground mb-2">
                    <Badge variant="outline" className="text-xs mr-2">
                      {movie.type === 'series' ? 'TV Series' : 'Movie'}
                    </Badge>
                    {movie.duration && (
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{movie.duration}</span>
                      </div>
                    )}
                    {movie.seasons && (
                      <div className="flex items-center">
                        <span>{movie.seasons} seasons</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {movie.genres.slice(0, 2).map((genre) => (
                      <Badge key={genre} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {movie.platforms.slice(0, 3).map((platform) => (
                        <div key={platform.name} className="flex items-center" title={platform.name}>
                          {platform.logoUrl ? (
                            <img 
                              src={platform.logoUrl} 
                              alt={platform.name}
                              className="w-4 h-4 rounded"
                            />
                          ) : (
                            <span className="text-sm">{platform.logo}</span>
                          )}
                        </div>
                      ))}
                      {movie.platforms.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{movie.platforms.length - 3}</span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMovie(movie)}
                      className="text-xs h-6 px-2"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          open={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
};
