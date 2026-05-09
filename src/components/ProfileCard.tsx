"use client";
import {
  Briefcase,
  MapPin,
  GraduationCap,
  Languages,
  Building2,
} from "lucide-react";
import type { Profile } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SENIORITY_LABEL: Record<string, string> = {
  intern: "Intern",
  junior: "Junior",
  mid: "Mid-level",
  senior: "Senior",
  lead: "Lead",
  principal: "Principal",
  unknown: "—",
};

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="px-5 pt-5 pb-5 border-b border-[var(--border-subtle)]">
        <div className="eyebrow mb-3">Candidate profile</div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <h2 className="font-display text-[28px] leading-[1.05] tracking-tight text-[var(--fg)]">
            {profile.name || "—"}
          </h2>
          <div className="text-[12.5px] text-[var(--fg-subtle)]">
            {SENIORITY_LABEL[profile.seniority] ?? profile.seniority}
            {profile.years_experience != null &&
              ` · ${profile.years_experience} yrs experience`}
          </div>
        </div>
        {profile.headline && (
          <p className="text-[14px] text-[var(--fg-muted)] mt-2 leading-relaxed">
            {profile.headline}
          </p>
        )}
      </div>

      <div className="px-5 py-5 space-y-5">
        {profile.titles.length > 0 && (
          <Section
            icon={<Briefcase className="size-3.5" strokeWidth={1.5} />}
            label="Titles"
          >
            <ChipRow items={profile.titles} accent />
          </Section>
        )}
        {profile.skills.length > 0 && (
          <Section
            icon={<Building2 className="size-3.5" strokeWidth={1.5} />}
            label={`Skills · ${profile.skills.length}`}
          >
            <ChipRow items={profile.skills} />
          </Section>
        )}
        {profile.locations.length > 0 && (
          <Section
            icon={<MapPin className="size-3.5" strokeWidth={1.5} />}
            label="Locations"
          >
            <ChipRow items={profile.locations} />
          </Section>
        )}
        {profile.education.length > 0 && (
          <Section
            icon={<GraduationCap className="size-3.5" strokeWidth={1.5} />}
            label="Education"
          >
            <ul className="space-y-0.5 text-[13px] text-[var(--fg-muted)]">
              {profile.education.map((e, i) => (
                <li key={i} className="leading-snug">
                  {e}
                </li>
              ))}
            </ul>
          </Section>
        )}
        {profile.languages.length > 0 && (
          <Section
            icon={<Languages className="size-3.5" strokeWidth={1.5} />}
            label="Languages"
          >
            <ChipRow items={profile.languages} />
          </Section>
        )}
      </div>
    </Card>
  );
}

function Section({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 eyebrow mb-2">
        <span className="text-[var(--fg-faint)]">{icon}</span> {label}
      </div>
      {children}
    </div>
  );
}

function ChipRow({
  items,
  accent = false,
}: {
  items: string[];
  accent?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((s, i) => (
        <span
          key={i}
          className={cn(
            "text-[12px] rounded-[var(--radius-sm)] px-2 py-0.5 font-medium",
            accent
              ? "bg-[var(--accent)] text-[var(--accent-fg)]"
              : "bg-[var(--surface-2)] text-[var(--fg)] border border-[var(--border)]",
          )}
        >
          {s}
        </span>
      ))}
    </div>
  );
}
