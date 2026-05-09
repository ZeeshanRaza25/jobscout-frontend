---
name: add-trace-event
description: Wire a new event type from the backend stream into the trace panel. Triggers when the user wants to surface new agent activity in the UI — e.g. "show retrieval scores", "render planning thoughts", "display token counts in the trace", or any backend signal that should become visible.
---

# Add a Trace Event Type

The contract crosses backend ↔ frontend; touch both:

## 1. Backend (`backend/api/chat.py`)
In the `gen()` async function inside `chat_stream`, emit the new event:
```python
yield {"event": "<eventname>", "data": json.dumps({...payload...})}
```
Pick the source: a LangGraph event from `astream_events`, a manual yield inside a node (less common — usually nodes don't have stream access), or a derived signal computed from existing events.

## 2. Frontend (`src/hooks/useAgentStream.ts`)
- Add a state slice: `const [<thing>, set<Thing>] = useState<...[]>([])`
- Add a case in the event-parsing switch:
  ```ts
  } else if (event === "<eventname>") {
    set<Thing>((x) => [...x, payload]);
  }
  ```
- Return it from the hook
- Reset it on `send()` alongside `setSteps([])` etc.

## 3. Frontend render
Either extend `TracePanel.tsx` to merge the new events into its sorted timeline, or build a dedicated panel component if the data needs distinct rendering.

## Don't
- Don't emit raw `astream_events` payloads to the frontend wholesale — they include LangChain-internal noise. Filter and shape on the backend.
- Don't add a second SSE connection for new events — extend the existing stream.
