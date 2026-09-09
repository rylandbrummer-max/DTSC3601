"use client";

import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis, ZAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function formatMoney(value: number) {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

export function BudgetRevenueScatter({
  data,
}: {
  data: { title: string; budget: number; revenue: number; rating: number }[];
}) {
  return (
    <ChartContainer config={chartConfig} className="h-[340px] w-full">
      <ScatterChart margin={{ left: 8, right: 12, top: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="budget"
          name="Budget"
          tickFormatter={formatMoney}
          tickLine={false}
          axisLine={false}
          className="text-xs"
        />
        <YAxis
          type="number"
          dataKey="revenue"
          name="Revenue"
          tickFormatter={formatMoney}
          tickLine={false}
          axisLine={false}
          width={56}
          className="text-xs"
        />
        <ZAxis type="number" dataKey="rating" range={[30, 220]} name="Rating" />
        <ChartTooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => payload?.[0]?.payload?.title ?? ""}
              formatter={(value, name) => [
                name === "Rating" ? (value as number).toFixed(1) : formatMoney(value as number),
                name,
              ]}
            />
          }
        />
        <Scatter data={data} fill="var(--color-revenue)" fillOpacity={0.65} />
      </ScatterChart>
    </ChartContainer>
  );
}
