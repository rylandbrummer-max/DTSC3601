import { NextRequest, NextResponse } from "next/server";
import { queryMovies } from "@/lib/movies-data";
import type { SortDir, SortKey } from "@/lib/types";

const SORT_KEYS: SortKey[] = [
  "popularity",
  "voteAverage",
  "voteCount",
  "revenue",
  "budget",
  "profit",
  "releaseYear",
  "runtime",
  "title",
];

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const sortParam = sp.get("sort");
  const sort: SortKey = SORT_KEYS.includes(sortParam as SortKey) ? (sortParam as SortKey) : "popularity";
  const dirParam = sp.get("dir");
  const dir: SortDir = dirParam === "asc" ? "asc" : "desc";

  const result = queryMovies({
    q: sp.get("q") ?? undefined,
    genre: sp.get("genre") ?? undefined,
    yearMin: sp.get("yearMin") ? Number(sp.get("yearMin")) : undefined,
    yearMax: sp.get("yearMax") ? Number(sp.get("yearMax")) : undefined,
    ratingMin: sp.get("ratingMin") ? Number(sp.get("ratingMin")) : undefined,
    sort,
    dir,
    page: sp.get("page") ? Number(sp.get("page")) : 1,
    pageSize: sp.get("pageSize") ? Number(sp.get("pageSize")) : 24,
  });

  return NextResponse.json(result);
}
