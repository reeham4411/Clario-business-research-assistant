export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 py-10 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>© 2026 Clario. Multi-agent business research assistant.</p>
        <p>Built with LangGraph · Groq · Tavily · Next.js</p>
      </div>
    </footer>
  );
}
