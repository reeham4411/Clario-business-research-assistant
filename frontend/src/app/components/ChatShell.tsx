"use client";

import Link from "next/link";
import { useState } from "react";
import { useChat } from "@/app/hooks/useChat";
import { useAutoScroll } from "@/app/hooks/useAutoScroll";
import MessageFeed from "./MessageFeed";
import InputBar from "./InputBar";
import ClarificationModal from "./ClarificationModal";
import AgentTracker from "./AgentTracker";
import StatusBar from "./StatusBar";
import EmptyState from "./EmptyState";
import ThinkingIndicator from "./ThinkingIndicator";
import type { ChatMessage } from "@/app/utils/types";

export default function ChatShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const {
    messages,
    isLoading,
    activeAgent,
    agentPipeline,
    needsClarification,
    clarificationQuestion,
    lastMeta,
    sendMessage,
    submitClarification,
    dismissClarification,
  } = useChat();

  const feedRef = useAutoScroll<ChatMessage[]>(messages);
  const isEmpty = messages.length === 0 && !isLoading;
  const shouldShowSidebar = isLoading || messages.length > 0 || lastMeta;

  return (
    <div className="relative min-h-screen overflow-hidden bg-(--c-ink) text-(--c-snow)">
      <div className="relative z-10 flex h-screen flex-col">
        {/* Header */}
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 bg-black/20 px-8 backdrop-blur-2xl">
          <Link href="/" className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-(--c-mint)/25 bg-(--c-mint)/10">
              <span className="font-serif text-2xl font-semibold text-(--c-mint)">
                C
              </span>
            </div>
            <div>
              <p className="text-lg font-semibold text-white leading-none">
                Clario
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.26em] text-slate-500">
                Research assistant
              </p>
            </div>
          </Link>

          {shouldShowSidebar && (
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:border-white/20"
            >
              {sidebarOpen ? "Hide pipeline" : "Show pipeline"}
            </button>
          )}
        </header>

        {/* Body */}
        <div className="mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 gap-6 px-6 py-6 md:px-8 md:py-8">
          {/* Sidebar */}
          {shouldShowSidebar && sidebarOpen && (
            <aside className="hidden w-80 shrink-0 overflow-y-auto rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-2xl lg:flex lg:flex-col lg:gap-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Agent pipeline
              </p>

              <AgentTracker
                pipeline={agentPipeline}
                activeAgent={activeAgent}
                isLoading={isLoading}
              />

              {lastMeta && (
                <div className="mt-2">
                  <StatusBar meta={lastMeta} />
                </div>
              )}

              <div className="mt-auto rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                  Powered by
                </p>
                <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
                  Groq · Tavily · LangGraph
                </p>
              </div>
            </aside>
          )}

          {/* Main chat area */}
          <main className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            {/* Message feed */}
            <div
              ref={feedRef}
              className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10"
            >
              {isEmpty ? (
                <EmptyState onSuggestionClick={sendMessage} />
              ) : (
                <MessageFeed
                  messages={messages}
                  onSuggestionClick={sendMessage}
                />
              )}

              {isLoading && <ThinkingIndicator activeAgent={activeAgent} />}
            </div>

            {/* Input bar */}
            <div className="shrink-0 border-t border-white/10 bg-black/20 px-6 py-5 md:px-8 md:py-6">
              <InputBar onSend={sendMessage} isLoading={isLoading} />
            </div>
          </main>
        </div>
      </div>

      {needsClarification && (
        <ClarificationModal
          question={clarificationQuestion}
          onSubmit={submitClarification}
          onDismiss={dismissClarification}
        />
      )}
    </div>
  );
}
