"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Star, Search, ArrowRight, Inbox } from "lucide-react";
import { useJobScout } from "@/hooks/useJobScout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Filter = "all" | "done" | "error";

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

export default function HistoryPage() {
  const router = useRouter();
  const { history, loadHistory } = useJobScout();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const filtered = useMemo(() => {
    let arr = [...history];
    if (filter !== "all") arr = arr.filter((s) => s.status === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter((s) => {
        const name = (
          s.profile?.name ||
          s.profile?.headline ||
          ""
        ).toLowerCase();
        const titles = (s.profile?.titles || []).join(" ").toLowerCase();
        const skills = (s.profile?.skills || []).join(" ").toLowerCase();
        return (
          name.includes(q) || titles.includes(q) || skills.includes(q)
        );
      });
    }
    return arr;
  }, [history, query, filter]);

  const counts: Record<Filter, number> = {
    all: history.length,
    done: history.filter((s) => s.status === "done").length,
    error: history.filter((s) => s.status === "error").length,
  };

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <div className="eyebrow mb-2 inline-flex items-center gap-1">
          <Clock className="size-3" strokeWidth={1.5} /> History
        </div>
        <h1 className="font-display text-4xl sm:text-[44px] leading-[1.05] tracking-tight text-[var(--fg)] mb-2">
          Past runs.
        </h1>
        <p className="text-[14.5px] text-[var(--fg-muted)] leading-relaxed max-w-xl">
          Every CV you&rsquo;ve scouted is persisted to MongoDB Atlas. Click any
          row to reopen the results.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[var(--fg-subtle)]"
            strokeWidth={1.5}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, title, or skill…"
            className="w-full pl-9 pr-3 h-10 rounded-[var(--radius)] bg-[var(--surface)] border border-[var(--border)] text-[13.5px] text-[var(--fg)] placeholder:text-[var(--fg-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/15 focus:border-[var(--fg)] transition"
          />
        </div>
        <div className="flex items-center gap-1">
          {(["all", "done", "error"] as Filter[]).map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "text-[11px] uppercase tracking-[0.12em] font-medium px-3 h-10 rounded-[var(--radius)] transition-all duration-[var(--dur-fast)]",
                  active
                    ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                    : "bg-[var(--surface)] border border-[var(--border)] text-[var(--fg-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]",
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
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-6 py-20 text-center">
          <Inbox
            className="size-8 text-[var(--fg-faint)] mx-auto mb-4"
            strokeWidth={1.25}
          />
          <div className="font-display text-[20px] leading-tight text-[var(--fg)] mb-1.5">
            {history.length === 0 ? "No runs yet." : "Nothing matches."}
          </div>
          <div className="text-[12.5px] text-[var(--fg-muted)] mb-5">
            {history.length === 0
              ? "Upload a CV to get started."
              : "Try a different search or filter."}
          </div>
          {history.length === 0 && (
            <Button asChild variant="primary">
              <Link href="/scout">
                Drop a CV <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          {filtered.map((s) => {
            const name =
              s.profile?.name || s.profile?.headline || "Unknown candidate";
            const recommended = s.ranked.filter((m) => m.recommended).length;
            const topScore = s.ranked[0]?.score ?? null;
            return (
              <button
                key={s.session_id}
                onClick={() => router.push(`/scout/${s.session_id}`)}
                className={cn(
                  "group w-full text-left rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)]",
                  "hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)]",
                  "transition-all duration-[var(--dur-base)] flex items-center gap-3 p-4",
                )}
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
                    {s.profile?.titles && s.profile.titles[0] && (
                      <span className="truncate">{s.profile.titles[0]}</span>
                    )}
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
                  </div>
                </div>
                <ArrowRight className="size-4 text-[var(--fg-faint)] group-hover:text-[var(--fg)] group-hover:translate-x-0.5 transition-all duration-[var(--dur-base)] shrink-0" />
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
}
