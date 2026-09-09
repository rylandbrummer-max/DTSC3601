"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MovieDetailSheet } from "@/components/movie-detail-sheet";
import type { Movie, MovieQueryResult, SortDir, SortKey } from "@/lib/types";
import { formatMoney, formatRuntime } from "@/lib/format";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "popularity", label: "Popularity" },
  { value: "voteAverage", label: "Rating" },
  { value: "voteCount", label: "Vote count" },
  { value: "revenue", label: "Revenue" },
  { value: "budget", label: "Budget" },
  { value: "profit", label: "Profit" },
  { value: "releaseYear", label: "Release year" },
  { value: "runtime", label: "Runtime" },
  { value: "title", label: "Title (A–Z)" },
];

const PAGE_SIZE = 20;

export function MovieExplorer({
  genres,
  minYear,
  maxYear,
}: {
  genres: string[];
  minYear: number;
  maxYear: number;
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [genre, setGenre] = useState<string>("all");
  const [yearRange, setYearRange] = useState<[number, number]>([minYear, maxYear]);
  const [ratingMin, setRatingMin] = useState(0);
  const [sort, setSort] = useState<SortKey>("popularity");
  const [dir, setDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  const [result, setResult] = useState<MovieQueryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Movie | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      setLoading(true);

      const params = new URLSearchParams();
      if (debouncedSearch) params.set("q", debouncedSearch);
      if (genre !== "all") params.set("genre", genre);
      params.set("yearMin", String(yearRange[0]));
      params.set("yearMax", String(yearRange[1]));
      if (ratingMin > 0) params.set("ratingMin", String(ratingMin));
      params.set("sort", sort);
      params.set("dir", dir);
      params.set("page", String(page));
      params.set("pageSize", String(PAGE_SIZE));

      try {
        const res = await fetch(`/api/movies?${params.toString()}`, {
          signal: controller.signal,
        });
        const data: MovieQueryResult = await res.json();
        setResult(data);
        setLoading(false);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setLoading(false);
      }
    }

    run();
    return () => controller.abort();
  }, [debouncedSearch, genre, yearRange, ratingMin, sort, dir, page]);

  const toggleDir = useCallback(() => {
    setDir((d) => (d === "asc" ? "desc" : "asc"));
    setPage(1);
  }, []);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (genre !== "all") n++;
    if (yearRange[0] !== minYear || yearRange[1] !== maxYear) n++;
    if (ratingMin > 0) n++;
    return n;
  }, [genre, yearRange, ratingMin, minYear, maxYear]);

  const resetFilters = () => {
    setGenre("all");
    setYearRange([minYear, maxYear]);
    setRatingMin(0);
    setPage(1);
  };

  const openMovie = (movie: Movie) => {
    setSelected(movie);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/60 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, overview, keywords, studio…"
              className="pl-9"
            />
          </div>

          <Select
            value={genre}
            onValueChange={(v) => {
              setGenre(v ?? "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="All genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All genres</SelectItem>
              {genres.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Select
              value={sort}
              onValueChange={(v) => {
                setSort((v ?? "popularity") as SortKey);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={toggleDir} aria-label="Toggle sort direction">
              {dir === "asc" ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
            </Button>
          </div>
        </div>

        <div className="grid gap-5 pt-1 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="size-3.5" />
                Release year
              </span>
              <span className="font-mono text-foreground">
                {yearRange[0]} – {yearRange[1]}
              </span>
            </div>
            <Slider
              min={minYear}
              max={maxYear}
              step={1}
              value={yearRange}
              onValueChange={(v) => {
                const [a, b] = v as number[];
                setYearRange([a, b]);
                setPage(1);
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Star className="size-3.5" />
                Minimum rating
              </span>
              <span className="font-mono text-foreground">{ratingMin.toFixed(1)}+</span>
            </div>
            <Slider
              min={0}
              max={10}
              step={0.5}
              value={[ratingMin]}
              onValueChange={(v) => {
                setRatingMin((v as number[])[0]);
                setPage(1);
              }}
            />
          </div>
        </div>

        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 pt-1">
            <Badge variant="secondary">{activeFilterCount} active filter{activeFilterCount > 1 ? "s" : ""}</Badge>
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6 gap-1 px-2 text-xs">
              <X className="size-3" />
              Clear
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="min-w-[220px]">Title</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="min-w-[180px]">Genres</TableHead>
                <TableHead className="text-right">Rating</TableHead>
                <TableHead className="text-right">Runtime</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading &&
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading && result?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No movies match these filters.
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                result?.items.map((movie) => (
                  <TableRow
                    key={movie.id}
                    onClick={() => openMovie(movie)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">{movie.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {movie.releaseYear ?? "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {movie.genres.slice(0, 2).map((g) => (
                          <Badge key={g} variant="secondary" className="font-normal">
                            {g}
                          </Badge>
                        ))}
                        {movie.genres.length > 2 && (
                          <Badge variant="outline" className="font-normal">
                            +{movie.genres.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <span className="inline-flex items-center gap-1">
                        <Star className="size-3.5 fill-accent text-accent" />
                        {movie.voteAverage.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {formatRuntime(movie.runtime)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {movie.budget ? formatMoney(movie.budget) : "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {movie.revenue ? formatMoney(movie.revenue) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {result && (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Showing {(result.page - 1) * result.pageSize + 1}–
            {Math.min(result.page * result.pageSize, result.total)} of{" "}
            {result.total.toLocaleString()} movies
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={result.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {result.page} / {result.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={result.page >= result.totalPages}
              onClick={() => setPage((p) => Math.min(result.totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <MovieDetailSheet movie={selected} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
