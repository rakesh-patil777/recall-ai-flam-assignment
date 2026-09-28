import { RotateCcw, CreditCard, BookOpen, RefreshCw } from 'lucide-react';

const GRADE_CONFIG = [
  { min: 90, label: 'Outstanding',    emoji: '🏆', color: 'text-brand-emerald',     ringColor: '#15803D' },
  { min: 70, label: 'Proficient',     emoji: '⭐', color: 'text-brand-blue-dark',   ringColor: '#2E6FD8' },
  { min: 50, label: 'Developing',     emoji: '📈', color: 'text-amber-700',          ringColor: '#B45309' },
  { min: 0,  label: 'Needs Practice', emoji: '💪', color: 'text-brand-rose',         ringColor: '#BE123C' },
];

function Radial({ pct, config }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="drop-shadow-md" aria-label={`${Math.round(pct)}% score`}>
      <circle cx="70" cy="70" r={r} fill="none" stroke="#E6E8EC" strokeWidth="12" />
      <circle
        cx="70" cy="70" r={r} fill="none"
        stroke={config.ringColor} strokeWidth="12"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease-out' }}
      />
      <text x="70" y="66" textAnchor="middle" fill="#253449" fontSize="22" fontWeight="bold" fontFamily="Inter, sans-serif">
        {Math.round(pct)}%
      </text>
      <text x="70" y="84" textAnchor="middle" fill="#6B7A8D" fontSize="11" fontFamily="Inter, sans-serif">
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
  const pct    = activeTotal > 0 ? Math.round((activeScore / activeTotal) * 100) : 0;
  const config = GRADE_CONFIG.find(g => pct >= g.min) ?? GRADE_CONFIG[3];

  const showReview = !retryMode && incorrectIds?.length > 0;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6 items-center text-center">

      {/* Score card */}
      <div className="glass-panel w-full rounded-3xl p-8 flex flex-col items-center gap-6">
        <p className="text-3xl">{config.emoji}</p>
        <h1 className={`text-2xl font-bold ${config.color}`}>
          {config.label}
        </h1>

        <Radial pct={pct} config={config} />

        <div className="flex gap-8 text-sm">
          <div>
            <p className="text-brand-faint text-xs uppercase tracking-wider mb-1">Correct</p>
            <p className="text-2xl font-bold text-brand-emerald">{activeScore}</p>
          </div>
          <div className="w-px bg-surface-border" />
          <div>
            <p className="text-brand-faint text-xs uppercase tracking-wider mb-1">Wrong</p>
            <p className="text-2xl font-bold text-brand-rose">{activeTotal - activeScore}</p>
          </div>
          <div className="w-px bg-surface-border" />
          <div>
            <p className="text-brand-faint text-xs uppercase tracking-wider mb-1">Total</p>
            <p className="text-2xl font-bold text-brand-text">{activeTotal}</p>
          </div>
        </div>

        {retryMode && (
          <div className="text-xs text-amber-700 border border-amber-300 bg-amber-50 rounded-xl px-4 py-2.5">
            ♻️ Retry mode — you focused on your {incorrectIds?.length} wrong answers.
          </div>
        )}
      </div>

      {/* Incorrect question review */}
      {showReview && studySet?.quiz && (
        <section className="w-full glass-panel rounded-2xl p-5 flex flex-col gap-4 text-left border-brand-rose/20">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-rose flex items-center gap-2">
            ❌ Missed Questions ({incorrectIds.length})
          </h2>
          <ul className="flex flex-col gap-4">
            {studySet.quiz
              .filter(q => incorrectIds.includes(q.id))
              .map((q, i) => (
                <li key={q.id} className="flex flex-col gap-2 border-b border-surface-border pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-semibold text-brand-text">{i + 1}. {q.question}</p>
                  <p className="text-xs text-brand-emerald font-medium">
                    ✓ Correct answer: {q.options?.[q.correctAnswer]}
                  </p>
                  {q.explanation && (
                    <p className="text-xs text-brand-muted leading-relaxed italic">{q.explanation}</p>
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
              bg-brand-peach-dark shadow-btn-peach
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
            bg-brand-blue-dark shadow-btn-primary
            hover:bg-blue-700 transition-all duration-150
          "
        >
          <RotateCcw className="w-4 h-4" />
          Retake Full Quiz
        </button>
        <button
          id="results-to-flashcards-btn"
          onClick={onFlashcards}
          className="
            flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-brand-text
            border border-surface-border bg-white shadow-card
            hover:border-brand-blue-mid/50 hover:bg-brand-blue transition-all duration-150
          "
        >
          <CreditCard className="w-4 h-4" />
          Review Flashcards
        </button>
        <button
          id="results-to-overview-btn"
          onClick={onOverview}
          className="
            flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-brand-text
            border border-surface-border bg-white shadow-card
            hover:border-brand-blue-mid/50 hover:bg-brand-blue transition-all duration-150
          "
        >
          <BookOpen className="w-4 h-4" />
          Back to Overview
        </button>
      </div>
    </main>
  );
}
