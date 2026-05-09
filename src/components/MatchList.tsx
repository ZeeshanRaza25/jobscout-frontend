"use client";
import { useMemo, useState } from "react";
import type { JobMatch } from "@/lib/types";
import { JobMatchCard } from "./JobMatchCard";
import { cn } from "@/lib/utils";

type Filter = "all" | "recommended" | "strong";

export function MatchList({ matches }: { matches: JobMatch[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    let arr = [...matches];
    if (filter === "recommended") arr = arr.filter((m) => m.recommended);
    if (filter === "strong") arr = arr.filter((m) => m.score >= 70);
    arr.sort((a, b) => b.score - a.score);
    return arr;
  }, [matches, filter]);

  if (matches.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-6 py-12 text-center">
        <div className="font-display text-[18px] leading-tight text-[var(--fg)] mb-1.5">
          Matches will stream in.
        </div>
        <div className="text-[12.5px] text-[var(--fg-muted)]">
          Each result is graded against your profile in parallel.
        </div>
      </div>
    );
  }

  const counts: Record<Filter, number> = {
    all: matches.length,
    recommended: matches.filter((m) => m.recommended).length,
    strong: matches.filter((m) => m.score >= 70).length,
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5 px-1">
        {(["all", "recommended", "strong"] as Filter[]).map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "text-[11px] uppercase tracking-[0.12em] font-medium px-2.5 py-1 rounded-[var(--radius-sm)] transition-all duration-[var(--dur-fast)]",
                active
                  ? "bg-[var(--accent)] text-[var(--accent-fg)] shadow-[var(--shadow-xs)]"
                  : "bg-[var(--surface-2)] text-[var(--fg-muted)] hover:bg-[var(--surface-3)] hover:text-[var(--fg)]",
              )}
            >
              {f}
              <span
                className={cn(
                  "ml-1.5 tabular-nums",
                  active ? "opacity-60" : "text-[var(--fg-faint)]",
                )}
              >
                {counts[f]}
              </span>
            </button>
          );
        })}
        <span className="ml-auto text-[10px] text-[var(--fg-faint)] uppercase tracking-[0.14em] font-medium">
          {filtered.length} shown
        </span>
      </div>
      <div className="grid gap-2.5">
        {filtered.map((m, i) => (
          <JobMatchCard key={`${m.job.url}-${i}`} m={m} />
        ))}
      </div>
    </div>
  );
}
