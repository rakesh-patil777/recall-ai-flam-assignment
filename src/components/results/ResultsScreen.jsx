import { RotateCcw, CreditCard, BookOpen, RefreshCw } from 'lucide-react';

const GRADE_CONFIG = [
  { min: 90, label: 'Outstanding', emoji: '🏆', color: 'from-brand-emerald to-teal-500', ring: 'stroke-brand-emerald' },
  { min: 70, label: 'Proficient', emoji: '⭐', color: 'from-brand-indigo to-brand-violet', ring: 'stroke-brand-indigo' },
  { min: 50, label: 'Developing', emoji: '📈', color: 'from-brand-amber to-orange-500', ring: 'stroke-brand-amber' },
  { min: 0, label: 'Needs Practice', emoji: '💪', color: 'from-brand-rose to-rose-500', ring: 'stroke-brand-rose' },
];

function Radial({ pct, config }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="drop-shadow-xl" aria-label={`${Math.round(pct)}% score`}>
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
      <circle
        cx="70" cy="70" r={r} fill="none"
        stroke="url(#scoreGrad)" strokeWidth="12"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease-out' }}
      />
      <defs>
        <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <text x="70" y="66" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" fontFamily="Inter, sans-serif">
        {Math.round(pct)}%
      </text>
      <text x="70" y="84" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="Inter, sans-serif">
        score
      </text>
    </svg>
  );
}

export default function ResultsScreen({
  score, total, incorrectIds, retryMode, retryScore, retryTotal,
  onRetry, onOverview, onFlashcards, onQuizAgain,
  studySet,
}) {
  const activeScore = retryMode ? retryScore : score;
  const activeTotal = retryMode ? (retryTotal ?? incorrectIds?.length ?? total) : total;
  const pct = activeTotal > 0 ? Math.round((activeScore / activeTotal) * 100) : 0;
  const config = GRADE_CONFIG.find(g => pct >= g.min) ?? GRADE_CONFIG[3];

  const showReview = !retryMode && incorrectIds?.length > 0;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6 items-center text-center">
      {/* Score card */}
      <div className="glass-panel w-full rounded-3xl p-8 flex flex-col items-center gap-6 border border-white/[0.08]">
        <p className="text-3xl">{config.emoji}</p>
        <h1 className={`text-2xl font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
          {config.label}
        </h1>

        <Radial pct={pct} config={config} />

        <div className="flex gap-8 text-sm">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Correct</p>
            <p className="text-2xl font-bold text-brand-emerald">{activeScore}</p>
          </div>
          <div className="w-px bg-white/[0.06]" />
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Wrong</p>
            <p className="text-2xl font-bold text-brand-rose">{activeTotal - activeScore}</p>
          </div>
          <div className="w-px bg-white/[0.06]" />
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Total</p>
            <p className="text-2xl font-bold text-slate-300">{activeTotal}</p>
          </div>
        </div>

        {retryMode && (
          <div className="text-xs text-brand-amber border border-brand-amber/20 bg-brand-amber/5 rounded-xl px-4 py-2.5">
            ♻️ Retry mode — you focused on your {incorrectIds?.length} wrong answers.
          </div>
        )}
      </div>

      {/* Incorrect question review */}
      {showReview && studySet?.quiz && (
        <section className="w-full glass-card rounded-2xl p-5 flex flex-col gap-4 text-left border border-brand-rose/10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-rose flex items-center gap-2">
            ❌ Missed Questions ({incorrectIds.length})
          </h2>
          <ul className="flex flex-col gap-4">
            {studySet.quiz
              .filter(q => incorrectIds.includes(q.id))
              .map((q, i) => (
                <li key={q.id} className="flex flex-col gap-2 border-b border-white/[0.04] pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-semibold text-slate-200">{i + 1}. {q.question}</p>
                  <p className="text-xs text-brand-emerald font-medium">
                    ✓ Correct answer: {q.options?.[q.correctAnswer]}
                  </p>
                  {q.explanation && (
                    <p className="text-xs text-slate-500 leading-relaxed italic">{q.explanation}</p>
                  )}
                </li>
              ))
            }
          </ul>
        </section>
      )}

      {/* Action buttons */}
      <div className="grid sm:grid-cols-2 gap-3 w-full">
        {showReview && (
          <button
            id="retry-wrong-btn"
            onClick={onRetry}
            className="
              flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-white
              bg-gradient-to-r from-brand-amber to-orange-500
              hover:opacity-90 transition-all duration-150
            "
          >
            <RefreshCw className="w-4 h-4" />
            Retry Wrong ({incorrectIds.length})
          </button>
        )}
        <button
          id="quiz-again-btn"
          onClick={onQuizAgain}
          className="
            flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-white
            border border-brand-indigo/30 bg-brand-indigo/10
            hover:bg-brand-indigo/20 transition-all duration-150
          "
        >
          <RotateCcw className="w-4 h-4" />
          Retake Full Quiz
        </button>
        <button
          id="results-to-flashcards-btn"
          onClick={onFlashcards}
          className="
            flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-300
            border border-white/[0.08] bg-white/[0.02]
            hover:border-white/20 hover:text-white transition-all duration-150
          "
        >
          <CreditCard className="w-4 h-4" />
          Review Flashcards
        </button>
        <button
          id="results-to-overview-btn"
          onClick={onOverview}
          className="
            flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-300
            border border-white/[0.08] bg-white/[0.02]
            hover:border-white/20 hover:text-white transition-all duration-150
          "
        >
          <BookOpen className="w-4 h-4" />
          Back to Overview
        </button>
      </div>
    </main>
  );
}
