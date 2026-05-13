"use client";

interface Suggestion {
  label: string;
  query: string;
}

const SUGGESTIONS: Suggestion[] = [
  {
    label: "Tesla news",
    query: "What are Tesla's latest business developments?",
  },
  {
    label: "Apple financials",
    query: "Give me a financial overview of Apple Inc.",
  },
  {
    label: "Google position",
    query: "What is Google's market position and main competitors?",
  },
  {
    label: "Microsoft leadership",
    query: "Who is Microsoft's CEO and what is their current strategy?",
  },
];

interface Props {
  onSuggestionClick: (query: string) => void;
}

export default function EmptyState({ onSuggestionClick }: Props) {
  return (
    <div className="mx-auto flex min-h-full w-full items-center justify-center px-5 py-12 text-center sm:px-6 md:px-10">
      <section className="relative mx-auto flex w-full max-w-2xl flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 text-center shadow-[0_30px_110px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-10 md:p-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[var(--c-mint)]/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[var(--c-teal)]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--c-mint)]/25 bg-[var(--c-mint)]/10">
            <span className="font-serif text-4xl font-semibold text-[var(--c-mint)]">
              C
            </span>
          </div>

          <p className="mb-4 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--c-mint)]/70">
            Multi-agent business intelligence
          </p>

          <h2 className="text-balance text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
            Ask Clario about any company.
          </h2>

          <p className="mx-auto mt-5 max-w-md text-center text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
            Clario clarifies your query, plans the research, searches live
            sources, validates findings, and writes a concise business summary.
          </p>

          <div className="mx-auto mt-7 flex max-w-lg flex-wrap items-center justify-center gap-2">
            {["Clarity", "Planning", "Research", "Validation", "Synthesis"].map(
              (item) => (
                <span
                  key={item}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-center text-xs font-medium text-slate-300"
                >
                  {item}
                </span>
              ),
            )}
          </div>

          <div className="mx-auto mt-9 grid w-full gap-4 sm:grid-cols-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => onSuggestionClick(s.query)}
                className="flex min-h-[120px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-5 text-center transition hover:-translate-y-0.5 hover:border-[var(--c-mint)]/30 hover:bg-white/[0.06]"
              >
                <p className="text-center text-sm font-bold text-white">
                  {s.label}
                </p>
                <p className="mt-2 line-clamp-2 break-words text-center text-xs leading-5 text-slate-400">
                  {s.query}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
