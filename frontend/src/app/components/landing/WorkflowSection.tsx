const STEPS = [
  ["Clarity", "Checks if the query is clear enough."],
  ["Planning", "Builds a structured research plan."],
  ["Research", "Searches live business information."],
  ["Validation", "Validates completeness and quality."],
  ["Synthesis", "Writes the final readable answer."],
];

export default function WorkflowSection() {
  return (
    <section
      id="workflow"
      className="relative flex w-full items-center justify-center px-5 pt-20 pb-44 sm:px-6 md:px-10 md:pt-28 md:pb-56 lg:px-12 lg:pb-64"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center text-center">
        <div className="w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-10 md:p-14 lg:p-16">
          <div className="grid w-full items-center justify-center gap-14 lg:grid-cols-2 lg:gap-16">
            <div className="mx-auto flex max-w-xl flex-col items-center justify-center text-center">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.26em] text-[var(--c-mint)]">
                Workflow
              </p>

              <h2 className="text-balance text-center text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                Five agents.{" "}
                <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                  One clear answer.
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-lg text-center text-base leading-8 text-slate-400">
                Each agent has a focused role, helping the system reason through
                ambiguity, gather relevant information, and produce reliable
                company research.
              </p>
            </div>

            <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-4">
              {STEPS.map(([step, desc], index) => (
                <div
                  key={step}
                  className="flex w-full items-center gap-5 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-5 text-left transition-all hover:border-[var(--c-mint)]/20 hover:bg-white/[0.04]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--c-mint)]/10 text-base font-bold text-[var(--c-mint)]">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="break-words text-base font-bold text-white sm:text-lg">
                      {step} Agent
                    </p>
                    <p className="mt-1 break-words text-sm leading-6 text-slate-400">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
