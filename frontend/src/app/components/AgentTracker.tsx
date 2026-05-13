"use client";

import clsx from "clsx";
import type { AgentStep, AgentId } from "@/app/utils/types";

type AgentStatus = "active" | "done" | "pending" | "idle";

const STATUS_ORDER: AgentId[] = [
  "clarity",
  "planning",
  "research",
  "validator",
  "synthesis",
];

function getAgentStatus(
  agentId: AgentId,
  activeAgent: AgentId | null,
  isLoading: boolean,
): AgentStatus {
  if (!isLoading && !activeAgent) return "idle";

  const activeIdx = activeAgent ? STATUS_ORDER.indexOf(activeAgent) : -1;
  const thisIdx = STATUS_ORDER.indexOf(agentId);

  if (activeAgent === agentId) return "active";
  if (activeIdx > thisIdx) return "done";

  return "pending";
}

interface Props {
  pipeline: AgentStep[];
  activeAgent: AgentId | null;
  isLoading: boolean;
}

export default function AgentTracker({
  pipeline,
  activeAgent,
  isLoading,
}: Props) {
  return (
    <div className="space-y-3">
      {pipeline.map((agent) => {
        const status = getAgentStatus(
          agent.id as AgentId,
          activeAgent,
          isLoading,
        );

        return (
          <div
            key={agent.id}
            className={clsx(
              "rounded-2xl border p-3 transition",
              status === "active" && "border-(--c-mint)/30 bg-(--c-mint)/10",
              status === "done" && "border-white/10 bg-white/4",
              status === "pending" && "border-white/10 bg-white/2.5",
              status === "idle" && "border-white/10 bg-transparent",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  "flex h-8 w-8 items-center justify-center rounded-xl text-xs",
                  status === "active" && "bg-(--c-mint) text-[#04100c]",
                  status === "done" && "bg-(--c-mint)/15 text-(--c-mint)",
                  status === "pending" && "bg-white/5 text-slate-500",
                  status === "idle" && "bg-white/3 text-slate-600",
                )}
              >
                {status === "done" ? "✓" : agent.icon}
              </div>

              <div>
                <p
                  className={clsx(
                    "text-sm font-medium",
                    status === "active" && "text-[var(--c-mint)]",
                    status === "done" && "text-white",
                    status === "pending" && "text-slate-400",
                    status === "idle" && "text-slate-500",
                  )}
                >
                  {agent.label}
                </p>
                <p className="text-xs text-slate-600">
                  {status === "active"
                    ? "Running"
                    : status === "done"
                      ? "Completed"
                      : "Waiting"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
