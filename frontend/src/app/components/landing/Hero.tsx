import Link from "next/link";

export default function Hero() {
  const agents = [
    ["Clarity Agent", "Understands the company and query"],
    ["Planning Agent", "Creates a focused research plan"],
    ["Research Agent", "Searches live business sources"],
    ["Validator Agent", "Checks confidence and quality"],
    ["Synthesis Agent", "Generates the final answer"],
  ];

  return (
    <section className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden px-5 pt-28 pb-44 sm:px-6 md:px-10 md:pb-56 lg:px-12 lg:pb-64">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute left-0 bottom-1/4 h-72 w-72 rounded-full bg-emerald-300/5 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center text-center">
        {/* Badge */}
        <p className="mb-8 inline-flex max-w-full items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-5 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200 sm:px-6">
          Multi-agent business intelligence
        </p>

        {/* Headline */}
        <h1 className="mx-auto max-w-5xl text-balance text-center text-4xl font-semibold leading-[1.12] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="block">Research companies</span>
          <span className="block">
            with{" "}
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-200 bg-clip-text text-transparent">
              clarity, speed
            </span>
          </span>
          <span className="block">
            and{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent">
              confidence.
            </span>
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-8 max-w-3xl text-center text-base leading-8 text-slate-300 sm:text-lg md:text-xl md:leading-9">
          Clario uses specialized agents to clarify your question, plan the
          research, search live sources, validate quality, and synthesize a
          polished business answer.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row sm:gap-5">
          <Link
            href="/chat"
            className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300 px-8 py-4 text-base font-bold text-slate-950 shadow-[0_18px_45px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_22px_55px_rgba(16,185,129,0.42)] active:scale-95 sm:w-auto sm:min-w-[260px]"
          >
            Ask our multi-agent model
          </Link>

          <a
            href="#workflow"
            className="inline-flex min-h-14 w-full items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-4 text-base font-bold text-white transition-all hover:border-emerald-400/30 hover:bg-white/10 active:scale-95 sm:w-auto sm:min-w-[220px]"
          >
            See how it works
          </a>
        </div>

        {/* Flow card */}
        <div className="mx-auto mt-32 w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:mt-36 sm:p-7 md:mt-40 md:p-8">
          <div className="mb-7 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-xl font-bold text-white">Live research flow</p>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-sm font-semibold text-emerald-200">
              Active
            </span>
          </div>

          <div className="space-y-4">
            {agents.map(([title, desc], index) => (
              <div
                key={title}
                className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition-colors hover:bg-white/[0.07] sm:gap-5 sm:p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/15 bg-gradient-to-br from-emerald-400/20 to-cyan-400/10 text-base font-bold text-emerald-200">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="truncate text-base font-bold text-white">
                    {title}
                  </p>
                  <p className="mt-1 break-words text-sm leading-6 text-slate-400 sm:text-base">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
