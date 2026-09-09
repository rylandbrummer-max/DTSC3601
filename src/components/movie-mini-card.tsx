import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Movie } from "@/lib/types";

export function MovieMiniCard({ movie, metric }: { movie: Movie; metric?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-card/50 px-3.5 py-3 transition-colors hover:bg-muted/40">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium leading-tight">{movie.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {movie.releaseYear ?? "—"}
          {movie.genres[0] ? ` · ${movie.genres[0]}` : ""}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {metric ? (
          <Badge variant="secondary" className="whitespace-nowrap font-mono text-xs">
            {metric}
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1 whitespace-nowrap font-mono text-xs">
            <Star className="size-3 fill-current" />
            {movie.voteAverage.toFixed(1)}
          </Badge>
        )}
      </div>
    </div>
  );
}
