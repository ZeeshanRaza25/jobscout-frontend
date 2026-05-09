"use client";
import {
  FileText,
  UserSearch,
  ListChecks,
  Globe,
  Filter as FilterIcon,
  Gauge,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { Step } from "@/lib/types";
import { GraphDiagram } from "@/components/GraphDiagram";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const NODE_META: Record<string, { icon: LucideIcon; label: string }> = {
  ingest_cv:       { icon: FileText,   label: "Ingest CV" },
  extract_profile: { icon: UserSearch, label: "Extract Profile" },
  plan_queries:    { icon: ListChecks, label: "Plan Queries" },
  search:          { icon: Globe,      label: "Search Web" },
  filter:          { icon: FilterIcon, label: "Filter Relevance" },
  score:           { icon: Gauge,      label: "Score Matches" },
  rank:            { icon: Trophy,     label: "Rank Results" },
};

export function TracePanel({
  steps,
  running,
}: {
  steps: Step[];
  running: boolean;
}) {
  const activeNode =
    [...steps]
      .reverse()
      .find(
        (s) =>
          s.status === "start" &&
          !steps.some(
            (e) => e.status === "end" && e.node === s.node && e.ts > s.ts,
          ),
      )?.node ?? null;

  // Aggregate steps into per-node lifecycle events
  const lifecycle = steps.reduce<
    Record<string, { start?: number; end?: number }>
  >((acc, s) => {
    if (!acc[s.node]) acc[s.node] = {};
    if (s.status === "start") acc[s.node].start = s.ts;
    else acc[s.node].end = s.ts;
    return acc;
  }, {});

  const ordered = Object.entries(lifecycle).sort(
    ([, a], [, b]) => (a.start ?? 0) - (b.start ?? 0),
  );

  return (
    <Card className="overflow-hidden lg:sticky lg:top-20 self-start p-0">
      <div className="px-5 pt-5 pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between mb-3">
          <div className="eyebrow">Pipeline graph</div>
          {running && (
            <span className="inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.14em] text-[var(--warn-fg)] font-medium">
              <span className="size-1.5 rounded-full bg-[var(--warn-fg)] animate-pulse-dot" />
              live
            </span>
          )}
        </div>
        <div className="mermaid-diagram rounded-[var(--radius)] bg-[var(--bg)] border border-[var(--border-subtle)] p-3 [&_svg]:max-w-full">
          <GraphDiagram activeNode={activeNode} />
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="eyebrow mb-3">Trace</div>
        {ordered.length === 0 ? (
          <div className="text-[12.5px] text-[var(--fg-subtle)] italic">
            Waiting for first event…
          </div>
        ) : (
          <ol className="space-y-2">
            {ordered.map(([node, lc]) => {
              const meta = NODE_META[node] ?? { icon: FileText, label: node };
              const Icon = meta.icon;
              const done = lc.end != null;
              const active = lc.start != null && !done;
              const dur =
                done && lc.start
                  ? `${((lc.end! - lc.start) / 1000).toFixed(1)}s`
                  : null;
              return (
                <li
                  key={node}
                  className="flex items-center gap-2.5 text-[13px]"
                >
                  <span
                    className={cn(
                      "size-7 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0 ring-1 ring-inset transition-colors",
                      active &&
                        "bg-[var(--warn-bg)] text-[var(--warn-fg)] ring-[var(--warn-bd)]",
                      done &&
                        "bg-[var(--success-bg)] text-[var(--success-fg)] ring-[var(--success-bd)]",
                      !active && !done &&
                        "bg-[var(--surface-2)] text-[var(--fg-faint)] ring-[var(--border)]",
                    )}
                  >
                    <Icon className="size-3.5" strokeWidth={1.75} />
                  </span>
                  <span
                    className={cn(
                      "flex-1 truncate",
                      active
                        ? "text-[var(--fg)] font-medium"
                        : done
                          ? "text-[var(--fg)]"
                          : "text-[var(--fg-subtle)]",
                    )}
                  >
                    {meta.label}
                  </span>
                  <span className="text-[10.5px] text-[var(--fg-subtle)] tabular-nums font-mono">
                    {active ? "running" : (dur ?? "")}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </Card>
  );
}
