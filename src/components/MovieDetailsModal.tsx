
import { Movie } from "@/types/movie";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, Calendar, Clock, Users, Globe, ExternalLink, Play } from "lucide-react";

interface MovieDetailsModalProps {
  movie: Movie;
  open: boolean;
  onClose: () => void;
}

export const MovieDetailsModal = ({ movie, open, onClose }: MovieDetailsModalProps) => {
  const handleWatchNow = (platform: any) => {
    const url = platform.streamingLink || platform.url;
    window.open(url, '_blank');
  };

  const formatVotes = (votes?: number) => {
    if (!votes) return '';
    if (votes >= 1000000) {
      return `${(votes / 1000000).toFixed(1)}M`;
    } else if (votes >= 1000) {
      return `${(votes / 1000).toFixed(1)}K`;
    }
    return votes.toString();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{movie.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Poster */}
          <div className="md:col-span-1">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg"
            />
            
            {/* Main Watch Now Button */}
            {movie.streamingLink && (
              <Button
                onClick={() => window.open(movie.streamingLink, '_blank')}
                className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Now
              </Button>
            )}
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-4">
            {/* Basic Info */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {movie.year}
              </div>
              {movie.duration && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {movie.duration}
                </div>
              )}
              {movie.seasons && (
                <div className="flex items-center">
                  <span>{movie.seasons} Season{movie.seasons > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {/* IMDb Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <span className="font-semibold">{movie.imdbRating > 0 ? movie.imdbRating : 'Not rated yet'}</span>
                {movie.imdbRating > 0 && (
                  <>
                    <span className="text-muted-foreground ml-1">IMDb</span>
                    {movie.imdbVotes && (
                      <span className="text-sm text-muted-foreground ml-2">
                        ({formatVotes(movie.imdbVotes)} votes)
                      </span>
                    )}
                  </>
                )}
              </div>
              {movie.rottenTomatoesRating && (
                <div className="flex items-center">
                  <span className="font-semibold">{movie.rottenTomatoesRating}%</span>
                  <span className="text-muted-foreground ml-1">RT</span>
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>

            {/* Synopsis */}
            <div>
              <h3 className="font-semibold mb-2">Synopsis</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {movie.synopsis}
              </p>
            </div>

            <Separator />

            {/* Director */}
            <div>
              <h3 className="font-semibold mb-2">Director</h3>
              <p className="text-sm">{movie.director}</p>
            </div>

            {/* Cast */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Cast
              </h3>
              <p className="text-sm text-muted-foreground">
                {movie.cast.slice(0, 3).join(", ")}
              </p>
            </div>

            {/* Languages */}
            <div>
              <h3 className="font-semibold mb-2">Available Languages</h3>
              <div className="flex flex-wrap gap-2">
                {movie.languages.map((language) => (
                  <Badge key={language} variant="outline">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Regions */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                Available Regions
              </h3>
              <p className="text-sm text-muted-foreground">
                {movie.regions.join(", ")}
              </p>
            </div>

            <Separator />

            {/* Streaming Platforms */}
            <div>
              <h3 className="font-semibold mb-3">Available On Streaming Platforms</h3>
              {movie.platforms.length > 0 ? (
                <div className="space-y-3">
                  {movie.platforms.map((platform) => (
                    <div key={platform.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {platform.logoUrl ? (
                          <img 
                            src={platform.logoUrl} 
                            alt={platform.name}
                            className="w-8 h-8 rounded"
                          />
                        ) : (
                          <span className="text-2xl">{platform.logo}</span>
                        )}
                        <div>
                          <p className="font-medium">{platform.name}</p>
                          <p className="text-xs text-muted-foreground">Streaming Platform</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleWatchNow(platform)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Watch on {platform.name}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground text-center">
                    This content may not be available in your region.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
