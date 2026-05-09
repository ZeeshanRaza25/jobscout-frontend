---
name: add-chat-component
description: Add a new UI component to the chat surface — message renderers, input variants, side panels, modals, command palettes. Triggers when the user says "add a component", "build a UI for X", "render Y in the chat", or describes a new visible piece of the frontend.
---

# Add a Chat UI Component

1. **Decide the location**:
   - Inside the message stream (e.g. inline tool result) → `src/components/<Name>.tsx`, render from `Chat.tsx`
   - Side panel (e.g. document viewer, settings) → add as a third grid column in `Chat.tsx`
   - Modal / overlay → use shadcn `Dialog`, mount at root in `app/page.tsx`

2. **Default to client components** (`"use client"` at top) when the component touches state, the stream, or browser APIs.

3. **For components that consume agent state**:
   - Read from the existing `useAgentStream()` return values — don't open a second SSE connection.
   - If you need a new event type from the backend, extend the SSE parser in `useAgentStream.ts` AND emit the event from `backend/api/chat.py`.

4. **Styling**: Tailwind utility classes. Pull shadcn primitives via `pnpm dlx shadcn@latest add <name>` rather than rolling your own button/card/dialog.

5. **Markdown content**: render through `react-markdown` with `remarkGfm` + `rehypeHighlight` (already wired in `Chat.tsx`).

## Demo-polish components worth building (high signal/low effort)
- **Status line** — single rotating sentence: "Searching docs…" → "Drafting answer…" driven by the most recent step.
- **Citation chips** — already scaffolded as `CitationChip.tsx`; parse `[source: id]` from streamed text and render inline.
- **Command palette** — `⌘K` opens a list of preset queries. Use shadcn `Dialog` + `Command`.
- **Diagram of the graph** — render the LangGraph DAG (fetch from a `/api/graph` endpoint that returns `graph.get_graph().to_json()`) using mermaid or react-flow.
