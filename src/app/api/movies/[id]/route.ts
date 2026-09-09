import { NextResponse } from "next/server";
import { getMovieById } from "@/lib/movies-data";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = getMovieById(Number(id));
  if (!movie) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(movie);
}
