"use client";
import type { Phase } from "@/hooks/useJobScout";
import { cn } from "@/lib/utils";

const STYLES: Record<
  Phase,
  { dot: string; bg: string; text: string; ring: string; label: string }
> = {
  idle: {
    dot: "bg-[var(--fg-subtle)]",
    bg: "bg-[var(--neutral-bg)]",
    text: "text-[var(--neutral-fg)]",
    ring: "ring-[var(--neutral-bd)]",
    label: "idle",
  },
  uploading: {
    dot: "bg-[var(--info-fg)]",
    bg: "bg-[var(--info-bg)]",
    text: "text-[var(--info-fg)]",
    ring: "ring-[var(--info-bd)]",
    label: "uploading",
  },
  running: {
    dot: "bg-[var(--warn-fg)]",
    bg: "bg-[var(--warn-bg)]",
    text: "text-[var(--warn-fg)]",
    ring: "ring-[var(--warn-bd)]",
    label: "running",
  },
  done: {
    dot: "bg-[var(--success-fg)]",
    bg: "bg-[var(--success-bg)]",
    text: "text-[var(--success-fg)]",
    ring: "ring-[var(--success-bd)]",
    label: "ready",
  },
  error: {
    dot: "bg-[var(--danger-fg)]",
    bg: "bg-[var(--danger-bg)]",
    text: "text-[var(--danger-fg)]",
    ring: "ring-[var(--danger-bd)]",
    label: "error",
  },
};

export function StatusBadge({ phase }: { phase: Phase }) {
  const s = STYLES[phase];
  const animate = phase === "running" || phase === "uploading";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ring-1 ring-inset text-[11px] font-medium",
        s.bg,
        s.text,
        s.ring,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          s.dot,
          animate && "animate-pulse-dot",
        )}
      />
      {s.label}
    </span>
  );
}
