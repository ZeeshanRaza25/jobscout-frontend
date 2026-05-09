# Frontend (Next.js 16 · Tailwind 4 · Vercel)

## Run
```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Backend must be running on :8000 (or set `NEXT_PUBLIC_API_URL`).

## Layout
- `src/app/page.tsx` — single page. Drag-drop CV → auto-runs pipeline → shows profile + planned queries + matches + trace.
- `src/components/CVUpload.tsx` — drag-drop dropzone.
- `src/components/ProfileCard.tsx` — extracted candidate profile.
- `src/components/QueryList.tsx` — agent-planned searches.
- `src/components/JobMatchCard.tsx` — single scored match (score badge, expandable strengths/gaps/reasoning).
- `src/components/MatchList.tsx` — filtered & sorted match grid.
- `src/components/TracePanel.tsx` — sticky right rail; live graph diagram + step trace.
- `src/components/GraphDiagram.tsx` — fetches `/api/graph`, renders mermaid, highlights active node.
- `src/hooks/useJobScout.ts` — SSE consumer; one hook owns the whole pipeline state.
- `src/lib/types.ts` — shared TS schemas matching backend Pydantic models.

## SSE contract
The backend emits these events on `POST /api/search/stream`:
- `step` `{node, status}` — graph lifecycle
- `profile` `{profile}` — extracted CandidateProfile
- `queries` `{queries, rationale}` — planned search queries
- `jobs` `{jobs}` — raw search results before scoring
- `match` `JobMatch` — one per job as it's scored (live)
- `ranked` `{ranked}` — final sorted list
- `done` / `error`

The hook switches on `event:` and updates the right state slice. Add a new event type → extend `lib/types.ts`, add a state slice in `useJobScout`, add a case in the parser.

## Adding a UI piece
- Default to client component (`"use client"`).
- Tailwind utility classes; pull shadcn primitives if you need them (`pnpm dlx shadcn@latest add <name>`).
- Don't open a second SSE connection — read from `useJobScout`.

## Deploy (Vercel)
1. Import repo, root `frontend`.
2. Environment Variables → `NEXT_PUBLIC_API_URL=https://<railway-app>.up.railway.app`.
3. Deploy. (Redeploy after env changes — `NEXT_PUBLIC_*` is build-time.)

## Don't
- Don't fetch from server components — the API requires CORS + streams; do client-side.
- Don't lazy-import the page — there's only one route.
- Don't hardcode the API URL anywhere except the env var.
