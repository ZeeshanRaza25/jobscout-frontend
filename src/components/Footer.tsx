import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] mt-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-[13px]">
        <div className="space-y-1.5">
          <div className="font-display text-[18px] leading-none text-[var(--fg)]">
            JobScout
          </div>
          <p className="text-[var(--fg-muted)] leading-relaxed text-[12.5px]">
            Built for the SMIT Agentic AI Hackathon.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="eyebrow text-[10px]">Product</div>
          <ul className="space-y-1">
            <li>
              <Link
                href="/scout"
                className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              >
                Scout a CV
              </Link>
            </li>
            <li>
              <Link
                href="/history"
                className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              >
                History
              </Link>
            </li>
            <li>
              <Link
                href="/how-it-works"
                className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              >
                How it works
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-1.5">
          <div className="eyebrow text-[10px]">Stack</div>
          <p className="text-[var(--fg-muted)] leading-relaxed text-[12.5px]">
            LangGraph · OpenAI · Tavily · Qdrant Cloud · MongoDB Atlas
          </p>
        </div>
      </div>

      <div className="border-t border-[var(--border-subtle)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-[11px] text-[var(--fg-subtle)]">
          <span>© {new Date().getFullYear()} JobScout</span>
          <span className="font-mono">v1.0 · agentic preview</span>
        </div>
      </div>
    </footer>
  );
}
