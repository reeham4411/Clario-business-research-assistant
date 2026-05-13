const FEATURES = [
  {
    title: "Clarification-first research",
    text: "Clario asks focused follow-up questions when the company or request is unclear.",
  },
  {
    title: "Structured research planning",
    text: "The system breaks every query into useful research aspects before searching.",
  },
  {
    title: "Live source discovery",
    text: "Research is performed through live search instead of only relying on model memory.",
  },
  {
    title: "Confidence-aware answers",
    text: "The workflow scores research quality and routes weak results for validation.",
  },
];

export default function FeatureGrid() {
  return (
    <section
      id="features"
      className="relative flex w-full items-center justify-center px-5 pt-32 pb-44 sm:px-6 md:px-10 md:pt-40 md:pb-56 lg:px-12 lg:pb-64"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center text-center">
        <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center justify-center text-center md:mb-20">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.26em] text-[var(--c-mint)]">
            Features
          </p>

          <h2 className="text-balance text-center text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Built like a research product,{" "}
            <span className="text-slate-300">not a simple chatbot.</span>
          </h2>
        </div>

        <div className="grid w-full gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex min-h-[250px] w-full flex-col items-center justify-start overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 text-center backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-[var(--c-mint)]/25 hover:bg-white/[0.06]"
            >
              <div className="mb-7 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--c-mint)]/10 text-xl text-[var(--c-mint)]">
                ✦
              </div>

              <h3 className="text-center text-lg font-bold leading-snug text-white">
                {feature.title}
              </h3>

              <p className="mt-4 break-words text-center text-sm leading-7 text-slate-400">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
