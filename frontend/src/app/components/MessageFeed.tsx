"use client";

import MessageBubble from "./MessageBubble";
import SuggestedQuestions from "./SuggestedQuestions";
import type { ChatMessage } from "@/app/utils/types";

interface Props {
  messages: ChatMessage[];
  onSuggestionClick: (query: string) => void;
}

export default function MessageFeed({ messages, onSuggestionClick }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-5 px-5 py-6 sm:px-6 md:px-8 md:py-10">
      {messages.map((msg, idx) => (
        <div key={msg.id} className="w-full space-y-4">
          <MessageBubble message={msg} index={idx} />

          {msg.role === "assistant" &&
            (msg.suggestedQuestions?.length ?? 0) > 0 && (
              <SuggestedQuestions
                questions={msg.suggestedQuestions!}
                onSelect={onSuggestionClick}
              />
            )}
        </div>
      ))}
    </div>
  );
}
