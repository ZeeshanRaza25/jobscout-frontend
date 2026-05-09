"use client";
import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  securityLevel: "loose",
  themeVariables: {
    background: "transparent",
    primaryColor: "#fafaf9",
    primaryTextColor: "#0c0a09",
    primaryBorderColor: "#d6d3d1",
    secondaryColor: "#f5f5f4",
    tertiaryColor: "#ffffff",
    lineColor: "#a8a29e",
    fontFamily: "var(--font-geist-sans), ui-sans-serif",
    fontSize: "12px",
  },
});

export function GraphDiagram({ activeNode }: { activeNode?: string | null }) {
  const [src, setSrc] = useState<string>("");
  const [svg, setSvg] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API}/api/graph`)
      .then((r) => r.json())
      .then((d) => setSrc(d.mermaid))
      .catch(() => setSrc(""));
  }, []);

  useEffect(() => {
    if (!src) return;
    let decorated = src;
    if (activeNode) {
      // Highlight active node — black fill, white text, accent border.
      decorated += `\nstyle ${activeNode} fill:#0c0a09,stroke:#0c0a09,stroke-width:2px,color:#ffffff`;
    }
    mermaid
      .render(`graph-${Date.now()}`, decorated)
      .then(({ svg }) => setSvg(svg))
      .catch(() => {});
  }, [src, activeNode]);

  return (
    <div
      ref={ref}
      className="[&_svg]:max-w-full [&_svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
