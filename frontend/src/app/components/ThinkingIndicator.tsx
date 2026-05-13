"use client";

import type { AgentId } from "@/app/utils/types";

const AGENT_MESSAGES: Record<AgentId, string> = {
  clarity: "Evaluating query clarity...",
  planning: "Designing research strategy...",
  research: "Searching across multiple sources...",
  validator: "Validating source quality...",
  synthesis: "Synthesizing final response...",
};

interface Props {
  activeAgent: AgentId | null;
}

export default function ThinkingIndicator({ activeAgent }: Props) {
  const label =
    activeAgent && AGENT_MESSAGES[activeAgent]
      ? AGENT_MESSAGES[activeAgent]
      : "Agents collaborating...";

  return (
    <div className="flex items-start gap-4 py-6 px-2 animate-slide-up">
      <div className="shrink-0 mt-1 relative w-8 h-8">
        <div className="absolute inset-0 rounded-lg bg-forest animate-pulse" />
        <div className="absolute inset-0 rounded-lg bg-forest/50 animate-ping" />
        <div className="relative w-full h-full rounded-lg bg-panel border border-border flex items-center justify-center overflow-hidden">
          <div
            className="absolute left-0 right-0 h-px bg-mint/60 animate-scan"
            style={{ animationDuration: "1.4s" }}
          />
          <span className="text-mint text-xs font-mono z-10">AI</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <span className="text-sm font-body text-snow/60 italic">{label}</span>
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-mint/60 animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: "0.8s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
