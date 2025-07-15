
import { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";

interface MovieGridProps {
  movies: Movie[];
}

export const MovieGrid = ({ movies }: MovieGridProps) => {
  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No movies found matching your criteria.</p>
        <p className="text-muted-foreground text-sm mt-2">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};
