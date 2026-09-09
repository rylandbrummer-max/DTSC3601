export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  tagline: string | null;
  overview: string | null;
  genres: string[];
  keywords: string[];
  productionCompanies: string[];
  productionCountries: string[];
  spokenLanguages: string[];
  originalLanguage: string;
  releaseDate: string | null;
  releaseYear: number | null;
  status: string;
  homepage: string | null;
  budget: number;
  revenue: number;
  profit: number;
  runtime: number | null;
  popularity: number;
  voteAverage: number;
  voteCount: number;
}

export type SortKey =
  | "popularity"
  | "voteAverage"
  | "voteCount"
  | "revenue"
  | "budget"
  | "profit"
  | "releaseYear"
  | "runtime"
  | "title";

export type SortDir = "asc" | "desc";

export interface MovieQuery {
  q?: string;
  genre?: string;
  yearMin?: number;
  yearMax?: number;
  ratingMin?: number;
  sort?: SortKey;
  dir?: SortDir;
  page?: number;
  pageSize?: number;
}

export interface MovieQueryResult {
  items: Movie[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
