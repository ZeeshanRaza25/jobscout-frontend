export type Profile = {
  name?: string | null;
  headline?: string | null;
  skills: string[];
  titles: string[];
  years_experience?: number | null;
  seniority: string;
  locations: string[];
  industries: string[];
  education: string[];
  languages: string[];
};

export type JobResult = {
  title: string;
  url: string;
  snippet: string;
  source_query: string;
  score?: number | null;
};

export type JobMatch = {
  job: JobResult;
  score: number;
  strengths: string[];
  gaps: string[];
  reasoning: string;
  recommended: boolean;
};

export type Step = { node: string; status: "start" | "end"; ts: number };

export type SessionSummary = {
  session_id: string;
  status: string;
  profile: Profile | null;
  queries: string[];
  query_rationale: string;
  ranked: JobMatch[];
  created_at: string;
};
