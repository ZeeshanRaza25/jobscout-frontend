"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const NAV = [
  { href: "/scout", label: "Scout", match: ["/scout"] },
  { href: "/history", label: "History", match: ["/history"] },
  { href: "/how-it-works", label: "How it works", match: ["/how-it-works"] },
];

export function Nav() {
  const pathname = usePathname();
  const onScoutPage = pathname?.startsWith("/scout");

  return (
    <nav className="sticky top-0 z-30 backdrop-blur-md bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] border-b border-[var(--border-subtle)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--accent)] text-[var(--accent-fg)] flex items-center justify-center font-display text-base leading-none transition-transform duration-[var(--dur-base)] group-hover:scale-[1.04]">
            J
          </div>
          <span className="font-display text-[20px] leading-none tracking-tight text-[var(--fg)]">
            JobScout
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {NAV.map((item) => {
            const active = item.match.some((p) => pathname?.startsWith(p));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[13px] px-3 py-1.5 rounded-[var(--radius-sm)] transition-colors duration-[var(--dur-fast)]",
                  active
                    ? "text-[var(--fg)] bg-[var(--surface-2)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-[13px] px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface)] transition-colors">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="primary" size="sm">
                Sign up
                <ArrowUpRight className="size-3.5" />
              </Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            {!onScoutPage ? (
              <Button asChild variant="primary" size="sm">
                <Link href="/scout">
                  Try it free
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            ) : (
              <span className="eyebrow font-mono text-[10px] text-[var(--fg-faint)]">
                v1.0
              </span>
            )}
            <UserButton />
          </Show>
        </div>
      </div>
    </nav>
  );
}
