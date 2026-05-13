import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="relative flex w-full items-center justify-center px-5 py-32 sm:px-6 md:px-10 md:py-40 lg:px-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center text-center">
        <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] px-7 py-16 text-center shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:px-10 md:px-16 md:py-20">
          <div className="pointer-events-none absolute inset-0 ">
            <div className="absolute left-1/2 top-0 h-56 w-96 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-cyan-400/8 blur-3xl" />
          </div>

          <div className="relative mx-auto flex max-w-2xl flex-col items-center justify-center text-center">
            <h2 className="text-balance text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Ready to research a company?
            </h2>

            <p className="mx-auto mt-6 max-w-md text-center text-base leading-8 text-slate-300">
              Ask about recent developments, competitors, financials,
              leadership, or market positioning.
            </p>

            <Link
              href="/chat"
              className="mt-10 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300 px-8 py-4 text-base font-bold text-slate-950 shadow-[0_16px_40px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(16,185,129,0.4)] active:scale-95 sm:w-auto sm:min-w-[280px]"
            >
              Start researching with Clario
            </Link>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent " />
    </section>
  );
}
