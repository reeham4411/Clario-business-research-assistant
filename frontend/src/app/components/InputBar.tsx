"use client";

import {
  useState,
  useRef,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
} from "react";

interface Props {
  onSend: (query: string) => void;
  isLoading: boolean;
}

export default function InputBar({ onSend, isLoading }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;

    onSend(trimmed);
    setValue("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isLoading, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);

    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl items-center justify-center rounded-3xl border border-white/10 bg-white/[0.035] p-2.5 backdrop-blur-xl">
      <div className="flex w-full items-end justify-center gap-3 overflow-hidden rounded-[22px] border border-white/10 bg-[#07100d]/90 px-4 py-3 focus-within:border-[var(--c-mint)]/35">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={1}
          placeholder="Ask about any company… e.g. What are Tesla’s latest developments?"
          className="min-h-[40px] max-h-[120px] flex-1 resize-none bg-transparent text-[15px] leading-7 text-white outline-none placeholder:text-slate-500 disabled:opacity-50"
        />

        <button
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          aria-label="Send"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--c-mint)] text-[#04100c] transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 13L13 7L1 1V5.6L8.8 7L1 8.4V13Z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
