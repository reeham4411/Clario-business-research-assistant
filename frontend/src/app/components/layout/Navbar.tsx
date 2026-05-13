import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-(--c-ink)/75 backdrop-blur-2xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-(--c-mint)/30 bg-(--c-mint)/10">
            <span className="font-serif text-2xl font-semibold text-(--c-mint)">
              C
            </span>
          </div>

          <div>
            <p className="text-lg font-semibold tracking-tight text-white">
              Clario
            </p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
              Business Research AI
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
          <a href="#features" className="hover:text-white">
            Features
          </a>
          <a href="#workflow" className="hover:text-white">
            Workflow
          </a>
          <a href="#demo" className="hover:text-white">
            Demo
          </a>
        </div>

        <Link
          href="/chat"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-(--c-mint) px-7 py-3 text-base font-bold text-[#04100c] shadow-[0_12px_30px_rgba(52,211,153,0.25)] transition hover:scale-[1.03] hover:shadow-[0_16px_40px_rgba(52,211,153,0.35)] active:scale-95"
        >
          Ask Clario
        </Link>
      </nav>
    </header>
  );
}
