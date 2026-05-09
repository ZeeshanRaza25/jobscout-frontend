"use client";
import { Clock, ChevronRight, Star, RotateCcw } from "lucide-react";
import type { SessionSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_TINT: Record<string, string> = {
  done:     "text-[var(--success-fg)]",
  running:  "text-[var(--warn-fg)]",
  uploaded: "text-[var(--info-fg)]",
  error:    "text-[var(--danger-fg)]",
};

export function HistoryPanel({
  history,
  onRestore,
  onRerun,
}: {
  history: SessionSummary[];
  onRestore: (s: SessionSummary) => void;
  onRerun?: (s: SessionSummary) => void;
}) {
  if (history.length === 0) return null;

  return (
    <section className="mt-14 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 eyebrow">
          <Clock className="size-3" strokeWidth={1.5} />
          Recent runs
          <span className="text-[var(--fg-faint)] ml-1 normal-case font-mono">
            · {history.length}
          </span>
        </div>
      </div>
      <div className="space-y-1.5">
        {history.map((s) => {
          const name =
            s.profile?.name || s.profile?.headline || "Unknown candidate";
          const recommended = s.ranked.filter((m) => m.recommended).length;
          const topScore = s.ranked[0]?.score ?? null;
          return (
            <div
              key={s.session_id}
              className={cn(
                "group rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)]",
                "hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)]",
                "transition-all duration-[var(--dur-base)] flex items-center",
              )}
            >
              <button
                onClick={() => onRestore(s)}
                className="flex-1 text-left flex items-center gap-3 p-3.5 min-w-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="font-medium text-[14px] text-[var(--fg)] truncate">
                      {name}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-[0.12em] font-medium",
                        STATUS_TINT[s.status] ?? "text-[var(--fg-subtle)]",
                      )}
                    >
                      {s.status}
                    </span>
                  </div>
                  <div className="text-[11.5px] text-[var(--fg-subtle)] flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                    <span>{fmt(s.created_at)}</span>
                    {s.ranked.length > 0 && (
                      <>
                        <span className="tabular-nums">
                          {s.ranked.length} matches
                        </span>
                        {topScore !== null && (
                          <span className="tabular-nums">top {topScore}</span>
                        )}
                        {recommended > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-[var(--success-fg)] font-medium">
                            <Star className="size-3" /> {recommended}
                          </span>
                        )}
                      </>
                    )}
                    {s.queries.length > 0 && s.ranked.length === 0 && (
                      <span>{s.queries.length} queries planned</span>
                    )}
                  </div>
                </div>
                <ChevronRight className="size-4 text-[var(--fg-faint)] group-hover:text-[var(--fg-muted)] group-hover:translate-x-0.5 transition-all duration-[var(--dur-base)] shrink-0" />
              </button>
              {onRerun && s.status === "done" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRerun(s);
                  }}
                  title="Re-run pipeline with this CV"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 mr-2 rounded-[var(--radius-sm)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]"
                >
                  <RotateCcw className="size-3.5" strokeWidth={1.5} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
