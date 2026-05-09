"use client";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";

export function QueryList({
  queries,
  rationale,
}: {
  queries: string[];
  rationale: string;
}) {
  if (queries.length === 0) return null;
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="eyebrow">Planned searches</div>
        <span className="eyebrow text-[var(--fg-faint)] tabular-nums">
          {queries.length} queries
        </span>
      </div>
      {rationale && (
        <p className="font-display italic text-[15px] text-[var(--fg-muted)] leading-[1.5] mb-4 pl-3 border-l border-[var(--border-strong)]">
          “{rationale}”
        </p>
      )}
      <ul className="space-y-1.5">
        {queries.map((q, i) => (
          <li
            key={i}
            className="flex items-center gap-2.5 text-[13px] text-[var(--fg)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] transition-colors duration-[var(--dur-fast)] rounded-[var(--radius-sm)] px-3 py-2"
          >
            <Search
              className="size-3.5 text-[var(--fg-subtle)] shrink-0"
              strokeWidth={1.5}
            />
            <span className="font-mono text-[12.5px] tracking-tight truncate">
              {q}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
