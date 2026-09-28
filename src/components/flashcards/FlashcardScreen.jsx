import { useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Target } from 'lucide-react';

export default function FlashcardScreen({
  flashcards, cardIndex, cardRevealed, onReveal, onNext, onPrev, onFlip, onQuiz, onOverview,
}) {
  const total    = flashcards?.length ?? 0;
  const card     = flashcards?.[cardIndex];
  const progress = total ? ((cardIndex + 1) / total) * 100 : 0;

  // Keyboard navigation
  const handleKey = useCallback((e) => {
    if (e.key === 'ArrowRight' || e.key === 'l') onNext();
    if (e.key === 'ArrowLeft'  || e.key === 'h') onPrev();
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
      <div className="flex items-center justify-between text-xs text-brand-muted">
        <span>Card <span className="text-brand-text font-semibold">{cardIndex + 1}</span> of {total}</span>
        <span className="font-mono">{Math.round(progress)}% complete</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-border overflow-hidden">
        <div
          className="h-full rounded-full bg-brand-blue-dark transition-all duration-400 ease-out"
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
            className="absolute inset-0 glass-panel rounded-3xl p-8 flex flex-col justify-between"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand-blue-dark">
              <span className="w-2 h-2 rounded-full bg-brand-blue-dark" />
              Question
            </div>
            <p className="text-xl sm:text-2xl font-semibold text-brand-text leading-snug text-center py-4">
              {card.front}
            </p>
            <p className="text-xs text-brand-faint text-center">
              Click or press <kbd className="border border-surface-border rounded px-1 py-0.5 font-mono bg-surface-2">Space</kbd> to reveal
            </p>
          </div>

          {/* Back — answer */}
          <div
            className="absolute inset-0 rounded-3xl p-8 flex flex-col justify-between border border-brand-blue-mid/40 bg-brand-blue"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand-emerald">
              <span className="w-2 h-2 rounded-full bg-brand-emerald" />
              Answer
            </div>
            <div className="flex-1 flex items-center justify-center py-4">
              <p className="text-base sm:text-lg text-brand-text leading-relaxed text-center">
                {card.back}
              </p>
            </div>
            {card.hint && (
              <p className="text-[11px] text-brand-muted text-center border-t border-brand-blue-mid/30 pt-3 italic">
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-border bg-white text-brand-muted hover:text-brand-text hover:border-brand-blue-mid/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-card"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <button
          onClick={onFlip}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-blue-mid/40 bg-brand-blue text-brand-blue-dark hover:bg-blue-100 transition-all text-sm font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Flip
        </button>

        {cardIndex < total - 1 ? (
          <button
            onClick={onNext}
            id="flashcard-next-btn"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue-dark text-white shadow-btn-primary hover:bg-blue-700 transition-all text-sm font-semibold"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onQuiz}
            id="flashcards-to-quiz-btn"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue-dark text-white shadow-btn-primary hover:bg-blue-700 transition-all text-sm font-semibold"
          >
            <Target className="w-4 h-4" /> Take Quiz
          </button>
        )}
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-[11px] text-brand-faint">
        <kbd className="border border-surface-border rounded px-1 font-mono bg-surface-2">←</kbd>
        {' / '}
        <kbd className="border border-surface-border rounded px-1 font-mono bg-surface-2">→</kbd>
        {' navigate · '}
        <kbd className="border border-surface-border rounded px-1 font-mono bg-surface-2">Space</kbd>
        {' flip'}
      </p>
    </main>
  );
}
