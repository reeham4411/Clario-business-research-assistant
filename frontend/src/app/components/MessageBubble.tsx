"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import clsx from "clsx";
import type { ChatMessage } from "@/app/utils/types";

interface Props {
  message: ChatMessage;
  index: number;
}

export default function MessageBubble({ message, index }: Props) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isError = message.role === "error";

  return (
    <div
      className={clsx(
        "mx-auto flex w-full max-w-5xl gap-4 py-4 animate-slide-up",
        isUser ? "justify-end" : "justify-start",
      )}
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      {!isUser && (
        <div
          className={clsx(
            "mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-sm font-semibold",
            isAssistant &&
              "border-[var(--c-mint)]/20 bg-[var(--c-mint)]/10 text-[var(--c-mint)]",
            isError && "border-red-500/30 bg-red-500/10 text-red-200",
          )}
        >
          {isError ? "!" : "C"}
        </div>
      )}

      <div
        className={clsx(
          "relative max-w-[92%] overflow-hidden rounded-[1.7rem] px-6 py-5 shadow-[0_12px_40px_rgba(0,0,0,0.18)] sm:px-7 sm:py-6 md:max-w-[78%]",
          isUser &&
            "rounded-tr-md border border-[var(--c-mint)]/15 bg-[var(--c-mint)]/10 text-slate-100",
          isAssistant &&
            "rounded-tl-md border border-white/10 bg-white/[0.045] text-slate-200 backdrop-blur-sm",
          isError &&
            "rounded-tl-md border border-red-500/20 bg-red-500/10 text-red-200",
        )}
      >
        {isUser && (
          <p className="break-words text-base leading-8">{message.content}</p>
        )}

        {isAssistant && (
          <div className="prose-research max-w-none break-words text-base leading-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {isError && (
          <p className="break-words text-base leading-8">{message.content}</p>
        )}

        {isAssistant && message.meta && (
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
            {message.meta.confidence != null && (
              <span className="rounded-full border border-[var(--c-mint)]/20 bg-[var(--c-mint)]/10 px-4 py-2 text-sm text-[var(--c-mint)]">
                Confidence {message.meta.confidence.toFixed(1)}/10
              </span>
            )}

            {message.meta.company && (
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                {message.meta.company}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
