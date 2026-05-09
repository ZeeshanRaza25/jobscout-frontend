"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CVUpload } from "@/components/CVUpload";
import { HistoryPanel } from "@/components/HistoryPanel";
import { useJobScout } from "@/hooks/useJobScout";

export default function ScoutPage() {
  const router = useRouter();
  const { phase, error, sessionId, history, upload, loadHistory, rerun } =
    useJobScout();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // After successful upload, navigate to the session-specific page.
  useEffect(() => {
    if (sessionId) router.push(`/scout/${sessionId}`);
  }, [sessionId, router]);

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-16 max-w-3xl mx-auto w-full">
      <div className="text-center mb-10">
        <div className="eyebrow mb-3">Step 1 of 1</div>
        <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] tracking-tight text-[var(--fg)] mb-4">
          Drop your CV.
        </h1>
        <p className="text-[15px] text-[var(--fg-muted)] max-w-md mx-auto leading-relaxed">
          Once you drop your file, JobScout extracts your profile, plans
          tailored searches, and scores live job postings — all in about thirty
          seconds.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-[var(--radius)] bg-[var(--danger-bg)] border border-[var(--danger-bd)] text-[13px] text-[var(--danger-fg)]">
          {error}
        </div>
      )}

      <CVUpload onFile={upload} uploading={phase === "uploading"} />

      <div className="flex items-center justify-center gap-x-7 gap-y-1 mt-7 text-[10.5px] uppercase tracking-[0.18em] text-[var(--fg-faint)] font-medium">
        <span>LangGraph</span>
        <span className="size-0.5 rounded-full bg-[var(--fg-faint)]" />
        <span>GPT-4o-mini</span>
        <span className="size-0.5 rounded-full bg-[var(--fg-faint)]" />
        <span>Tavily</span>
        <span className="size-0.5 rounded-full bg-[var(--fg-faint)]" />
        <span>Qdrant RAG</span>
      </div>

      <HistoryPanel
        history={history.slice(0, 5)}
        onRestore={(s) => router.push(`/scout/${s.session_id}`)}
        onRerun={rerun}
      />

      {history.length > 5 && (
        <div className="text-center mt-5">
          <Link
            href="/history"
            className="inline-flex items-center gap-1 text-[12px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
          >
            View all {history.length} runs <ChevronRight className="size-3" />
          </Link>
        </div>
      )}
    </main>
  );
}
