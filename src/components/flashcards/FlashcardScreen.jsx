import { useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Target } from 'lucide-react';

export default function FlashcardScreen({
  flashcards, cardIndex, cardRevealed, onReveal, onNext, onPrev, onFlip, onQuiz, onOverview,
}) {
  const total = flashcards?.length ?? 0;
  const card = flashcards?.[cardIndex];
  const progress = total ? ((cardIndex + 1) / total) * 100 : 0;

  // Keyboard navigation
  const handleKey = useCallback((e) => {
    if (e.key === 'ArrowRight' || e.key === 'l') onNext();
    if (e.key === 'ArrowLeft' || e.key === 'h') onPrev();
    if (e.key === ' ' || e.key === 'f') { e.preventDefault(); onFlip(); }
  }, [onNext, onPrev, onFlip]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  if (!card) return null;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Card <span className="text-slate-300 font-semibold">{cardIndex + 1}</span> of {total}</span>
        <span className="font-mono">{Math.round(progress)}% complete</span>
      </div>
      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-violet transition-all duration-400 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Flashcard — 3D flip */}
      <div
        className="w-full cursor-pointer"
        style={{ perspective: '1200px' }}
        onClick={onFlip}
        role="button"
        aria-label={cardRevealed ? 'Hide answer' : 'Show answer'}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onFlip()}
      >
        <div
          className="relative w-full transition-all duration-500 ease-in-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: cardRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '260px',
          }}
        >
          {/* Front — question */}
          <div
            className="absolute inset-0 glass-panel rounded-3xl p-8 flex flex-col justify-between border border-white/[0.08]"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand-indigo">
              <span className="w-2 h-2 rounded-full bg-brand-indigo" />
              Question
            </div>
            <p className="text-xl sm:text-2xl font-semibold text-white leading-snug text-center py-4">
              {card.front}
            </p>
            <p className="text-xs text-slate-600 text-center">Click or press <kbd className="border border-white/10 rounded px-1 py-0.5 font-mono">Space</kbd> to reveal</p>
          </div>

          {/* Back — answer */}
          <div
            className="absolute inset-0 glass-panel rounded-3xl p-8 flex flex-col justify-between border border-brand-indigo/20 bg-gradient-to-b from-brand-indigo/5 to-transparent"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand-emerald">
              <span className="w-2 h-2 rounded-full bg-brand-emerald" />
              Answer
            </div>
            <div className="flex-1 flex items-center justify-center py-4">
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed text-center">
                {card.back}
              </p>
            </div>
            {card.hint && (
              <p className="text-[11px] text-slate-500 text-center border-t border-white/[0.06] pt-3 italic">
                💡 {card.hint}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Nav controls */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onPrev}
          disabled={cardIndex === 0}
          id="flashcard-prev-btn"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-25 disabled:cursor-not-allowed transition-all text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <button
          onClick={onFlip}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-indigo/30 text-brand-indigo hover:bg-brand-indigo/10 transition-all text-sm font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Flip
        </button>

        {cardIndex < total - 1 ? (
          <button
            onClick={onNext}
            id="flashcard-next-btn"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-violet text-white shadow-glow-primary hover:from-indigo-500 hover:to-violet-500 transition-all text-sm font-semibold"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onQuiz}
            id="flashcards-to-quiz-btn"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-violet to-brand-indigo text-white shadow-glow-primary hover:opacity-90 transition-all text-sm font-semibold"
          >
            <Target className="w-4 h-4" /> Take Quiz
          </button>
        )}
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-[11px] text-slate-600">
        <kbd className="border border-white/10 rounded px-1 font-mono">←</kbd>
        {' / '}
        <kbd className="border border-white/10 rounded px-1 font-mono">→</kbd>
        {' navigate · '}
        <kbd className="border border-white/10 rounded px-1 font-mono">Space</kbd>
        {' flip'}
      </p>
    </main>
  );
}
