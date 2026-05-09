"use client";
import type { JobMatch, JobResult, Step } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PIPELINE = [
  "ingest_cv",
  "extract_profile",
  "plan_queries",
  "search",
  "filter",
  "score",
  "rank",
] as const;

function nodeProgress(steps: Step[]): { done: Set<string>; active: string | null } {
  const done = new Set<string>();
  let active: string | null = null;
  for (const s of steps) {
    if (s.status === "end") done.add(s.node);
    else if (s.status === "start") active = s.node;
  }
  if (active && done.has(active)) active = null;
  return { done, active };
}

export function ProgressStrip({
  steps,
  jobs,
  matches,
  ranked,
  running,
}: {
  steps: Step[];
  jobs: JobResult[];
  matches: JobMatch[];
  ranked: JobMatch[];
  running: boolean;
}) {
  const { done, active } = nodeProgress(steps);
  const pct = Math.min(100, Math.round((done.size / PIPELINE.length) * 100));
  const visibleMatches = ranked.length > 0 ? ranked : matches;
  const recommended = visibleMatches.filter((m) => m.recommended).length;
  const avg =
    visibleMatches.length > 0
      ? Math.round(
          visibleMatches.reduce((s, m) => s + m.score, 0) /
            visibleMatches.length,
        )
      : null;
  const top =
    visibleMatches.length > 0
      ? Math.max(...visibleMatches.map((m) => m.score))
      : null;

  return (
    <Card className="overflow-hidden p-0">
      {/* Pipeline progress */}
      <div className="px-5 pt-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="eyebrow">Pipeline</div>
          <div className="text-[12.5px] text-[var(--fg-muted)] tabular-nums font-mono">
            {done.size}/{PIPELINE.length} · {pct}%
          </div>
        </div>
        <div className="relative h-1 rounded-full bg-[var(--surface-3)] overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-[var(--accent)] rounded-full transition-all duration-500 ease-[var(--ease-out)]"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="grid grid-cols-7 gap-1 mt-3">
          {PIPELINE.map((node) => {
            const isDone = done.has(node);
            const isActive = active === node;
            return (
              <div
                key={node}
                className={cn(
                  "text-[10.5px] tracking-tight text-center truncate transition-colors",
                  isActive
                    ? "text-[var(--warn-fg)] font-semibold"
                    : isDone
                      ? "text-[var(--fg)]"
                      : "text-[var(--fg-faint)]",
                )}
                title={node}
              >
                {node.replace("_", " ")}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-[var(--border-subtle)] divide-x divide-[var(--border-subtle)]">
        <Stat
          label="Found"
          value={jobs.length}
          accent={running && jobs.length === 0}
        />
        <Stat
          label="Scored"
          value={visibleMatches.length}
          accent={running && matches.length > 0}
        />
        <Stat
          label="Recommended"
          value={recommended}
          highlight={recommended > 0}
        />
        <Stat
          label={top !== null ? "Top score" : "Avg score"}
          value={top ?? avg ?? "—"}
          highlight={top !== null && top >= 80}
        />
      </div>
    </Card>
  );
}

function Stat({
  label,
  value,
  highlight,
  accent,
}: {
  label: string;
  value: number | string;
  highlight?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="px-5 py-3.5">
      <div
        className={cn(
          "text-[26px] font-display leading-none tabular-nums tracking-tight",
          highlight ? "text-[var(--success-fg)]" : "text-[var(--fg)]",
          accent && "animate-pulse-dot",
        )}
      >
        {value}
      </div>
      <div className="eyebrow mt-1.5">{label}</div>
    </div>
  );
}
