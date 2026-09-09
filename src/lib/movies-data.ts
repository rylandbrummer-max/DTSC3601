import raw from "@/data/movies.json";
import type { Movie, MovieQuery, MovieQueryResult, SortKey } from "@/lib/types";

const movies = raw as unknown as Movie[];

export function getAllMovies(): Movie[] {
  return movies;
}

export function getMovieById(id: number): Movie | undefined {
  return movies.find((m) => m.id === id);
}

let genreCache: string[] | null = null;
export function getAllGenres(): string[] {
  if (genreCache) return genreCache;
  const set = new Set<string>();
  for (const m of movies) for (const g of m.genres) set.add(g);
  genreCache = Array.from(set).sort();
  return genreCache;
}

export function getYearRange(): [number, number] {
  const years = movies.map((m) => m.releaseYear).filter((y): y is number => !!y);
  return [Math.min(...years), Math.max(...years)];
}

function compareBy(key: SortKey, a: Movie, b: Movie): number {
  if (key === "title") return a.title.localeCompare(b.title);
  const av = (a[key] ?? -Infinity) as number;
  const bv = (b[key] ?? -Infinity) as number;
  return av - bv;
}

export function queryMovies(query: MovieQuery): MovieQueryResult {
  const {
    q = "",
    genre = "",
    yearMin,
    yearMax,
    ratingMin,
    sort = "popularity",
    dir = "desc",
    page = 1,
    pageSize = 24,
  } = query;

  let filtered = movies;

  const term = q.trim().toLowerCase();
  if (term) {
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(term) ||
        m.overview?.toLowerCase().includes(term) ||
        m.keywords.some((k) => k.toLowerCase().includes(term)) ||
        m.productionCompanies.some((c) => c.toLowerCase().includes(term))
    );
  }

  if (genre) {
    filtered = filtered.filter((m) => m.genres.includes(genre));
  }

  if (yearMin != null) {
    filtered = filtered.filter((m) => (m.releaseYear ?? 0) >= yearMin);
  }
  if (yearMax != null) {
    filtered = filtered.filter((m) => (m.releaseYear ?? 9999) <= yearMax);
  }
  if (ratingMin != null) {
    filtered = filtered.filter((m) => m.voteAverage >= ratingMin);
  }

  const sorted = [...filtered].sort((a, b) => {
    const cmp = compareBy(sort, a, b);
    return dir === "asc" ? cmp : -cmp;
  });

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize);

  return { items, total, page: safePage, pageSize, totalPages };
}

export interface DashboardStats {
  totalMovies: number;
  avgRuntime: number;
  avgRating: number;
  totalRevenue: number;
  genreCounts: { genre: string; count: number }[];
  moviesPerYear: { year: number; count: number }[];
  ratingDistribution: { bucket: string; count: number }[];
  budgetVsRevenue: { title: string; budget: number; revenue: number; rating: number }[];
  topRated: Movie[];
  topRevenue: Movie[];
  languageCounts: { language: string; count: number }[];
}

export function getDashboardStats(): DashboardStats {
  const totalMovies = movies.length;

  const withRuntime = movies.filter((m) => m.runtime && m.runtime > 0);
  const avgRuntime =
    withRuntime.reduce((sum, m) => sum + (m.runtime ?? 0), 0) / (withRuntime.length || 1);

  const rated = movies.filter((m) => m.voteCount > 0);
  const avgRating = rated.reduce((sum, m) => sum + m.voteAverage, 0) / (rated.length || 1);

  const totalRevenue = movies.reduce((sum, m) => sum + m.revenue, 0);

  const genreMap = new Map<string, number>();
  for (const m of movies) {
    for (const g of m.genres) genreMap.set(g, (genreMap.get(g) ?? 0) + 1);
  }
  const genreCounts = Array.from(genreMap, ([genre, count]) => ({ genre, count })).sort(
    (a, b) => b.count - a.count
  );

  const yearMap = new Map<number, number>();
  for (const m of movies) {
    if (!m.releaseYear || m.releaseYear < 1970) continue;
    yearMap.set(m.releaseYear, (yearMap.get(m.releaseYear) ?? 0) + 1);
  }
  const moviesPerYear = Array.from(yearMap, ([year, count]) => ({ year, count })).sort(
    (a, b) => a.year - b.year
  );

  const buckets = ["0-2", "2-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10"];
  const bucketBounds: [number, number][] = [
    [0, 2],
    [2, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [8, 9],
    [9, 10],
  ];
  const ratingDistribution = buckets.map((bucket, i) => {
    const [lo, hi] = bucketBounds[i];
    const count = rated.filter(
      (m) => m.voteAverage >= lo && (i === buckets.length - 1 ? m.voteAverage <= hi : m.voteAverage < hi)
    ).length;
    return { bucket, count };
  });

  const budgetVsRevenue = movies
    .filter((m) => m.budget > 100000 && m.revenue > 100000)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 200)
    .map((m) => ({ title: m.title, budget: m.budget, revenue: m.revenue, rating: m.voteAverage }));

  const topRated = [...rated]
    .filter((m) => m.voteCount >= 500)
    .sort((a, b) => b.voteAverage - a.voteAverage)
    .slice(0, 8);

  const topRevenue = [...movies].sort((a, b) => b.revenue - a.revenue).slice(0, 8);

  const langMap = new Map<string, number>();
  for (const m of movies) langMap.set(m.originalLanguage, (langMap.get(m.originalLanguage) ?? 0) + 1);
  const languageCounts = Array.from(langMap, ([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    totalMovies,
    avgRuntime,
    avgRating,
    totalRevenue,
    genreCounts,
    moviesPerYear,
    ratingDistribution,
    budgetVsRevenue,
    topRated,
    topRevenue,
    languageCounts,
  };
}
