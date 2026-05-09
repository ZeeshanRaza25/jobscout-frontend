# Frontend Setup (run once before the hackathon)

```bash
cd frontend

# Scaffold Next.js 15 app in current directory
pnpm create next-app@latest . \
  --ts --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-pnpm --no-turbopack

# Core deps
pnpm add ai react-markdown remark-gfm rehype-highlight \
  zustand lucide-react clsx tailwind-merge mermaid

# shadcn/ui
pnpm dlx shadcn@latest init -d
pnpm dlx shadcn@latest add button card scroll-area badge separator dialog

# Drop in the pre-written components
cp -r ../prebuilt/* src/   # if you stage them there, or just paste from this repo's frontend/_prebuilt

cp .env.example .env.local

pnpm dev
```

Then open http://localhost:3000.

## Pre-written components in `_prebuilt/`
- `components/Chat.tsx` — main chat UI with streaming
- `components/TracePanel.tsx` — live agent execution trace
- `components/ToolCard.tsx` — structured tool call rendering
- `components/CitationChip.tsx` — clickable source chips
- `hooks/useAgentStream.ts` — SSE consumer with token + step + tool events
- `app/page.tsx` — wires it all together
