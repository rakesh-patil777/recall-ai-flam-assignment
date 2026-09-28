import { useRef, useState } from 'react';
import { Sparkles, ChevronRight, Zap } from 'lucide-react';

const EXAMPLE_CHIPS = [
  'Binary Search & Off-by-one Traps',
  'Distributed Systems: Raft Consensus',
  'React Fiber & Concurrent Rendering',
  'Dynamic Programming: Subproblem Patterns',
  'Cellular Respiration & ATP Cycle',
];

export default function LandingScreen({ onGenerate, isLoading }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const MAX_CHARS = 10000;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (input.trim().length >= 2 && !isLoading) {
      onGenerate(input);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleChip = (chip) => {
    setInput(chip);
    textareaRef.current?.focus();
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col items-center gap-10">
      {/* Hero */}
      <div className="text-center flex flex-col items-center gap-5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-indigo/30 bg-brand-indigo/10 text-xs font-semibold tracking-wide text-brand-indigo uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Study Workspace
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight max-w-2xl">
          Turn raw knowledge into{' '}
          <span className="bg-gradient-to-r from-brand-indigo to-brand-violet bg-clip-text text-transparent">
            permanent memory.
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
          Paste complex study notes, interview prep topics, or textbook excerpts.
          RecallAI transforms them into structured overviews, tactile flashcards, and diagnostic quizzes.
        </p>
      </div>

      {/* Input card */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col gap-4 border border-brand-indigo/20 shadow-card-stage">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={handleKeyDown}
            rows={5}
            placeholder="e.g. Teach me Binary Search for senior software engineering interviews. Cover essential concepts, time/space complexity, boundary condition traps, and tricky practice questions..."
            className="w-full resize-none bg-transparent text-slate-200 placeholder-slate-600 text-sm sm:text-base leading-relaxed outline-none font-medium"
            aria-label="Study topic or notes"
            disabled={isLoading}
          />

          {/* Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-3 border-t border-white/[0.06] pt-4">
            <div className="flex items-center gap-3 flex-wrap text-xs text-slate-500 font-mono">
              <span className={input.length > MAX_CHARS * 0.9 ? 'text-brand-amber' : ''}>
                {input.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
              </span>
              {input.length > 10 && (
                <span className="px-2 py-0.5 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 font-sans font-medium text-[11px] not-italic">
                  ~{Math.max(5, Math.round(input.length / 400))} min study time
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={input.trim().length < 2 || isLoading}
              className="
                flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white
                bg-gradient-to-r from-brand-indigo to-brand-violet
                shadow-glow-primary
                hover:from-indigo-500 hover:to-violet-500
                disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                transition-all duration-150
              "
            >
              <Zap className="w-4 h-4" />
              Generate Study Set
              <span className="hidden sm:inline text-[10px] font-mono opacity-60 border border-white/20 rounded px-1 py-0.5 ml-1">
                ⌘↵
              </span>
            </button>
          </div>
        </div>
      </form>

      {/* Inspiration chips */}
      <div className="w-full flex flex-col items-center gap-3">
        <p className="text-xs text-slate-600 font-medium uppercase tracking-widest">Try a popular template</p>
        <div className="flex flex-wrap justify-center gap-2">
          {EXAMPLE_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChip(chip)}
              disabled={isLoading}
              className="
                px-3 py-1.5 rounded-full text-xs font-medium text-slate-400 border border-white/[0.08]
                bg-white/[0.03] hover:border-brand-indigo/30 hover:text-slate-200 hover:bg-brand-indigo/10
                transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Value grid */}
      <div className="w-full grid sm:grid-cols-3 gap-4 mt-2">
        {[
          {
            icon: '📋',
            title: 'Structured Overview',
            desc: 'Key concepts, traps & complexity breakdown — no conversational fluff.',
          },
          {
            icon: '🃏',
            title: 'Interactive Flashcards',
            desc: '3D flip cards with keyboard navigation and mastery tracking.',
          },
          {
            icon: '🎯',
            title: 'Adaptive Quiz & Review',
            desc: 'Instant validation, explanations, and targeted weak-area retry.',
          },
        ].map((item) => (
          <div key={item.title} className="glass-card rounded-2xl p-5 flex flex-col gap-3">
            <div className="text-2xl">{item.icon}</div>
            <p className="text-sm font-semibold text-slate-200">{item.title}</p>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
