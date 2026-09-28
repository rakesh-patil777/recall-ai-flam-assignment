import { BookOpen, CreditCard, Target, Lightbulb, AlertTriangle, Code } from 'lucide-react';

const DIFFICULTY_CONFIG = {
  beginner:            { text: 'text-brand-emerald',   border: 'border-brand-emerald/40',  bg: 'bg-brand-emerald-bg' },
  intermediate:        { text: 'text-amber-700',        border: 'border-amber-300',          bg: 'bg-amber-50' },
  advanced:            { text: 'text-brand-rose',       border: 'border-brand-rose/40',      bg: 'bg-brand-rose-bg' },
  'technical interview':{ text: 'text-brand-blue-dark', border: 'border-brand-blue-mid/50', bg: 'bg-brand-blue' },
};

export default function OverviewScreen({ studySet, onFlashcards, onQuiz }) {
  if (!studySet) return null;

  const diff = studySet.difficulty?.toLowerCase() ?? 'intermediate';
  const diffCfg = DIFFICULTY_CONFIG[diff] ?? DIFFICULTY_CONFIG['intermediate'];

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">

      {/* Title row */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[11px] font-bold tracking-widest uppercase border px-2.5 py-1 rounded-full ${diffCfg.text} ${diffCfg.border} ${diffCfg.bg}`}>
            {studySet.difficulty ?? 'Intermediate'}
          </span>
          {studySet.subject && (
            <span className="text-[11px] font-medium text-brand-muted border border-surface-border bg-surface-2 px-2 py-0.5 rounded-full">
              {studySet.subject}
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-text tracking-tight leading-tight">
          {studySet.topic}
        </h1>
        <p className="text-brand-muted text-sm sm:text-base leading-relaxed max-w-2xl">
          {studySet.summary}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: CreditCard,    label: 'Flashcards',    value: studySet.flashcards?.length ?? 0,    color: 'text-brand-blue-dark',  bg: 'bg-brand-blue' },
          { icon: Target,        label: 'Quiz Questions', value: studySet.quiz?.length ?? 0,           color: 'text-brand-peach-dark', bg: 'bg-brand-peach' },
          { icon: Lightbulb,     label: 'Key Concepts',  value: studySet.keyPoints?.length ?? 0,      color: 'text-amber-700',         bg: 'bg-amber-50' },
          { icon: AlertTriangle, label: 'Common Traps',  value: studySet.commonMistakes?.length ?? 0, color: 'text-brand-rose',        bg: 'bg-brand-rose-bg' },
        ].map(({ icon: Icon, label, value, color, bg }, idx) => (
          <div
            key={label}
            className={`${bg} rounded-2xl p-4 flex flex-col gap-2 animate-card-enter border border-surface-border shadow-card`}
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <Icon className={`w-4 h-4 ${color}`} strokeWidth={1.8} />
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-brand-muted">{label}</p>
          </div>
        ))}
      </div>

      {/* Key points */}
      {studySet.keyPoints?.length > 0 && (
        <section className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
          <h2 className="text-sm font-bold text-brand-text uppercase tracking-widest flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-brand-blue-dark" />
            Core Concepts
          </h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {studySet.keyPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-brand-muted leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-blue-dark shrink-0" />
                {pt}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Common mistakes — peach accent */}
      {studySet.commonMistakes?.length > 0 && (
        <section className="peach-panel rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
          <h2 className="text-sm font-bold text-brand-peach-dark uppercase tracking-widest flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Common Mistakes &amp; Traps
          </h2>
          <ul className="flex flex-col gap-2">
            {studySet.commonMistakes.map((m, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-brand-text leading-relaxed">
                <span className="mt-0.5 text-brand-peach-dark font-bold text-xs shrink-0">{i + 1}.</span>
                {m}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Complexity */}
      {studySet.complexity && (
        <section className="glass-card rounded-2xl p-5 flex flex-col gap-3">
          <h2 className="text-sm font-bold text-brand-text uppercase tracking-widest flex items-center gap-2">
            <Code className="w-4 h-4 text-brand-blue-dark" />
            Complexity
          </h2>
          <div className="flex gap-6 flex-wrap">
            {studySet.complexity.time && (
              <div>
                <p className="text-[11px] text-brand-faint mb-1 uppercase tracking-wider">Time</p>
                <p className="font-mono text-brand-blue-dark font-bold">{studySet.complexity.time}</p>
              </div>
            )}
            {studySet.complexity.space && (
              <div>
                <p className="text-[11px] text-brand-faint mb-1 uppercase tracking-wider">Space</p>
                <p className="font-mono text-brand-blue-dark font-bold">{studySet.complexity.space}</p>
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
            flex items-center justify-between gap-3 p-5 rounded-2xl border border-brand-blue-mid/40
            bg-brand-blue hover:bg-blue-100 hover:border-brand-blue-mid/70
            transition-all duration-200 text-left group shadow-card
          "
        >
          <div>
            <p className="font-bold text-brand-blue-dark text-base">Study Flashcards</p>
            <p className="text-xs text-brand-muted mt-0.5">{studySet.flashcards?.length ?? 0} cards with 3D flip</p>
          </div>
          <CreditCard className="w-5 h-5 text-brand-blue-dark shrink-0 group-hover:scale-110 transition-transform" />
        </button>

        <button
          id="start-quiz-btn"
          onClick={onQuiz}
          className="
            flex items-center justify-between gap-3 p-5 rounded-2xl border border-brand-peach-mid/40
            bg-brand-peach hover:bg-orange-100 hover:border-brand-peach-mid/70
            transition-all duration-200 text-left group shadow-card
          "
        >
          <div>
            <p className="font-bold text-brand-peach-dark text-base">Take the Quiz</p>
            <p className="text-xs text-brand-muted mt-0.5">{studySet.quiz?.length ?? 0} questions · Instant grading</p>
          </div>
          <Target className="w-5 h-5 text-brand-peach-dark shrink-0 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </main>
  );
}
