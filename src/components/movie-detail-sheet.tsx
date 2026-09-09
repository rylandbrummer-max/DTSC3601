"use client";

import { Calendar, Clock, DollarSign, Globe, Star, TrendingUp, Users } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Movie } from "@/lib/types";
import { formatMoney, formatRuntime } from "@/lib/format";

function DetailStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5">
      <Icon className="size-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export function MovieDetailSheet({
  movie,
  open,
  onOpenChange,
}: {
  movie: Movie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        {movie && (
          <ScrollArea className="h-full">
            <SheetHeader>
              <SheetTitle className="pr-8 text-xl">{movie.title}</SheetTitle>
              {movie.tagline && (
                <SheetDescription className="italic">&ldquo;{movie.tagline}&rdquo;</SheetDescription>
              )}
            </SheetHeader>

            <div className="space-y-5 px-4 pb-6">
              <div className="flex flex-wrap gap-1.5">
                {movie.genres.map((g) => (
                  <Badge key={g} variant="secondary">
                    {g}
                  </Badge>
                ))}
                {movie.status !== "Released" && <Badge variant="outline">{movie.status}</Badge>}
              </div>

              {movie.overview && (
                <p className="text-sm leading-relaxed text-muted-foreground">{movie.overview}</p>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <DetailStat
                  icon={Star}
                  label="Rating"
                  value={`${movie.voteAverage.toFixed(1)} / 10 (${movie.voteCount.toLocaleString()} votes)`}
                />
                <DetailStat
                  icon={Calendar}
                  label="Release date"
                  value={movie.releaseDate ?? "Unknown"}
                />
                <DetailStat icon={Clock} label="Runtime" value={formatRuntime(movie.runtime)} />
                <DetailStat icon={Globe} label="Language" value={movie.originalLanguage.toUpperCase()} />
                <DetailStat icon={DollarSign} label="Budget" value={formatMoney(movie.budget)} />
                <DetailStat icon={TrendingUp} label="Revenue" value={formatMoney(movie.revenue)} />
              </div>

              <Separator />

              {movie.productionCompanies.length > 0 && (
                <div className="space-y-1.5">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Users className="size-3.5" />
                    Production companies
                  </p>
                  <p className="text-sm">{movie.productionCompanies.join(", ")}</p>
                </div>
              )}

              {movie.keywords.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {movie.keywords.map((k) => (
                      <Badge key={k} variant="outline" className="font-normal text-xs">
                        {k}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {movie.homepage && (
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Visit official homepage →
                </a>
              )}
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}
