"""Convert data/tmdb_5000_movies.csv into the cleaned JSON the app reads from.

Usage: python3 scripts/build_data.py
Output: src/data/movies.json
"""

import csv
import json
import os

SRC = os.path.join(os.path.dirname(__file__), "..", "data", "tmdb_5000_movies.csv")
DEST = os.path.join(os.path.dirname(__file__), "..", "src", "data", "movies.json")


def names(field: str) -> list[str]:
    try:
        arr = json.loads(field) if field else []
        return [x["name"] for x in arr]
    except Exception:
        return []


def main() -> None:
    with open(SRC, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    out = []
    for row in rows:
        try:
            budget = int(row["budget"] or 0)
            revenue = int(row["revenue"] or 0)
            runtime = float(row["runtime"]) if row["runtime"] else None
            popularity = float(row["popularity"]) if row["popularity"] else 0.0
            vote_avg = float(row["vote_average"]) if row["vote_average"] else 0.0
            vote_count = int(row["vote_count"]) if row["vote_count"] else 0
        except ValueError:
            continue

        release_date = row["release_date"] or None
        release_year = int(release_date[:4]) if release_date else None

        out.append(
            {
                "id": int(row["id"]),
                "title": row["title"] or row["original_title"],
                "originalTitle": row["original_title"],
                "tagline": row["tagline"] or None,
                "overview": row["overview"] or None,
                "genres": names(row["genres"]),
                "keywords": names(row["keywords"])[:10],
                "productionCompanies": names(row["production_companies"]),
                "productionCountries": names(row["production_countries"]),
                "spokenLanguages": names(row["spoken_languages"]),
                "originalLanguage": row["original_language"],
                "releaseDate": release_date,
                "releaseYear": release_year,
                "status": row["status"],
                "homepage": row["homepage"] or None,
                "budget": budget,
                "revenue": revenue,
                "profit": revenue - budget,
                "runtime": runtime,
                "popularity": round(popularity, 3),
                "voteAverage": vote_avg,
                "voteCount": vote_count,
            }
        )

    os.makedirs(os.path.dirname(DEST), exist_ok=True)
    with open(DEST, "w", encoding="utf-8") as f:
        json.dump(out, f, separators=(",", ":"), ensure_ascii=False)

    print(f"Wrote {len(out)} movies to {DEST}")


if __name__ == "__main__":
    main()
