import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        neutral:
          "bg-[var(--neutral-bg)] text-[var(--neutral-fg)] ring-1 ring-inset ring-[var(--neutral-bd)]",
        success:
          "bg-[var(--success-bg)] text-[var(--success-fg)] ring-1 ring-inset ring-[var(--success-bd)]",
        info:
          "bg-[var(--info-bg)] text-[var(--info-fg)] ring-1 ring-inset ring-[var(--info-bd)]",
        warning:
          "bg-[var(--warn-bg)] text-[var(--warn-fg)] ring-1 ring-inset ring-[var(--warn-bd)]",
        danger:
          "bg-[var(--danger-bg)] text-[var(--danger-fg)] ring-1 ring-inset ring-[var(--danger-bd)]",
        solid:
          "bg-[var(--accent)] text-[var(--accent-fg)]",
        outline:
          "border border-[var(--border-strong)] text-[var(--fg-muted)]",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[10px]",
        md: "px-2 py-0.5 text-[11px]",
        lg: "px-2.5 py-1 text-[12px]",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { badgeVariants };
