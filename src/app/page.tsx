import Link from "next/link";
import {
  ArrowRight,
  Brain,
  ListChecks,
  Globe,
  Filter,
  Gauge,
  Trophy,
  ShieldCheck,
  Zap,
  Eye,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Landing() {
  return (
    <main className="flex-1">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pt-20 pb-24 max-w-5xl mx-auto text-center">
        <Badge variant="outline" className="mb-7">
          <span className="size-1.5 rounded-full bg-[var(--accent)] mr-1" />
          SMIT Agentic AI Hackathon · v1.0
        </Badge>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-display leading-[0.98] tracking-tight text-[var(--fg)] mb-7">
          Stop sending CVs
          <br />
          <span className="italic text-[var(--fg-muted)]">into the void.</span>
          <br />
          Find the <span className="italic">five</span> jobs that fit.
        </h1>

        <p className="text-[17px] sm:text-[18px] text-[var(--fg-muted)] max-w-2xl mx-auto mb-10 leading-[1.6]">
          JobScout reads your CV, plans tailored searches, runs them against the
          live web, and scores every result with explainable reasoning. About
          thirty seconds. Zero forms.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="primary" size="lg">
            <Link href="/scout">
              Drop your CV
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/how-it-works">See how it works</Link>
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[10.5px] uppercase tracking-[0.18em] text-[var(--fg-faint)] font-medium">
          <span>LangGraph</span>
          <Dot />
          <span>GPT-4o-mini</span>
          <Dot />
          <span>Tavily</span>
          <Dot />
          <span>Qdrant RAG</span>
          <Dot />
          <span>MongoDB Atlas</span>
        </div>
      </section>

      {/* ── Pipeline preview ────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="eyebrow mb-3">Seven nodes · One pipeline</div>
          <h2 className="font-display text-4xl sm:text-[44px] leading-[1.05] tracking-tight text-[var(--fg)]">
            One CV in.
            <span className="italic text-[var(--fg-muted)]"> Explainable matches out.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {STEPS.map((s, i) => (
            <Step key={s.label} {...s} num={i + 1} />
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <Feature
            icon={<ShieldCheck />}
            title="Explainable, not black-box."
            body="Every match shows strengths, gaps, the reasoning, and the search query that surfaced it. Cited from your CV via RAG."
          />
          <Feature
            icon={<Zap />}
            title="Live web, not a stale dataset."
            body="Tavily fetches fresh job postings during your run. Cards link directly to the live posting on the company's site."
          />
          <Feature
            icon={<Eye />}
            title="Watch the agent think."
            body="A live trace shows the LangGraph pipeline executing — node by node — with per-step durations."
          />
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24 max-w-3xl mx-auto">
        <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-10 sm:p-14 text-center shadow-[var(--shadow-sm)]">
          <FileText className="size-7 mx-auto mb-5 text-[var(--fg-subtle)]" strokeWidth={1.4} />
          <h2 className="font-display text-3xl sm:text-4xl leading-[1.1] tracking-tight text-[var(--fg)] mb-3">
            Ready to skip the spray-and-pray?
          </h2>
          <p className="text-[var(--fg-muted)] mb-7 leading-relaxed">
            Drop your CV. The agent does the rest in under a minute.
          </p>
          <Button asChild variant="primary" size="lg">
            <Link href="/scout">
              Start scouting
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

function Dot() {
  return <span className="size-0.5 rounded-full bg-[var(--fg-faint)]" />;
}

const STEPS = [
  { icon: <Brain />,      label: "Ingest CV" },
  { icon: <Brain />,      label: "Extract Profile" },
  { icon: <ListChecks />, label: "Plan Queries" },
  { icon: <Globe />,      label: "Search Web" },
  { icon: <Filter />,     label: "Filter Relevance" },
  { icon: <Gauge />,      label: "Score Matches" },
  { icon: <Trophy />,     label: "Rank Results" },
];

function Step({
  icon,
  label,
  num,
}: {
  icon: React.ReactNode;
  label: string;
  num: number;
}) {
  return (
    <Card className="p-3 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)] transition-all duration-[var(--dur-base)]">
      <div className="flex items-center justify-between mb-2">
        <div className="size-7 rounded-[var(--radius-sm)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--fg)] [&_svg]:size-3.5">
          {icon}
        </div>
        <span className="text-[10px] tabular-nums text-[var(--fg-faint)] font-mono">
          0{num}
        </span>
      </div>
      <div className="text-[12px] font-medium text-[var(--fg)] leading-tight">
        {label}
      </div>
    </Card>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card className="hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)] transition-all duration-[var(--dur-base)]">
      <CardContent className="px-6 py-7">
        <div className="size-9 rounded-[var(--radius)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--fg)] mb-5 [&_svg]:size-4">
          {icon}
        </div>
        <div className="font-display text-[20px] leading-tight tracking-tight text-[var(--fg)] mb-2">
          {title}
        </div>
        <p className="text-[13.5px] text-[var(--fg-muted)] leading-[1.65]">
          {body}
        </p>
      </CardContent>
    </Card>
  );
}
