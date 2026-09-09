# CineExplore

A Next.js + shadcn/ui application for exploring the [TMDB 5000 Movies](data/tmdb_5000_movies.csv) dataset — 4,800+ movies with budgets, revenue, ratings, genres, and more.

## Features

- **Dashboard** (`/`) — summary stats, top genres, releases per year, rating distribution, and a budget-vs-revenue chart.
- **Explore** (`/explore`) — a searchable, filterable, sortable table of every movie. Filter by genre, release year range, and minimum rating; sort by popularity, rating, revenue, budget, profit, runtime, or title. Click any row for full details in a side panel.
- Server-side filtering/pagination via `/api/movies`, so the client never has to download the whole dataset.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Regenerating the dataset

The app reads from the pre-built `src/data/movies.json`. To rebuild it from the raw CSV (e.g. after editing `data/tmdb_5000_movies.csv`):

```bash
python3 scripts/build_data.py
```

## Tech stack

- [Next.js](https://nextjs.org) (App Router)
- [shadcn/ui](https://ui.shadcn.com) (Base UI primitives) + Tailwind CSS v4
- [Recharts](https://recharts.org) for charts

## Deploy on Vercel

This is a standard Next.js app — push it to a Git repo and [import it on Vercel](https://vercel.com/new). No environment variables are required; the dataset ships as a static JSON file.
