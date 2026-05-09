# JobScout · Design System

A clean, airy, editorial **light-mode** design system. Monochrome black accent. Serif display + sans body. Built on Tailwind 4 with shadcn/ui primitives.

## Aesthetic principles

| | |
|---|---|
| **Light & airy** | Off-white surfaces (`#fafaf9`), generous whitespace, paper-grain backdrop |
| **Monochrome accent** | Black (`#0c0a09`) is the only brand color. No emerald glow, no gradient buttons |
| **Editorial typography** | Serif display (**Instrument Serif**) for headings, sans body (**Geist Sans**), italics for emphasis and quotes |
| **Semantic color, sparingly** | Tier/status meaning (success, warning, info, danger) keeps the dataset readable — but never as decoration |
| **Subtle elevation** | 5 shadow tokens, all under 10% opacity. No glow, no neon |

## Tokens

All tokens live in `src/app/globals.css` as CSS custom properties and are surfaced as Tailwind utilities via `@theme inline`.

### Surfaces

| Token | Value | Use |
|---|---|---|
| `--bg` | `#ffffff` | Page background |
| `--surface` | `#fafaf9` | Cards, raised panels |
| `--surface-2` | `#f5f5f4` | Nested surfaces, hover states |
| `--surface-3` | `#e7e5e4` | Deepest tonal step (track backgrounds) |

### Borders

| Token | Value | Use |
|---|---|---|
| `--border-subtle` | `#f1f0ef` | Hairline dividers |
| `--border` | `#e7e5e4` | Default card border |
| `--border-strong` | `#d6d3d1` | Hover, focus, emphasized edges |

### Foreground

| Token | Value | Use |
|---|---|---|
| `--fg` | `#0c0a09` | Primary text |
| `--fg-muted` | `#57534e` | Body copy, secondary |
| `--fg-subtle` | `#a8a29e` | Hint, caption |
| `--fg-faint` | `#d6d3d1` | Placeholder, disabled |

### Accent (monochrome)

| Token | Value | Use |
|---|---|---|
| `--accent` | `#0c0a09` | Primary CTA, active nav |
| `--accent-fg` | `#ffffff` | Text on accent |
| `--accent-soft` | `#f5f5f4` | Subtle highlight |

### Semantic ramps (info-only — never decorative)

Each ramp has `-fg`, `-bg`, `-bd` for foreground, background, border.

| Ramp | Use |
|---|---|
| `--success-*` | Strong matches, completed steps, recommended badge |
| `--info-*` | Good matches, uploading state |
| `--warn-*` | Stretch matches, running state |
| `--danger-*` | Errors, weak fits |
| `--neutral-*` | Unknown, idle, weak fit |

### Radii

`--radius-xs` 4 · `--radius-sm` 6 · `--radius` 8 · `--radius-md` 10 · `--radius-lg` 14 · `--radius-xl` 20 · `--radius-2xl` 28

### Shadows

Five subtle steps. All under 10% opacity. Used to lift cards, never to glow.

`--shadow-xs` → `--shadow-xl`

### Motion

| Token | Value |
|---|---|
| `--dur-fast` | 120ms |
| `--dur-base` | 200ms |
| `--dur-slow` | 320ms |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-in-out` | `cubic-bezier(0.83, 0, 0.17, 1)` |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

## Typography

Three font families, surfaced as Tailwind utilities:

| Class | Family | Use |
|---|---|---|
| `font-display` | Instrument Serif | Hero, page titles, card titles, large numerals |
| `font-sans` | Geist Sans | Body, UI, default |
| `font-mono` | Geist Mono | Code, session IDs, metric counts |

### Type scale (display)

The display serif is editorial — large, italic-friendly, with set italic variants. It always uses tighter tracking (`tracking-tight`) and a leading of 1.0–1.1.

| Element | Class |
|---|---|
| Hero h1 | `font-display text-5xl sm:text-6xl md:text-7xl leading-[0.98]` |
| Page h1 | `font-display text-4xl sm:text-5xl leading-[1.05]` |
| Section h2 | `font-display text-[28px] leading-tight` |
| Card title | `font-display text-[20px]` |

### Type scale (body)

| Use | Class |
|---|---|
| Lead paragraph | `text-[17px] leading-[1.6] text-[var(--fg-muted)]` |
| Body | `text-[14.5px] leading-relaxed` |
| Secondary | `text-[13.5px] text-[var(--fg-muted)]` |
| Caption | `text-[12.5px] text-[var(--fg-subtle)]` |
| Eyebrow | `eyebrow` (custom: 11px, uppercase, 0.14em tracking, subtle) |

## Components

### shadcn primitives (`src/components/ui/*`)

#### `Button`
Variants: `primary` (black) · `secondary` · `ghost` · `outline` · `link` · `destructive`
Sizes: `sm` · `md` · `lg` · `icon`
Supports `asChild` for use with `<Link>`.

```tsx
<Button asChild variant="primary" size="lg">
  <Link href="/scout">Drop your CV <ArrowRight className="size-4" /></Link>
</Button>
```

#### `Card` family
`<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>`, `<CardFooter>`

Defaults: `radius-lg`, `border`, `surface` background, `shadow-xs`. Hover treatment is opt-in (`hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)]`).

#### `Badge`
Variants: `neutral` · `success` · `info` · `warning` · `danger` · `solid` · `outline`
Sizes: `sm` · `md` · `lg`

### Domain components

| Component | Notes |
|---|---|
| `Nav` | Sticky, blurred backdrop. Black `J` mark + serif `JobScout` wordmark. |
| `Footer` | Three-column grid (brand · product · stack), then thin baseline row. |
| `CVUpload` | 2px dashed dropzone; black fill + white icon on drag. Subtle scale on drag. |
| `ProfileCard` | Card with serif name, eyebrow sections, accent chips for titles. |
| `QueryList` | Italic serif rationale in a quote-rule; mono query rows. |
| `JobMatchCard` | Tier rail (3px) + tier-tinted score numeral. Strengths/gaps in a tinted footer. |
| `MatchList` | Filter pills with active = solid black. |
| `ProgressStrip` | Black progress bar; serif numerals for stats. |
| `TracePanel` | Sticky right rail. Mermaid graph + per-node trace with success/warning rings. |
| `GraphDiagram` | Mermaid `theme: "base"`, light vars. Active node = solid black. |
| `StatusBadge` | Pill with semantic-tinted ring + dot. |
| `HistoryPanel` | Compact rows, hover lift. Re-run button reveals on hover. |

## Patterns

### Eyebrow + display headline + lead
The canonical hero/section pattern.

```tsx
<div className="eyebrow mb-3">Pipeline architecture</div>
<h1 className="font-display text-5xl sm:text-6xl leading-[1.02] tracking-tight text-[var(--fg)] mb-5">
  How JobScout <span className="italic text-[var(--fg-muted)]">thinks.</span>
</h1>
<p className="text-[15.5px] text-[var(--fg-muted)] max-w-xl mx-auto leading-[1.65]">…</p>
```

### Italic-as-emphasis
The serif italic carries emphasis where bold would feel heavy. Use sparingly — once per heading max.

### Tier coloring (matches)
Score → tier → semantic ramp. Never use these colors for chrome.

| Score | Tier | Ramp |
|---|---|---|
| 80+ | strong | success |
| 60–79 | good | info |
| 40–59 | stretch | warning |
| <40 | weak | neutral |

## Migration notes

This revamp is a hard cut — there is no dark/light toggle. Old emerald accents and dark surfaces have been removed everywhere. Things to know:

- **shadcn deps**: `class-variance-authority`, `@radix-ui/react-slot`, `tw-animate-css` were added to `package.json`. Run `pnpm install`.
- **Mermaid**: now uses `theme: "base"` with light vars; the active-node highlight is solid black.
- **highlight.js**: switched from `github-dark.css` to `github.css`.
- **Fonts**: Instrument Serif is loaded via `next/font/google` alongside Geist Sans and Geist Mono.
- **Custom utilities**: `.font-display` and `.eyebrow` are defined in `globals.css`.
