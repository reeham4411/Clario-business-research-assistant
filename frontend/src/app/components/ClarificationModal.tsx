"use client";

import { useEffect, useRef, useState, KeyboardEvent } from "react";

interface Props {
  question: string;
  onSubmit: (text: string) => void;
  onDismiss: () => void;
}

export default function ClarificationModal({
  question,
  onSubmit,
  onDismiss,
}: Props) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close clarification modal"
        className="absolute inset-0 cursor-default bg-slate-950/80 backdrop-blur-md"
        onClick={onDismiss}
      />

      {/* Modal card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1210]/95 shadow-[0_40px_140px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        {/* Decorative glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_50%)]" />
        </div>

        {/* Header */}
        <div className="relative border-b border-white/10 px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-300/20 to-cyan-300/10 text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.16)]">
              <span className="text-xl">◈</span>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-200/70">
                Clarification required
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                Refine your request so research is more accurate.
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="relative px-8 py-8">
          {/* Question display */}
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="border-l-2 border-emerald-300/40 pl-4 text-sm leading-7 text-slate-200">
              {question}
            </p>
          </div>

          {/* Input label */}
          <label className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-400">
            Your clarification
          </label>

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type your answer…"
            className="w-full rounded-2xl border border-white/10 bg-[#09110f] px-5 py-4 text-sm text-white outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-emerald-400/40 focus:bg-[#0b1412]"
          />

          {/* Action buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={onDismiss}
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!value.trim()}
              className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-5 py-4 text-sm font-semibold text-slate-950 transition-all duration-200 hover:brightness-105 hover:shadow-[0_8px_24px_rgba(16,185,129,0.3)] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Clarify &amp; Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
