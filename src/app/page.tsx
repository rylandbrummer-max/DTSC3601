import Link from "next/link";
import { Clapperboard, Film, Star, TrendingUp, Timer, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { MovieMiniCard } from "@/components/movie-mini-card";
import { GenreBarChart } from "@/components/charts/genre-bar-chart";
import { YearTrendChart } from "@/components/charts/year-trend-chart";
import { RatingDistributionChart } from "@/components/charts/rating-distribution-chart";
import { BudgetRevenueScatter } from "@/components/charts/budget-revenue-scatter";
import { getDashboardStats } from "@/lib/movies-data";
import { formatMoney, formatRuntime } from "@/lib/format";

export default function Home() {
  const stats = getDashboardStats();

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <section className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary via-primary/90 to-secondary px-6 py-10 text-primary-foreground shadow-sm sm:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Clapperboard className="size-3.5" />
              TMDB 5000 Movie Dataset
            </span>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Explore {stats.totalMovies.toLocaleString()} movies at a glance
            </h1>
            <p className="text-sm text-primary-foreground/85 sm:text-base">
              Budgets, box office revenue, ratings, and genres from the classic TMDB 5000 dataset —
              visualized and ready to filter.
            </p>
          </div>
          <Button
            render={<Link href="/explore" />}
            size="lg"
            variant="secondary"
            className="w-fit shadow-md"
          >
            Explore the data
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total movies"
          value={stats.totalMovies.toLocaleString()}
          icon={Film}
          accent="primary"
        />
        <StatCard
          label="Avg. rating"
          value={stats.avgRating.toFixed(2)}
          sub="out of 10"
          icon={Star}
          accent="accent"
        />
        <StatCard
          label="Combined revenue"
          value={formatMoney(stats.totalRevenue)}
          icon={TrendingUp}
          accent="secondary"
        />
        <StatCard
          label="Avg. runtime"
          value={formatRuntime(stats.avgRuntime)}
          icon={Timer}
          accent="primary"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top genres</CardTitle>
            <CardDescription>Number of movies tagged with each genre</CardDescription>
          </CardHeader>
          <CardContent>
            <GenreBarChart data={stats.genreCounts} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Releases per year</CardTitle>
            <CardDescription>Movie releases since 1970</CardDescription>
          </CardHeader>
          <CardContent>
            <YearTrendChart data={stats.moviesPerYear} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Rating distribution</CardTitle>
            <CardDescription>Audience score buckets (0–10)</CardDescription>
          </CardHeader>
          <CardContent>
            <RatingDistributionChart data={stats.ratingDistribution} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Budget vs. revenue</CardTitle>
            <CardDescription>Top 200 highest-grossing movies · bubble size = rating</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetRevenueScatter data={stats.budgetVsRevenue} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Top rated</CardTitle>
            <CardDescription>500+ votes, highest average score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.topRated.map((m) => (
              <MovieMiniCard key={m.id} movie={m} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Box office champions</CardTitle>
            <CardDescription>Highest grossing worldwide revenue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.topRevenue.map((m) => (
              <MovieMiniCard key={m.id} movie={m} metric={formatMoney(m.revenue)} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Original languages</CardTitle>
            <CardDescription>Most common language of production</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.languageCounts.map((l) => (
              <div
                key={l.language}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-card/50 px-3.5 py-2.5 text-sm"
              >
                <span className="font-medium uppercase">{l.language}</span>
                <span className="text-muted-foreground">{l.count.toLocaleString()} movies</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
