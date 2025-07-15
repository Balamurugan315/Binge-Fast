
import { useState } from "react";
import { Movie } from "@/types/movie";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MovieDetailsModal } from "./MovieDetailsModal";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Star, Heart, HeartOff, Play } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);

  const toggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie.id);
    }
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="relative">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              onClick={() => setShowDetails(true)}
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
            >
              <Play className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleWatchlist}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
          >
            {inWatchlist ? <HeartOff className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
          </Button>
          {movie.trending && (
            <Badge className="absolute top-2 left-2 bg-red-600 text-white">
              Trending
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2">{movie.title}</h3>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>{movie.year} • {movie.type}</span>
            <div className="flex items-center">
              <Star className="h-3 w-3 text-yellow-500 mr-1" />
              <span>{movie.imdbRating}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
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
                      className="w-5 h-5 rounded"
                    />
                  ) : (
                    <span className="text-lg">{platform.logo}</span>
                  )}
                </div>
              ))}
              {movie.platforms.length > 3 && (
                <span className="text-xs text-muted-foreground">+{movie.platforms.length - 3}</span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(true)}
              className="text-xs"
            >
              View
            </Button>
          </div>
        </CardContent>
      </Card>

      <MovieDetailsModal
        movie={movie}
        open={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </>
  );
};
