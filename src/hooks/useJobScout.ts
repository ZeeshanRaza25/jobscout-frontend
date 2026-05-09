"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import type { JobMatch, JobResult, Profile, SessionSummary, Step } from "@/lib/types";

// NEXT_PUBLIC_API_URL is build-time inlined. In dev we tolerate the localhost
// fallback; in a production build we refuse to silently route user data to
// the wrong host.
const API = (() => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url) return url;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Configure it in the Vercel project settings and redeploy.",
    );
  }
  return "http://localhost:8000";
})();

const PIPELINE_NODES = [
  "ingest_cv",
  "extract_profile",
  "plan_queries",
  "search",
  "filter",
  "score",
  "rank",
] as const;

/** Synthesize a fully-completed step trace for a hydrated session whose
 *  pipeline already ran. Without this the ProgressStrip/TracePanel look
 *  empty even though the work is done. */
function synthesizeCompletedSteps(): Step[] {
  const t = Date.now();
  return PIPELINE_NODES.flatMap((node, i) => [
    { node, status: "start" as const, ts: t + i * 2 },
    { node, status: "end" as const, ts: t + i * 2 + 1 },
  ]);
}

export type Phase = "idle" | "uploading" | "running" | "done" | "error";

/** Sentinel thrown by apiFetch when it has already navigated to /sign-in. */
class AuthRedirect extends Error {
  constructor() { super("auth_redirect"); this.name = "AuthRedirect"; }
}

export function useJobScout() {
  const router = useRouter();
  const { getToken, isSignedIn } = useAuth();

  /**
   * Authenticated fetch. Injects the Clerk JWT and, on 401 / signed-out state,
   * redirects to /sign-in with a `redirect_url` so the user lands back here
   * after auth. Always throws AuthRedirect after navigating so callers stop.
   */
  const apiFetch = useCallback(
    async (path: string, init: RequestInit = {}): Promise<Response> => {
      const goSignIn = () => {
        const here = typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/";
        router.push(`/sign-in?redirect_url=${encodeURIComponent(here)}`);
        throw new AuthRedirect();
      };

      const token = isSignedIn ? await getToken() : null;
      if (!token) goSignIn();

      const headers = new Headers(init.headers);
      headers.set("Authorization", `Bearer ${token}`);
      const res = await fetch(`${API}${path}`, { ...init, headers });
      if (res.status === 401) goSignIn();
      return res;
    },
    [getToken, isSignedIn, router],
  );

  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>("");

  const [profile, setProfile] = useState<Profile | null>(null);
  const [queries, setQueries] = useState<string[]>([]);
  const [queryRationale, setQueryRationale] = useState<string>("");
  const [jobs, setJobs] = useState<JobResult[]>([]);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [ranked, setRanked] = useState<JobMatch[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);

  const [history, setHistory] = useState<SessionSummary[]>([]);

  const reset = useCallback(() => {
    setPhase("idle");
    setError(null);
    setSessionId(null);
    setPreview("");
    setProfile(null);
    setQueries([]);
    setQueryRationale("");
    setJobs([]);
    setMatches([]);
    setRanked([]);
    setSteps([]);
  }, []);

  const upload = useCallback(async (file: File) => {
    reset();
    setPhase("uploading");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await apiFetch("/api/cv/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const txt = await res.text();
        setPhase("error");
        setError(txt || `Upload failed (${res.status})`);
        return null;
      }
      const data = await res.json();
      setSessionId(data.session_id);
      setPreview(data.preview);
      setPhase("idle");
      return data.session_id as string;
    } catch (e) {
      if (e instanceof AuthRedirect) return null;
      setPhase("error");
      setError(e instanceof Error ? e.message : "Upload failed");
      return null;
    }
  }, [reset, apiFetch]);

  const run = useCallback(async (sid: string) => {
    setPhase("running");
    setError(null);
    setMatches([]);
    setSteps([]);

    let res: Response;
    try {
      res = await apiFetch("/api/search/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sid }),
      });
    } catch (e) {
      if (e instanceof AuthRedirect) return;
      setPhase("error");
      setError(e instanceof Error ? e.message : "Network error");
      return;
    }
    if (!res.body) {
      setPhase("error");
      setError("No response stream");
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() ?? "";

      for (const block of blocks) {
        let event = "message";
        let data = "";
        for (const line of block.split("\n")) {
          if (line.startsWith("event:")) event = line.slice(6).trim();
          else if (line.startsWith("data:")) data += line.slice(5).trim();
        }
        if (!data) continue;
        let payload: Record<string, unknown> = {};
        try { payload = JSON.parse(data); } catch { continue; }

        switch (event) {
          case "step":
            setSteps((s) => [...s, { ...(payload as { node: string; status: "start" | "end" }), ts: Date.now() }]);
            break;
          case "profile":
            setProfile(payload.profile as Profile);
            break;
          case "queries":
            setQueries((payload.queries as string[]) || []);
            setQueryRationale((payload.rationale as string) || "");
            break;
          case "jobs":
            setJobs((payload.jobs as JobResult[]) || []);
            break;
          case "filter":
            // acknowledged — TracePanel already shows the step event
            break;
          case "match":
            setMatches((m) => [...m, payload as unknown as JobMatch]);
            break;
          case "ranked":
            setRanked((payload.ranked as JobMatch[]) || []);
            setPhase("done");
            break;
          case "error":
            setError((payload.message as string) || "stream error");
            setPhase("error");
            break;
          case "done":
            setPhase((p) => (p === "running" ? "done" : p));
            break;
        }
      }
    }
  }, [apiFetch]);

  /**
   * Hydrate state from an existing backend session.
   * Returns true if the pipeline still needs to run, false if already complete.
   */
  const loadSession = useCallback(async (sid: string): Promise<boolean> => {
    try {
      const res = await apiFetch(`/api/session/${sid}`);
      if (!res.ok) {
        setPhase("error");
        setError(res.status === 404 ? "Session not found" : `Load failed (${res.status})`);
        return false;
      }
      const data = await res.json();
      setSessionId(sid);
      setPreview(data.preview || "");
      if (data.profile) setProfile(data.profile);
      if (Array.isArray(data.queries) && data.queries.length) {
        setQueries(data.queries);
        setQueryRationale(data.query_rationale || "");
      }
      if (Array.isArray(data.ranked) && data.ranked.length) {
        setRanked(data.ranked);
        setMatches(data.ranked);
        setSteps(synthesizeCompletedSteps());
        setPhase("done");
        return false;
      }
      // If backend reports the pipeline is mid-run on another client, surface
      // partial data without firing a duplicate stream.
      if (data.status === "running") {
        setPhase("running");
        return false;
      }
      setPhase("idle");
      return true;
    } catch (e) {
      if (e instanceof AuthRedirect) return false;
      setPhase("error");
      setError(e instanceof Error ? e.message : "Network error");
      return false;
    }
  }, [apiFetch]);

  const loadHistory = useCallback(async () => {
    try {
      const res = await apiFetch("/api/sessions");
      if (res.ok) setHistory(await res.json());
    } catch { /* AuthRedirect or network — leave history empty */ }
  }, [apiFetch]);

  const rerun = useCallback(async (s: SessionSummary) => {
    reset();
    try {
      const res = await apiFetch(`/api/session/${s.session_id}/rerun`, { method: "POST" });
      if (!res.ok) {
        setPhase("error");
        setError(`Rerun failed (${res.status})`);
        return;
      }
      setSessionId(s.session_id);
      // useEffect in page.tsx will pick up sessionId+idle and call run()
    } catch (e) {
      if (e instanceof AuthRedirect) return;
      setPhase("error");
      setError(e instanceof Error ? e.message : "Rerun network error");
    }
  }, [reset, apiFetch]);

  const restoreSession = useCallback((s: SessionSummary) => {
    reset();
    setSessionId(s.session_id);
    if (s.profile) setProfile(s.profile);
    if (s.queries.length) {
      setQueries(s.queries);
      setQueryRationale(s.query_rationale || "");
    }
    if (s.ranked.length) {
      setRanked(s.ranked);
      setMatches(s.ranked);
      setSteps(synthesizeCompletedSteps());
      setPhase("done");
    } else {
      setPhase("idle");
    }
  }, [reset]);

  /** Authenticated rerun by id. Used by the per-session page Re-run button. */
  const rerunById = useCallback(async (sid: string): Promise<boolean> => {
    try {
      const res = await apiFetch(`/api/session/${sid}/rerun`, { method: "POST" });
      if (!res.ok) {
        setPhase("error");
        setError(`Rerun failed (${res.status})`);
        return false;
      }
      return true;
    } catch (e) {
      if (e instanceof AuthRedirect) return false;
      setPhase("error");
      setError(e instanceof Error ? e.message : "Rerun network error");
      return false;
    }
  }, [apiFetch]);

  return {
    phase, error,
    sessionId, preview,
    profile, queries, queryRationale,
    jobs, matches, ranked, steps,
    history,
    upload, run, reset, loadHistory, loadSession, restoreSession, rerun, rerunById,
  };
}
