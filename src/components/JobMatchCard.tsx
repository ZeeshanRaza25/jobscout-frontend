"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Star, Search } from "lucide-react";
import type { JobMatch } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tier = "strong" | "good" | "stretch" | "weak";

const TIER: Record<
  Tier,
  {
    rail: string;
    badge: string;
    ring: string;
    label: string;
    scoreText: string;
    scoreBg: string;
  }
> = {
  strong: {
    rail: "bg-[var(--success-fg)]",
    badge: "bg-[var(--success-bg)] text-[var(--success-fg)]",
    ring: "ring-[var(--success-bd)]",
    label: "strong match",
    scoreText: "text-[var(--success-fg)]",
    scoreBg: "bg-[var(--success-bg)]",
  },
  good: {
    rail: "bg-[var(--info-fg)]",
    badge: "bg-[var(--info-bg)] text-[var(--info-fg)]",
    ring: "ring-[var(--info-bd)]",
    label: "good match",
    scoreText: "text-[var(--info-fg)]",
    scoreBg: "bg-[var(--info-bg)]",
  },
  stretch: {
    rail: "bg-[var(--warn-fg)]",
    badge: "bg-[var(--warn-bg)] text-[var(--warn-fg)]",
    ring: "ring-[var(--warn-bd)]",
    label: "stretch",
    scoreText: "text-[var(--warn-fg)]",
    scoreBg: "bg-[var(--warn-bg)]",
  },
  weak: {
    rail: "bg-[var(--fg-subtle)]",
    badge: "bg-[var(--neutral-bg)] text-[var(--neutral-fg)]",
    ring: "ring-[var(--neutral-bd)]",
    label: "weak fit",
    scoreText: "text-[var(--neutral-fg)]",
    scoreBg: "bg-[var(--neutral-bg)]",
  },
};

function tierFor(score: number): Tier {
  if (score >= 80) return "strong";
  if (score >= 60) return "good";
  if (score >= 40) return "stretch";
  return "weak";
}

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function JobMatchCard({ m }: { m: JobMatch }) {
  const [open, setOpen] = useState(false);
  const t = tierFor(m.score);
  const s = TIER[t];

  return (
    <div
      className={cn(
        "animate-stream-in group relative overflow-hidden rounded-[var(--radius-lg)]",
        "border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-xs)]",
        "hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)]",
        "transition-all duration-[var(--dur-base)]",
      )}
    >
      {/* Tier rail */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-[3px]", s.rail)} />

      <div className="p-4 pl-5 flex gap-4">
        {/* Score */}
        <div className="flex flex-col items-center shrink-0 pt-0.5">
          <div
            className={cn(
              "size-14 rounded-[var(--radius-lg)] flex items-center justify-center",
              "font-display text-[26px] leading-none tabular-nums tracking-tight",
              "ring-1 ring-inset",
              s.scoreBg,
              s.scoreText,
              s.ring,
            )}
          >
            {m.score}
          </div>
          <div className="text-[9.5px] uppercase tracking-[0.14em] text-[var(--fg-subtle)] mt-1.5 font-medium">
            {s.label}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <a
              href={m.job.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[15px] text-[var(--fg)] hover:text-[var(--accent)] inline-flex items-center gap-1.5 group/link min-w-0 leading-snug"
            >
              <span className="truncate">{m.job.title}</span>
              <ExternalLink className="size-3 shrink-0 text-[var(--fg-subtle)] group-hover/link:text-[var(--fg)] transition-colors" />
            </a>
            {m.recommended && (
              <span className="shrink-0 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] font-semibold bg-[var(--accent)] text-[var(--accent-fg)] rounded-full px-2 py-0.5">
                <Star className="size-2.5" /> recommended
              </span>
            )}
          </div>
          <div className="text-[11.5px] text-[var(--fg-subtle)] truncate mt-0.5 font-mono">
            {domainOf(m.job.url)}
          </div>
          <p className="text-[13.5px] text-[var(--fg-muted)] mt-2 line-clamp-2 leading-relaxed">
            {m.reasoning}
          </p>
          <button
            onClick={() => setOpen((o) => !o)}
            className="mt-2 text-[11.5px] text-[var(--fg-muted)] hover:text-[var(--fg)] inline-flex items-center gap-1 transition-colors duration-[var(--dur-fast)]"
          >
            {open ? (
              <ChevronUp className="size-3" />
            ) : (
              <ChevronDown className="size-3" />
            )}
            {open ? "Hide details" : "Show details"}
          </button>
        </div>
      </div>

      {open && (
        <div className="px-5 pb-4 pt-3 border-t border-[var(--border-subtle)] bg-[var(--surface-2)] grid grid-cols-1 sm:grid-cols-2 gap-5 text-[13px] animate-fade-in">
          <div>
            <div className="text-[10px] uppercase tracking-[0.14em] font-semibold text-[var(--success-fg)] mb-2">
              Strengths
            </div>
            <ul className="space-y-1">
              {m.strengths.map((it, i) => (
                <li
                  key={i}
                  className="text-[var(--fg)] leading-snug flex gap-2"
                >
                  <span className="text-[var(--success-fg)] shrink-0">+</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.14em] font-semibold text-[var(--warn-fg)] mb-2">
              Gaps
            </div>
            <ul className="space-y-1">
              {m.gaps.length === 0 ? (
                <li className="text-[var(--fg-subtle)] italic font-display">
                  none flagged
                </li>
              ) : (
                m.gaps.map((g, i) => (
                  <li
                    key={i}
                    className="text-[var(--fg)] leading-snug flex gap-2"
                  >
                    <span className="text-[var(--warn-fg)] shrink-0">−</span>
                    <span>{g}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="sm:col-span-2 text-[11.5px] text-[var(--fg-subtle)] inline-flex items-center gap-1.5 pt-2 border-t border-[var(--border-subtle)]">
            <Search className="size-3" strokeWidth={1.5} />
            Found via{" "}
            <span className="font-mono text-[var(--fg-muted)]">
              {m.job.source_query}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
