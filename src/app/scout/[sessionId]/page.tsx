"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { ProfileCard } from "@/components/ProfileCard";
import { QueryList } from "@/components/QueryList";
import { MatchList } from "@/components/MatchList";
import { TracePanel } from "@/components/TracePanel";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressStrip } from "@/components/ProgressStrip";
import { LiveActivity } from "@/components/LiveActivity";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useJobScout } from "@/hooks/useJobScout";

export default function SessionPage() {
  const router = useRouter();
  const params = useParams<{ sessionId: string }>();
  const sid = params?.sessionId;

  const {
    phase,
    error,
    profile,
    queries,
    queryRationale,
    jobs,
    matches,
    ranked,
    steps,
    loadSession,
    run,
    rerunById,
    reset,
  } = useJobScout();

  const [rerunning, setRerunning] = useState(false);

  const initialized = useRef<string | null>(null);

  // On mount: hydrate session from backend; run pipeline if incomplete.
  useEffect(() => {
    if (!sid || initialized.current === sid) return;
    initialized.current = sid;
    (async () => {
      const needsRun = await loadSession(sid);
      if (needsRun) await run(sid);
    })();
  }, [sid, loadSession, run]);

  const visibleMatches =
    phase === "done" && ranked.length > 0 ? ranked : matches;
  const running = phase === "running";

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-7 max-w-[1400px] mx-auto w-full">
      {/* Subheader */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <Link
          href="/scout"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
        >
          <ArrowLeft className="size-3.5" strokeWidth={1.5} /> Upload another
          CV
        </Link>
        <div className="flex items-center gap-2">
          <span className="eyebrow font-mono normal-case">
            session {sid?.slice(0, 8)}
          </span>
          <StatusBadge phase={phase} />
          {phase === "done" && (
            <Button
              variant="secondary"
              size="sm"
              disabled={rerunning}
              onClick={async () => {
                if (!sid || rerunning) return;
                setRerunning(true);
                const ok = await rerunById(sid);
                if (ok) {
                  reset();
                  initialized.current = sid;
                  await run(sid);
                }
                setRerunning(false);
              }}
            >
              <RotateCcw className="size-3" strokeWidth={1.5} /> Re-run
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-[var(--radius)] bg-[var(--danger-bg)] border border-[var(--danger-bd)] text-[13px] text-[var(--danger-fg)]">
          {error}
        </div>
      )}

      {!error && (
        <div className="space-y-5">
          <LiveActivity steps={steps} running={running} phase={phase} />

          <ProgressStrip
            steps={steps}
            jobs={jobs}
            matches={matches}
            ranked={ranked}
            running={running}
          />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
            <div className="space-y-5 min-w-0">
              {profile ? (
                <ProfileCard profile={profile} />
              ) : (
                <SectionSkeleton
                  label="Profile"
                  hint="Extracted from your CV"
                  lines={3}
                />
              )}
              {queries.length > 0 ? (
                <QueryList queries={queries} rationale={queryRationale} />
              ) : (
                <SectionSkeleton
                  label="Search plan"
                  hint="Queries the agent will run"
                  lines={2}
                />
              )}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h2 className="font-display text-[22px] leading-tight tracking-tight text-[var(--fg)]">
                    Matches
                    {running && matches.length > 0 && (
                      <span className="ml-2 text-[12.5px] font-sans font-normal text-[var(--fg-muted)] italic">
                        scoring {matches.length}…
                      </span>
                    )}
                    {running && matches.length === 0 && jobs.length === 0 && (
                      <span className="ml-2 text-[12.5px] font-sans font-normal text-[var(--fg-muted)] italic">
                        searching the web…
                      </span>
                    )}
                  </h2>
                </div>
                {visibleMatches.length === 0 && running ? (
                  <SectionSkeleton
                    label=""
                    hint="Live matches will stream in here as each role is scored."
                    lines={4}
                  />
                ) : (
                  <MatchList matches={visibleMatches} />
                )}
              </div>
            </div>
            <TracePanel steps={steps} running={running} />
          </div>
        </div>
      )}
    </main>
  );
}

function SectionSkeleton({
  label,
  hint,
  lines,
}: {
  label: string;
  hint: string;
  lines: number;
}) {
  return (
    <Card className="p-5">
      {label && <div className="eyebrow mb-2">{label}</div>}
      <div className="text-[12.5px] text-[var(--fg-muted)] mb-3">{hint}</div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 rounded bg-[var(--surface-2)] animate-pulse"
            style={{ width: `${100 - i * 12}%` }}
          />
        ))}
      </div>
    </Card>
  );
}
