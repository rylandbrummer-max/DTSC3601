"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clapperboard, Compass, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/explore", label: "Explore", icon: Compass },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-secondary to-accent text-primary-foreground shadow-sm">
            <Clapperboard className="size-5" />
          </span>
          <span className="text-lg">
            Cine<span className="text-primary">Explore</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 p-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
