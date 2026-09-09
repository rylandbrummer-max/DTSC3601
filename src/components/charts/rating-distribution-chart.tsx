"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Movies",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function RatingDistributionChart({
  data,
}: {
  data: { bucket: string; count: number }[];
}) {
  return (
    <ChartContainer config={chartConfig} className="h-[280px] w-full">
      <BarChart data={data} margin={{ left: 0, right: 12, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="bucket" tickLine={false} axisLine={false} className="text-xs" />
        <YAxis tickLine={false} axisLine={false} width={32} className="text-xs" />
        <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
