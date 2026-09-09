import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "primary",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  accent?: "primary" | "secondary" | "accent";
}) {
  const accentClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/15 text-secondary",
    accent: "bg-accent/20 text-accent-foreground",
  } as const;

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-center gap-4 px-5 py-4">
        <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", accentClasses[accent])}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="truncate text-2xl font-semibold tracking-tight">{value}</p>
          {sub && <p className="truncate text-xs text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
