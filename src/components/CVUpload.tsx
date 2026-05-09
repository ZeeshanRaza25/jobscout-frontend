"use client";
import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function CVUpload({
  onFile,
  uploading,
}: {
  onFile: (f: File) => void;
  uploading: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(false);
      const f = e.dataTransfer.files?.[0];
      if (f) onFile(f);
    },
    [onFile],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      onClick={() => ref.current?.click()}
      className={cn(
        "group relative cursor-pointer rounded-[var(--radius-xl)] p-14 text-center overflow-hidden border-2 border-dashed",
        "transition-all duration-[var(--dur-slow)] ease-[var(--ease-out)]",
        drag
          ? "border-[var(--accent)] bg-[var(--surface-2)] shadow-[var(--shadow-md)] scale-[1.005]"
          : "border-[var(--border-strong)] bg-[var(--surface)] hover:border-[var(--fg-subtle)] hover:bg-[var(--surface-2)] hover:shadow-[var(--shadow-sm)]",
      )}
    >
      <input
        ref={ref}
        type="file"
        accept=".pdf,.docx,.doc,.txt,.md"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />

      <div className="relative flex flex-col items-center gap-4">
        <div
          className={cn(
            "size-16 rounded-[var(--radius-lg)] flex items-center justify-center transition-all duration-[var(--dur-base)]",
            drag
              ? "bg-[var(--accent)] text-[var(--accent-fg)] shadow-[var(--shadow-md)]"
              : "bg-[var(--surface-2)] border border-[var(--border)] text-[var(--fg-muted)] group-hover:bg-[var(--surface-3)] group-hover:text-[var(--fg)]",
          )}
        >
          {uploading ? (
            <Loader2 className="size-6 animate-spin" />
          ) : (
            <UploadCloud className="size-6" strokeWidth={1.5} />
          )}
        </div>

        <div className="space-y-1.5">
          <div className="font-display text-2xl text-[var(--fg)] leading-tight tracking-tight">
            {uploading
              ? "Uploading…"
              : drag
                ? "Release to upload"
                : "Drop your CV here"}
          </div>
          <div className="text-[12.5px] flex items-center justify-center gap-1.5 text-[var(--fg-muted)]">
            <FileText className="size-3.5" strokeWidth={1.5} />
            PDF · DOCX · TXT · max 10 MB
          </div>
          <div className="text-[11px] text-[var(--fg-subtle)]">
            or click to browse
          </div>
        </div>
      </div>
    </div>
  );
}
