"use client";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  UserSearch,
  ListChecks,
  Globe,
  Filter,
  Gauge,
  Trophy,
  Database,
  Layers,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { GraphDiagram } from "@/components/GraphDiagram";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const NODES = [
  {
    icon: FileText,
    name: "ingest_cv",
    title: "Ingest CV",
    body: "Parse PDF/DOCX/TXT, chunk with 800-char windows + 120-char overlap, embed each chunk with text-embedding-3-small, store in a per-session Qdrant Cloud collection.",
    detail: "≈3s · text-embedding-3-small",
  },
  {
    icon: UserSearch,
    name: "extract_profile",
    title: "Extract Profile",
    body: "GPT-4o-mini reads the CV text and emits a CandidateProfile via with_structured_output — name, headline, skills, titles, seniority, locations, education, languages.",
    detail: "Pydantic-validated · 1 LLM call",
  },
  {
    icon: ListChecks,
    name: "plan_queries",
    title: "Plan Queries",
    body: "The agent reads the profile and generates 3–6 diverse, search-engine-optimised queries varying broad/narrow, with location intent. SearchQueries Pydantic schema.",
    detail: "Temperature 0.4 · 1 LLM call",
  },
  {
    icon: Globe,
    name: "search",
    title: "Search Web",
    body: "Tavily fan-out — every query runs in parallel via asyncio.gather. Results are deduplicated by URL and capped at 25 to bound downstream cost.",
    detail: "Up to 6 parallel calls · with retry",
  },
  {
    icon: Filter,
    name: "filter",
    title: "Filter Relevance",
    body: "Embed the profile + every job snippet in one batch call, compute cosine similarity, keep the top 15 most relevant. No LLM cost — pure vector math.",
    detail: "1 batch embedding call",
  },
  {
    icon: Gauge,
    name: "score",
    title: "Score Matches",
    body: "For each filtered job: retrieve the 4 most relevant CV chunks via RAG, then ask GPT-4o-mini for a 0-100 score with strengths, gaps, and reasoning. Capped at 5 concurrent.",
    detail: "RAG-augmented · streamed live",
  },
  {
    icon: Trophy,
    name: "rank",
    title: "Rank Results",
    body: "Sort all scored matches by score descending. Final results are persisted to MongoDB Atlas and emitted as the ranked event over SSE.",
    detail: "Sub-millisecond · pure Python",
  },
];

const STACK = [
  { icon: Layers,       label: "LangGraph",      body: "7-node sequential pipeline. Internal parallelism via asyncio.gather." },
  { icon: Database,     label: "MongoDB Atlas",  body: "Session persistence — every run is reloadable by URL." },
  { icon: Database,     label: "Qdrant Cloud",   body: "Managed per-session vector store for CV chunks. Powers RAG retrieval at scoring time." },
  { icon: Activity,     label: "SSE Streaming",  body: "Backend emits step / profile / queries / jobs / match / ranked events." },
  { icon: ShieldCheck,  label: "Pydantic",       body: "Every LLM call uses with_structured_output — no free-text parsing." },
];

export default function HowItWorks() {
  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-14 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="eyebrow mb-3">Pipeline architecture</div>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.02] tracking-tight text-[var(--fg)] mb-5">
          How JobScout
          <span className="italic text-[var(--fg-muted)]"> thinks.</span>
        </h1>
        <p className="text-[15.5px] text-[var(--fg-muted)] max-w-xl mx-auto leading-[1.65]">
          A 7-node LangGraph agent. Sequential by design — predictable,
          explainable, and easy to read at a glance. Internal parallelism keeps
          it fast.
        </p>
      </div>

      {/* Live mermaid graph */}
      <Card className="p-6 mb-14">
        <div className="flex items-center justify-between mb-4">
          <div className="eyebrow">Live pipeline graph</div>
          <div className="text-[11.5px] text-[var(--fg-subtle)] font-mono">
            GET /api/graph
          </div>
        </div>
        <div className="mermaid-diagram rounded-[var(--radius)] bg-[var(--bg)] border border-[var(--border-subtle)] p-5 [&_svg]:max-w-full [&_svg]:mx-auto">
          <GraphDiagram />
        </div>
      </Card>

      {/* Node-by-node breakdown */}
      <section className="mb-14">
        <h2 className="font-display text-[28px] leading-tight tracking-tight text-[var(--fg)] mb-5 px-1">
          Node by node.
        </h2>
        <div className="space-y-3">
          {NODES.map((n, i) => (
            <NodeRow key={n.name} {...n} num={i + 1} />
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className="mb-14">
        <h2 className="font-display text-[28px] leading-tight tracking-tight text-[var(--fg)] mb-5 px-1">
          The stack underneath.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STACK.map((s) => (
            <Card
              key={s.label}
              className="p-5 hover:border-[var(--border-strong)] transition-colors"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="size-7 rounded-[var(--radius-sm)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--fg)]">
                  <s.icon className="size-3.5" strokeWidth={1.5} />
                </div>
                <div className="font-medium text-[14px] text-[var(--fg)]">
                  {s.label}
                </div>
              </div>
              <p className="text-[12.5px] text-[var(--fg-muted)] leading-[1.6]">
                {s.body}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <Card className="p-10 text-center">
        <h2 className="font-display text-3xl leading-tight tracking-tight text-[var(--fg)] mb-2">
          Want to see it live?
        </h2>
        <p className="text-[14.5px] text-[var(--fg-muted)] mb-6">
          Drop your CV and watch the pipeline execute in real time.
        </p>
        <Button asChild variant="primary" size="lg">
          <Link href="/scout">
            Try it now <ArrowRight className="size-4" />
          </Link>
        </Button>
      </Card>
    </main>
  );
}

function NodeRow({
  icon: Icon,
  name,
  title,
  body,
  detail,
  num,
}: {
  icon: typeof FileText;
  name: string;
  title: string;
  body: string;
  detail: string;
  num: number;
}) {
  return (
    <Card className="p-6 flex gap-5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)] transition-all duration-[var(--dur-base)]">
      <div className="shrink-0 flex flex-col items-center">
        <div className="size-11 rounded-[var(--radius-md)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--fg)] mb-2">
          <Icon className="size-[18px]" strokeWidth={1.5} />
        </div>
        <div className="text-[10px] tabular-nums text-[var(--fg-faint)] font-mono">
          0{num}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-display text-[20px] leading-tight tracking-tight text-[var(--fg)]">
            {title}
          </h3>
          <span className="text-[10px] font-mono text-[var(--fg-muted)] bg-[var(--surface-2)] border border-[var(--border)] px-1.5 py-0.5 rounded">
            {name}
          </span>
        </div>
        <p className="text-[13.5px] text-[var(--fg-muted)] leading-[1.65] mb-2">
          {body}
        </p>
        <div className="text-[11.5px] text-[var(--fg-subtle)] italic font-display">
          {detail}
        </div>
      </div>
    </Card>
  );
}
