"use client";

interface Props {
  questions: string[];
  onSelect: (q: string) => void;
}

export default function SuggestedQuestions({ questions, onSelect }: Props) {
  if (!questions.length) return null;

  return (
    <div className="ml-0 flex flex-wrap gap-2 pb-2 pl-0 md:ml-12">
      {questions.map((q, i) => (
        <button
          key={i}
          onClick={() => onSelect(q)}
          className="group flex items-start gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400/25 hover:bg-white/8 hover:text-white"
        >
          <span className="mt-0.5 text-emerald-300/80 transition-colors group-hover:text-emerald-200">
            ↳
          </span>
          <span className="max-w-[26rem]">{q}</span>
        </button>
      ))}
    </div>
  );
}
