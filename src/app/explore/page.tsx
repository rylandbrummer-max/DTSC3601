import { MovieExplorer } from "@/components/movie-explorer";
import { getAllGenres, getYearRange } from "@/lib/movies-data";

export default function ExplorePage() {
  const genres = getAllGenres();
  const [minYear, maxYear] = getYearRange();

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Explore the dataset
        </h1>
        <p className="text-sm text-muted-foreground">
          Search, filter, and sort every movie in the TMDB 5000 dataset. Click a row for full
          details.
        </p>
      </div>
      <MovieExplorer genres={genres} minYear={minYear} maxYear={maxYear} />
    </div>
  );
}
