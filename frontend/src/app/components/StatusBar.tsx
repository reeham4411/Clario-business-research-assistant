"use client";

import type { MessageMeta } from "@/app/utils/types";

interface Props {
  meta: MessageMeta;
}

export default function StatusBar({ meta }: Props) {
  const { confidence, attempts, validation, company } = meta;
  const pct = ((confidence ?? 0) / 10) * 100;

  const confColor =
    (confidence ?? 0) >= 7
      ? "#6EE7B7"
      : (confidence ?? 0) >= 4
        ? "#2DD4BF"
        : "#14B8A6";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Run summary
          </p>
          <p className="mt-1 text-sm text-slate-200">
            Latest research quality indicators
          </p>
        </div>

        <div
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10"
          style={{
            background: `conic-gradient(${confColor} ${pct}%, rgba(255,255,255,0.08) ${pct}% 100%)`,
          }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#08100f] text-[11px] font-semibold text-slate-100">
            {confidence?.toFixed(1) ?? "—"}
          </div>
        </div>
      </div>

      {company && (
        <div className="mb-4 rounded-2xl border border-white/10 bg-[#09110f] px-3 py-2">
          <span className="block text-[10px] uppercase tracking-[0.22em] text-slate-500">
            Company
          </span>
          <span className="mt-1 block truncate text-sm text-slate-100">
            {company}
          </span>
        </div>
      )}

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.22em] text-slate-400">
            Confidence
          </span>
          <span className="text-xs font-medium" style={{ color: confColor }}>
            {confidence?.toFixed(1) ?? "—"}/10
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${confColor}, #67e8f9)`,
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-[#09110f] px-3 py-2">
          <span className="block text-[10px] uppercase tracking-[0.22em] text-slate-500">
            Loops
          </span>
          <span className="mt-1 block text-sm text-slate-100">
            {attempts ?? 1}
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#09110f] px-3 py-2">
          <span className="block text-[10px] uppercase tracking-[0.22em] text-slate-500">
            QA
          </span>
          <span
            className={`mt-1 block text-sm ${
              validation === "sufficient" ? "text-emerald-200" : "text-cyan-200"
            }`}
          >
            {validation ?? "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
