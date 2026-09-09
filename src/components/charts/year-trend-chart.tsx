"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Releases",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function YearTrendChart({ data }: { data: { year: number; count: number }[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[280px] w-full">
      <AreaChart data={data} margin={{ left: 0, right: 12, top: 8 }}>
        <defs>
          <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.7} />
            <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="year"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={4}
          className="text-xs"
        />
        <YAxis tickLine={false} axisLine={false} width={32} className="text-xs" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="count"
          type="monotone"
          fill="url(#fillCount)"
          stroke="var(--color-count)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
