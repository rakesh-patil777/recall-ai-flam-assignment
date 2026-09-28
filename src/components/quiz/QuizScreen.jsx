import { Check, X, ChevronRight } from 'lucide-react';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizScreen({
  questions, quizIndex, selectedOption, submittedAnswer,
  onSelectOption, onSubmitAnswer, onNextQuestion, retryMode,
}) {
  const total    = questions?.length ?? 0;
  const question = questions?.[quizIndex];
  const progress = total ? (quizIndex / total) * 100 : 0;

  if (!question) return null;

  const isAnswered = submittedAnswer !== null;
  const isCorrect  = isAnswered && submittedAnswer === question.correctAnswer;

  const getOptionState = (idx) => {
    if (!isAnswered) {
      return selectedOption === idx ? 'selected' : 'idle';
    }
    if (idx === question.correctAnswer) return 'correct';
    if (idx === submittedAnswer && submittedAnswer !== question.correctAnswer) return 'wrong';
    return 'idle';
  };

  const optionStyles = {
    idle:     'border-surface-border bg-white text-brand-text hover:border-brand-blue-mid/50 hover:bg-brand-blue cursor-pointer',
    selected: 'border-brand-blue-mid bg-brand-blue text-brand-blue-dark cursor-pointer shadow-focus-ring',
    correct:  'border-brand-emerald/50 bg-brand-emerald-bg text-brand-emerald cursor-default',
    wrong:    'border-brand-rose/50 bg-brand-rose-bg text-brand-rose cursor-default',
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {retryMode && (
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 border border-amber-300 bg-amber-50 px-2 py-0.5 rounded-full">
              Retry Mode
            </span>
          )}
        </div>
        <span className="text-xs text-brand-muted font-mono">
          {quizIndex + 1} / {total}
        </span>
      </div>

      {/* Progress */}
      <div className="h-1.5 rounded-full bg-surface-border overflow-hidden">
        <div
          className="h-full rounded-full bg-brand-blue-dark transition-all duration-400 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-xl bg-brand-blue border border-brand-blue-mid/40 flex items-center justify-center text-xs font-bold text-brand-blue-dark shrink-0">
            Q{quizIndex + 1}
          </div>
          <p className="text-base sm:text-lg font-semibold text-brand-text leading-snug pt-1">
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5">
          {question.options?.map((opt, idx) => {
            const state = getOptionState(idx);
            return (
              <button
                key={idx}
                id={`quiz-option-${idx}`}
                onClick={() => !isAnswered && onSelectOption(idx)}
                disabled={isAnswered}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border text-left
                  transition-all duration-150 text-sm font-medium
                  ${optionStyles[state]}
                  ${isAnswered ? 'cursor-default' : ''}
                `}
              >
                <span className={`
                  w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0
                  ${state === 'correct' ? 'bg-brand-emerald/20 text-brand-emerald' :
                    state === 'wrong'   ? 'bg-brand-rose/20 text-brand-rose' :
                    state === 'selected'? 'bg-brand-blue-dark/15 text-brand-blue-dark' :
                    'bg-surface-2 text-brand-faint'}
                `}>
                  {state === 'correct' ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> :
                   state === 'wrong'   ? <X className="w-3.5 h-3.5" strokeWidth={3} /> :
                   OPTION_LABELS[idx]}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation after answer */}
        {isAnswered && question.explanation && (
          <div className={`rounded-xl p-4 border flex items-start gap-3 text-sm ${
            isCorrect
              ? 'border-brand-emerald/30 bg-brand-emerald-bg text-brand-text'
              : 'border-brand-peach-mid/40 bg-brand-peach text-brand-text'
          }`}>
            <span className="text-lg shrink-0">{isCorrect ? '✅' : '💡'}</span>
            <p className="leading-relaxed">
              <span className={`font-bold mr-1 ${isCorrect ? 'text-brand-emerald' : 'text-brand-peach-dark'}`}>
                {isCorrect ? 'Correct! ' : 'Not quite. '}
              </span>
              {question.explanation}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-between items-center">
          {!isAnswered ? (
            <button
              id="quiz-submit-btn"
              onClick={onSubmitAnswer}
              disabled={selectedOption === null}
              className="
                ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white
                bg-brand-blue-dark shadow-btn-primary
                hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed
                transition-all duration-150
              "
            >
              Submit Answer
            </button>
          ) : (
            <button
              id="quiz-next-btn"
              onClick={onNextQuestion}
              className="
                ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white
                bg-brand-blue-dark shadow-btn-primary
                hover:bg-blue-700 transition-all duration-150
              "
            >
              {quizIndex < total - 1 ? 'Next Question' : 'See Results'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
