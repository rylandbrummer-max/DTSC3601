"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Movies",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function GenreBarChart({ data }: { data: { genre: string; count: number }[] }) {
  const top = data.slice(0, 10);
  return (
    <ChartContainer config={chartConfig} className="h-[320px] w-full">
      <BarChart data={top} layout="vertical" margin={{ left: 8, right: 24 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="genre"
          tickLine={false}
          axisLine={false}
          width={92}
          className="text-xs"
        />
        <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={[0, 6, 6, 0]}>
          <LabelList dataKey="count" position="right" className="fill-foreground text-xs" />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
