import { BookOpen, CreditCard, Target, ChevronRight, Lightbulb, AlertTriangle, Code } from 'lucide-react';

const DIFFICULTY_COLOR = {
  beginner: 'text-brand-emerald border-brand-emerald/30 bg-brand-emerald/10',
  intermediate: 'text-brand-amber border-brand-amber/30 bg-brand-amber/10',
  advanced: 'text-brand-rose border-brand-rose/30 bg-brand-rose/10',
};

export default function OverviewScreen({ studySet, onFlashcards, onQuiz }) {
  if (!studySet) return null;

  const diffClass = DIFFICULTY_COLOR[studySet.difficulty?.toLowerCase()] ?? DIFFICULTY_COLOR['intermediate'];

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
      {/* Title row */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[11px] font-bold tracking-widest uppercase border px-2.5 py-1 rounded-full ${diffClass}`}>
            {studySet.difficulty ?? 'Intermediate'}
          </span>
          {studySet.subject && (
            <span className="text-[11px] font-medium text-slate-500 border border-white/[0.06] px-2 py-0.5 rounded-full">
              {studySet.subject}
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
          {studySet.topic}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl">
          {studySet.summary}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: CreditCard, label: 'Flashcards', value: studySet.flashcards?.length ?? 0, color: 'text-brand-indigo' },
          { icon: Target, label: 'Quiz Questions', value: studySet.quiz?.length ?? 0, color: 'text-brand-violet' },
          { icon: Lightbulb, label: 'Key Concepts', value: studySet.keyPoints?.length ?? 0, color: 'text-brand-cyan' },
          { icon: AlertTriangle, label: 'Common Traps', value: studySet.commonMistakes?.length ?? 0, color: 'text-brand-amber' },
        ].map(({ icon: Icon, label, value, color }, idx) => (
          <div key={label} className="glass-card rounded-2xl p-4 flex flex-col gap-2 animate-card-enter" style={{ animationDelay: `${idx * 80}ms` }}>
            <Icon className={`w-4 h-4 ${color}`} strokeWidth={1.8} />
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Key points */}
      {studySet.keyPoints?.length > 0 && (
        <section className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-brand-cyan" />
            Core Concepts
          </h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {studySet.keyPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-cyan shrink-0" />
                {pt}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Common mistakes */}
      {studySet.commonMistakes?.length > 0 && (
        <section className="rounded-2xl p-5 sm:p-6 flex flex-col gap-4 border border-brand-amber/20 bg-brand-amber/5">
          <h2 className="text-sm font-bold text-brand-amber uppercase tracking-widest flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Common Mistakes & Traps
          </h2>
          <ul className="flex flex-col gap-2">
            {studySet.commonMistakes.map((m, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
                <span className="mt-1 text-brand-amber font-bold text-xs shrink-0">{i + 1}.</span>
                {m}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Complexity (if present) */}
      {studySet.complexity && (
        <section className="glass-card rounded-2xl p-5 flex flex-col gap-3">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Code className="w-4 h-4 text-brand-violet" />
            Complexity
          </h2>
          <div className="flex gap-6 flex-wrap">
            {studySet.complexity.time && (
              <div>
                <p className="text-[11px] text-slate-500 mb-1 uppercase tracking-wider">Time</p>
                <p className="font-mono text-brand-violet font-bold">{studySet.complexity.time}</p>
              </div>
            )}
            {studySet.complexity.space && (
              <div>
                <p className="text-[11px] text-slate-500 mb-1 uppercase tracking-wider">Space</p>
                <p className="font-mono text-brand-cyan font-bold">{studySet.complexity.space}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Buttons */}
      <div className="grid sm:grid-cols-2 gap-4 pt-2">
        <button
          id="start-flashcards-btn"
          onClick={onFlashcards}
          className="
            flex items-center justify-between gap-3 p-5 rounded-2xl border border-brand-indigo/30
            bg-gradient-to-br from-brand-indigo/10 to-brand-violet/5
            hover:from-brand-indigo/20 hover:border-brand-indigo/50
            transition-all duration-200 text-left group
          "
        >
          <div>
            <p className="font-bold text-white text-base">Study Flashcards</p>
            <p className="text-xs text-slate-500 mt-0.5">{studySet.flashcards?.length ?? 0} cards with 3D flip</p>
          </div>
          <CreditCard className="w-5 h-5 text-brand-indigo shrink-0 group-hover:scale-110 transition-transform" />
        </button>

        <button
          id="start-quiz-btn"
          onClick={onQuiz}
          className="
            flex items-center justify-between gap-3 p-5 rounded-2xl border border-brand-violet/30
            bg-gradient-to-br from-brand-violet/10 to-brand-indigo/5
            hover:from-brand-violet/20 hover:border-brand-violet/50
            transition-all duration-200 text-left group
          "
        >
          <div>
            <p className="font-bold text-white text-base">Take the Quiz</p>
            <p className="text-xs text-slate-500 mt-0.5">{studySet.quiz?.length ?? 0} questions · Instant grading</p>
          </div>
          <Target className="w-5 h-5 text-brand-violet shrink-0 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </main>
  );
}
