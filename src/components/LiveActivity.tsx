"use client";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { Step } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const NODE_COPY: Record<
  string,
  { active: string; done: string; hint: string }
> = {
  ingest_cv: {
    active: "Reading your CV…",
    done: "CV parsed",
    hint: "Extracting text from your document",
  },
  extract_profile: {
    active: "Extracting your profile…",
    done: "Profile ready",
    hint: "Identifying skills, experience, and goals",
  },
  plan_queries: {
    active: "Planning targeted searches…",
    done: "Search plan ready",
    hint: "Designing the queries that fit your profile",
  },
  search: {
    active: "Searching the live web for roles…",
    done: "Web search complete",
    hint: "This is usually the slowest step (10–30s)",
  },
  filter: {
    active: "Filtering noisy results…",
    done: "Results filtered",
    hint: "Removing duplicates and off-topic listings",
  },
  score: {
    active: "Scoring each role against your profile…",
    done: "All roles scored",
    hint: "One LLM pass per job — runs in parallel",
  },
  rank: {
    active: "Ranking your top matches…",
    done: "Ranked",
    hint: "Sorting by overall fit",
  },
};

const STARTING_HINTS = [
  "Connecting to the agent…",
  "Warming up the pipeline…",
  "Almost there — first events incoming…",
];

export function LiveActivity({
  steps,
  running,
  phase,
}: {
  steps: Step[];
  running: boolean;
  phase: string;
}) {
  // pick the most recent active node (start without a matching end after it)
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

  const lastEnded = [...steps].reverse().find((s) => s.status === "end");

  const [elapsed, setElapsed] = useState(0);
  const [hintIdx, setHintIdx] = useState(0);

  // tick every second while a node is active
  useEffect(() => {
    if (!activeNode) return;
    const startStep = [...steps]
      .reverse()
      .find((s) => s.node === activeNode && s.status === "start");
    if (!startStep) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startStep.ts) / 1000));
    }, 250);
    return () => clearInterval(id);
  }, [activeNode, steps]);

  // rotate hints while waiting for very first event
  useEffect(() => {
    if (steps.length > 0 || !running) return;
    const id = setInterval(
      () => setHintIdx((i) => (i + 1) % STARTING_HINTS.length),
      2000,
    );
    return () => clearInterval(id);
  }, [steps.length, running]);

  if (phase === "done") {
    return (
      <Card className="px-5 py-4 flex items-center gap-3">
        <CheckCircle2
          className="size-5 text-[var(--success-fg)] shrink-0"
          strokeWidth={1.75}
        />
        <div>
          <div className="text-[14px] font-medium text-[var(--fg)]">
            Pipeline complete
          </div>
          <div className="text-[12.5px] text-[var(--fg-muted)]">
            All matches scored and ranked. Browse the results below.
          </div>
        </div>
      </Card>
    );
  }

  // Active step — show its friendly copy
  if (activeNode) {
    const meta = NODE_COPY[activeNode] ?? {
      active: activeNode,
      done: activeNode,
      hint: "",
    };
    return (
      <Card className="px-5 py-4 flex items-center gap-3">
        <Loader2
          className="size-5 text-[var(--warn-fg)] animate-spin shrink-0"
          strokeWidth={1.75}
        />
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-medium text-[var(--fg)]">
            {meta.active}
          </div>
          <div className="text-[12.5px] text-[var(--fg-muted)] truncate">
            {meta.hint}
          </div>
        </div>
        <div className="text-[11px] font-mono tabular-nums text-[var(--fg-muted)] shrink-0">
          {elapsed}s
        </div>
      </Card>
    );
  }

  // No active node yet — either between steps or pre-first-event
  const fallback =
    lastEnded != null
      ? (NODE_COPY[lastEnded.node]?.done ?? lastEnded.node) +
        " — preparing next step…"
      : STARTING_HINTS[hintIdx];

  return (
    <Card className="px-5 py-4 flex items-center gap-3">
      <Loader2
        className="size-5 text-[var(--fg-muted)] animate-spin shrink-0"
        strokeWidth={1.75}
      />
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "text-[14px] font-medium text-[var(--fg)] transition-opacity",
          )}
        >
          {fallback}
        </div>
        <div className="text-[12.5px] text-[var(--fg-muted)]">
          The agent runs 7 steps. Web search and scoring are the longest.
        </div>
      </div>
    </Card>
  );
}
